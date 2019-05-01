import { Module } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { SecurityTokenContract, ModuleFactoryContract } from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../contract_wrapper';
import ContractFactory from '../../factories/contractFactory';
import { TxParams, GenericModuleContract, GetLogs, Subscribe } from '../../types';

interface TakeFeeParams extends TxParams {
  amount: BigNumber;
}

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export default class ModuleWrapper extends ContractWrapper {
  public abi: ContractAbi = Module.abi;

  protected contract: Promise<GenericModuleContract>;

  protected contractFactory: ContractFactory;

  protected securityTokenContract = async (): Promise<SecurityTokenContract> => {
    const address = await (await this.contract).securityToken.callAsync();
    return this.contractFactory.getSecurityTokenContract(address);
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

  public takeFee = async (params: TakeFeeParams) => {
    return (await this.contract).takeFee.sendTransactionAsync(params.amount, params.txData, params.safetyFactor);
  };
}
