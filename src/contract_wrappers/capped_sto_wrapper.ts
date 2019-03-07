import { CappedSTOContract, CappedSTOEventArgs, CappedSTOEvents } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { CappedSTO } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
} from '../types';
import { assert } from '../utils/assert';
import { schemas } from '@0x/json-schemas';

/**
 * 
 */
export interface IGetFundRaiseTypesParams {
  index: number;
}

/**
 * 
 */
export interface IGetFundsRaisedParams {
  index: number;
}

/**
 * This class includes the functionality related to interacting with the CappedSTO contract.
 */
export class CappedSTOWrapper extends ContractWrapper {
  public abi: ContractAbi = CappedSTO.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private cappedSTOContract: Promise<CappedSTOContract>;
  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.cappedSTOContract = this._getCappedSTOContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.cappedSTOContract).address;
  }

  /**
   * Start time of the Capped STO
   */
  public getStartTime = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).startTime.callAsync();
  }

  /**
   * End time of the Capped STO
   */
  public getEndTime = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).endTime.callAsync();
  }

  /**
   * How many token units a buyer gets (multiplied by 10^18) per wei / base unit of POLY
   */
  public getRate = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).rate.callAsync();
  }

  /**
   * How many token base units this STO will be allowed to sell to investors
   */
  public getCap = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).cap.callAsync();
  }

  /**
   * Ethereum account address to hold the funds
   */
  public getWallet = async (): Promise<string> => {
    return await (await this.cappedSTOContract).wallet.callAsync();
  }

  /**
   * Type of currency used to collect the funds
   */
  public getFundRaiseTypes = async (params: IGetFundRaiseTypesParams): Promise<boolean> => {
    return await (await this.cappedSTOContract).fundRaiseTypes.callAsync(params.index);
  }

  /**
   * Returns funds raised by the STO
   */
  public getFundsRaised = async (pasams: IGetFundsRaisedParams): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).fundsRaised.callAsync(pasams.index);
  }

  /**
   * Return the total no. of tokens sold
   */
  public getTotalTokensSold = async(): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).totalTokensSold.callAsync();
  }

  /**
   * Number of individual investors this STO have.
   */
  public getInvestorCount = async (): Promise<BigNumber> => {
    return await (await this.cappedSTOContract).investorCount.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync = async <ArgsType extends CappedSTOEventArgs>(
    params: ISubscribeAsyncParams<CappedSTOEvents, ArgsType>
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.cappedSTOContract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        CappedSTO.abi,
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
  public getLogsAsync = async <ArgsType extends CappedSTOEventArgs>(
    params: IGetLogsAsyncParams<CappedSTOEvents>
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.cappedSTOContract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        CappedSTO.abi,
    );
    return logs;
  }

  private async _getCappedSTOContract(): Promise<CappedSTOContract> {
    return new CappedSTOContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'CappedSTO',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
