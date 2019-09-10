import {
  ISecurityTokenContract_3_0_0,
  ModuleFactoryContract_3_0_0,
  PolyTokenContract_3_0_0,
  ERC20DetailedContract_3_0_0,
  Web3Wrapper,
  TxData,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../contract_wrapper';
import ContractFactory from '../../factories/contractFactory';
import { PolymathError } from '../../PolymathError';
import { TxParams, GenericModuleContract, GetLogs, Subscribe, ErrorCode, ContractVersion } from '../../types';
import { stringToBytes32, parseModuleTypeValue } from '../../utils/convert';
import functionsUtils from '../../utils/functions_utils';
import assert from '../../utils/assert';

/**
 * @param tokenContract ERC20 Token Contract Address
 */
export interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

/**
 * This class includes the functionality related to interacting with the Module contract.
 */
export default class ModuleWrapper extends ContractWrapper {
  public contract: Promise<GenericModuleContract>;

  public contractFactory: ContractFactory;

  public contractVersion = ContractVersion.V3_0_0;

  public securityTokenContract = async (): Promise<ISecurityTokenContract_3_0_0> => {
    const address = await (await this.contract).securityToken.callAsync();
    return this.contractFactory.getSecurityTokenContract(address);
  };

  public polyTokenContract = async (): Promise<PolyTokenContract_3_0_0> => {
    return this.contractFactory.getPolyTokenContract();
  };

  public detailedERC20TokenContract = async (address: string): Promise<ERC20DetailedContract_3_0_0> => {
    return this.contractFactory.getERC20DetailedContract(address);
  };

  public moduleFactoryContract = async (): Promise<ModuleFactoryContract_3_0_0> => {
    const address = await (await this.contract).factory.callAsync();
    return this.contractFactory.getModuleFactoryContract(address);
  };

  public getLogsAsync: GetLogs | undefined;

  public subscribeAsync: Subscribe | undefined;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GenericModuleContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract);
    this.contract = contract;
    this.contractFactory = contractFactory;
  }

  /**
   * Return init function result
   * @return init function string
   */
  public getInitFunction = async (): Promise<string> => {
    return (await this.contract).getInitFunction.callAsync();
  };

  /**
   * Return poly token address
   * @return address
   */
  public polyToken = async (): Promise<string> => {
    return (await this.contract).polyToken.callAsync();
  };

  /**
   * Return security token address
   * @return address
   */
  public securityToken = async (): Promise<string> => {
    return (await this.contract).securityToken.callAsync();
  };

  /**
   * Return permissions
   * @return list of permissions
   */
  public getPermissions = async (): Promise<string[]> => {
    return (await this.contract).getPermissions.callAsync();
  };

  /**
   * Return factory address
   * @return address
   */
  public factory = async (): Promise<string> => {
    return (await this.contract).factory.callAsync();
  };

  /**
   * Reclaim ETH from contract
   */
  public reclaimETH = async (params: TxParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    return (await this.contract).reclaimETH.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Reclaim ERC20 tokens from contract
   */
  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  public isValidModule = async () => {
    const moduleFactoryContract = await this.moduleFactoryContract();
    const getTypes = await moduleFactoryContract.getTypes.callAsync();
    const types = getTypes.filter(type => {
      // type '6' and '8' are valid but they are not mapped, so we must filter them
      try {
        parseModuleTypeValue(new BigNumber(type));
        return true;
      } catch (e) {
        return false;
      }
    });
    // prevent invalid scenarios
    if (!types.length || types.length > 1) {
      throw new PolymathError({ code: ErrorCode.InvalidData });
    }
    const address = await this.address();
    const result = await (await this.securityTokenContract()).isModule.callAsync(address, types[0]);
    return result;
  };

  public isCallerTheSecurityTokenOwner = async (txData: Partial<TxData> | undefined): Promise<boolean> => {
    const from = await this.getCallerAddress(txData);
    return functionsUtils.checksumAddressComparision(
      from,
      await (await this.securityTokenContract()).owner.callAsync(),
    );
  };

  public isCallerAllowed = async (txData: Partial<TxData> | undefined, perm: string): Promise<boolean> => {
    if (await this.isCallerTheSecurityTokenOwner(txData)) {
      return true;
    }
    const from = await this.getCallerAddress(txData);
    if (
      await (await this.securityTokenContract()).checkPermission.callAsync(
        from,
        (await this.contract).address,
        stringToBytes32(perm),
      )
    ) {
      return true;
    }
    return false;
  };
}
