import {
  BigNumber,
  ERC20DetailedContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  ModuleFactoryContract_3_0_0,
  PolyResponse,
  PolyTokenContract_3_0_0,
  TxData,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../../contract_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import { PolymathError } from '../../../PolymathError';
import { ErrorCode, GenericModuleContract, ModuleType, Perm, TxParams } from '../../../types';
import { parseModuleTypeValue, parsePermBytes32Value, stringToBytes32 } from '../../../utils/convert';
import functionsUtils from '../../../utils/functions_utils';
import assert from '../../../utils/assert';

/**
 * @param tokenContract ERC20 Token Contract Address
 */
export interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

/**
 * This class includes the functionality related to interacting with the Module contract.
 */
export default abstract class ModuleCommon extends ContractWrapper {
  public abstract contract: Promise<GenericModuleContract>;

  public contractFactory: ContractFactory;

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

  /**
   * Instantiate ModuleWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GenericModuleContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract);
    this.contractFactory = contractFactory;
  }

  /**
   *  Check if the module is paused
   *  @return boolean status of paused
   */
  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

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
  public getPermissions = async (): Promise<Perm[]> => {
    const permissions = await (await this.contract).getPermissions.callAsync();
    return permissions.map(parsePermBytes32Value);
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
  public reclaimETH = async (params: TxParams): Promise<PolyResponse> => {
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
  public reclaimERC20 = async (params: ReclaimERC20Params): Promise<PolyResponse> => {
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

  /**
   *  Pause the module
   */
  public pause = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Contract currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  Unpause the module
   */
  public unpause = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(await this.paused(), ErrorCode.PreconditionRequired, 'Contract currently not paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public isValidModule = async (): Promise<boolean> => {
    const moduleFactoryContract = await this.moduleFactoryContract();
    const getTypes = await moduleFactoryContract.getTypes.callAsync();
    const types = getTypes.filter(type => {
      // type '6' and '8' are valid but they are not mapped, so we must filter them
      try {
        const parsedModuleTypeValue = parseModuleTypeValue(new BigNumber(type));
        // We ignore the burn type in this case, we only need the main type
        return parsedModuleTypeValue !== ModuleType.Burn;
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
    const stContract = await this.securityTokenContract();
    return functionsUtils.checksumAddressComparision(from, await stContract.owner.callAsync());
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
