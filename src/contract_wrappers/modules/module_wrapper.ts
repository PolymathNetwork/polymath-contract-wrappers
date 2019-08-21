import {
  ISecurityTokenContract,
  ModuleFactoryContract,
  PolyTokenContract,
  ERC20DetailedContract,
  Web3Wrapper,
  TxData,
} from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../contract_wrapper';
import ContractFactory from '../../factories/contractFactory';
import { TxParams, GenericModuleContract, GetLogs, Subscribe } from '../../types';
import { stringToBytes32 } from '../../utils/convert';
import functionsUtils from '../../utils/functions_utils';
import assert from '../../utils/assert';

interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export default class ModuleWrapper extends ContractWrapper {
  protected contract: Promise<GenericModuleContract>;

  protected contractFactory: ContractFactory;

  protected securityTokenContract = async (): Promise<ISecurityTokenContract> => {
    const address = await (await this.contract).securityToken.callAsync();
    return this.contractFactory.getSecurityTokenContract(address);
  };

  protected polyTokenContract = async (): Promise<PolyTokenContract> => {
    return this.contractFactory.getPolyTokenContract();
  };

  protected detailedERC20TokenContract = async (address: string): Promise<ERC20DetailedContract> => {
    return this.contractFactory.getERC20DetailedContract(address);
  };

  protected moduleFactoryContract = async (): Promise<ModuleFactoryContract> => {
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

  public getInitFunction = async () => {
    return (await this.contract).getInitFunction.callAsync();
  };

  public polyToken = async () => {
    return (await this.contract).polyToken.callAsync();
  };

  public securityToken = async () => {
    return (await this.contract).securityToken.callAsync();
  };

  public getPermissions = async () => {
    return (await this.contract).getPermissions.callAsync();
  };

  public factory = async () => {
    return (await this.contract).factory.callAsync();
  };

  public reclaimETH = async (params: TxParams) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    return (await this.contract).reclaimETH.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'The caller must be the ST owner');
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  protected isCallerTheSecurityTokenOwner = async (txData: Partial<TxData> | undefined): Promise<boolean> => {
    const from = await this.getCallerAddress(txData);
    return functionsUtils.checksumAddressComparision(
      from,
      await (await this.securityTokenContract()).owner.callAsync(),
    );
  };

  protected isCallerAllowed = async (txData: Partial<TxData> | undefined, perm: string): Promise<boolean> => {
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
