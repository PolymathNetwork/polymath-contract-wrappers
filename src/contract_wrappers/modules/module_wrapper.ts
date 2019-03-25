import {
    ModuleContract, 
    GeneralPermissionManagerContract, 
    GeneralTransferManagerContract, 
    CappedSTOContract, 
    USDTieredSTOContract,
    ERC20DividendCheckpointContract
  } from '@polymathnetwork/abi-wrappers';
import { Module } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import { ITxParams, GenericModuleContract } from '../../types';

interface ITakeFeeParams extends ITxParams {
  amount: BigNumber,
}

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export class ModuleWrapper extends ContractWrapper {
  public abi: ContractAbi = Module.abi;
  protected _address: string;
  protected _contract: Promise<GenericModuleContract>;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The module contract instance address
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper);
    this._address = address;
    this._contract = this._getModuleContract();
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

  private async _getModuleContract(): Promise<ModuleContract> {
    return new ModuleContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
