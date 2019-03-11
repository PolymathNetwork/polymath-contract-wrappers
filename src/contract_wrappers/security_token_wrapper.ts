import { SecurityTokenContract, SecurityTokenEventArgs, SecurityTokenEvents } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
} from '../types';
import { assert } from '../utils/assert';
import { schemas } from '@0x/json-schemas';

/**
 * @param type type of the module
 */
export interface IGetModulesByTypeParams {
  type: number;
}

export interface IAddModuleParams extends ITxParams {
  moduleFactory: string;
  data: string;
  maxCost: BigNumber;
  budget: BigNumber;
}

/**
* @param module address of the module
*/
export interface IGetModuleParams {
  module: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
export interface IVerifyTransferParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  private address: string;
  private securityTokenContract: Promise<SecurityTokenContract>;
  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper);
    this.address = address;
    this.securityTokenContract = this._getSecurityTokenContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.securityTokenContract).address;
  }

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: IGetModulesByTypeParams): Promise<string[]> => {
    return (await this.securityTokenContract).getModulesByType.callAsync(
      params.type,
    );
  }

  /**
   * Attachs a module to the SecurityToken
   */
  public addModule = async (params: IAddModuleParams) => {
    return async () => {
      return (await this.securityTokenContract).addModule.sendTransactionAsync(
        params.moduleFactory,
        params.data,
        params.maxCost,
        params.budget
      );
    }
  }

  /**
   * @return Returns the data associated to a module
   */
  public getModule = async (params: IGetModuleParams): Promise<[string, string, string, boolean, BigNumber[]]> => {
    return (await this.securityTokenContract).getModule.callAsync(params.module);
  }

  /**
   * Symbol of the Token
   */
  public getSymbol = async (): Promise<string> => {
    return await (await this.securityTokenContract).symbol.callAsync();
  }

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: IVerifyTransferParams): Promise<boolean> => {
    return await (await this.securityTokenContract).verifyTransfer.callAsync(
      params.from,
      params.to,
      params.value,
      params.data,
    );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync = async <ArgsType extends SecurityTokenEventArgs>(
    params: ISubscribeAsyncParams<SecurityTokenEvents, ArgsType>
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.securityTokenContract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        (SecurityToken as any).abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this._unsubscribe(subscriptionToken);
  }

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    super._unsubscribeAll();
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync = async <ArgsType extends SecurityTokenEventArgs>(
    params: IGetLogsAsyncParams<SecurityTokenEvents>
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.securityTokenContract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        (SecurityToken as any).abi,
    );
    return logs;
  }

  private async _getSecurityTokenContract(): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(
      this.abi,
      this.address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
