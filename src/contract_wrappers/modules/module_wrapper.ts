import {
    ModuleContract
  } from '@polymathnetwork/abi-wrappers';
import { Module } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import { ITxParams } from '../../types';

interface ITakeFeeParams extends ITxParams {
  amount: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export abstract class ModuleWrapper extends ContractWrapper {
  public abi: ContractAbi = Module.abi;
  protected _contract: Promise<ModuleContract>;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleContract>) {
    super(web3Wrapper);
    this._contract = contract;
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this._contract).address;
  }

  public getInitFunction = async (): Promise<string> => {
    return await (await this._contract).getInitFunction.callAsync();
  }

  public polyToken = async (): Promise<string> => {
    return await (await this._contract).polyToken.callAsync();
  }

  public securityToken = async (): Promise<string> => {
    return await (await this._contract).securityToken.callAsync();
  }

  public getPermissions = async (): Promise<string[]> => {
    return await (await this._contract).getPermissions.callAsync();
  }

  public factory = async (): Promise<string> => {
    return await (await this._contract).factory.callAsync();
  }

  public takeFee = async (params: ITakeFeeParams) => {
    return async () => {
      return (await this._contract).takeFee.sendTransactionAsync(
        params.amount,
      );
    }
  }

}
