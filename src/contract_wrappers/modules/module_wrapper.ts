import { ModuleContract } from '@polymathnetwork/abi-wrappers';
import { Module } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import { TxParams, GenericModuleContract, IGetLogs, ISubscribe } from '../../types';

interface TakeFeeParams extends TxParams {
  amount: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export class ModuleWrapper extends ContractWrapper {
  public abi: ContractAbi = Module.abi;
  protected _contract: Promise<GenericModuleContract>;
  public getLogsAsync: IGetLogs | undefined;
  public subscribeAsync: ISubscribe | undefined;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<GenericModuleContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  public getInitFunction = async () => {
    return await (await this._contract).getInitFunction.callAsync();
  }

  public polyToken = async () => {
    return await (await this._contract).polyToken.callAsync();
  }

  public securityToken = async () => {
    return await (await this._contract).securityToken.callAsync();
  }

  public getPermissions = async () => {
    return await (await this._contract).getPermissions.callAsync();
  }

  public factory = async () => {
    return await (await this._contract).factory.callAsync();
  }

  public takeFee = async (params: TakeFeeParams) => {
    return (await this._contract).takeFee.sendTransactionAsync(
      params.amount,
      params.txData,
      params.safetyFactor
    );
  }
}
