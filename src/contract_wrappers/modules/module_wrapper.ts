import { Module } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import ContractWrapper from '../contract_wrapper';
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

  public getLogsAsync: GetLogs | undefined;

  public subscribeAsync: Subscribe | undefined;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<GenericModuleContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
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
