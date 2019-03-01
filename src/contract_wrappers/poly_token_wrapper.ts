import { PolyTokenContract, PolyTokenEventArgs, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { PolyToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, ContractEventArg, LogWithDecodedArgs, LogEntry } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  ITxParams,
  EventCallback,
  BlockRange,
  IndexedFilterValues,
} from '../types';
import { assert } from '../utils/assert';
import { schemas } from '@0x/json-schemas';

/**
 * @param owner The address to query the the balance of
 */
export interface IGetBalanceOfParams {
  owner?: string;
}

/**
 * @param owner address The address which owns the tokens
 * @param spender address The address which will spend the tokens
 */
export interface IAllowanceParams {
  owner: string;
  spender: string;
}

/**
 * @param to The address to transfer tokens to
 * @param value The amount to be transferred
 */
export interface ITransferParams extends ITxParams {
  to: string;
  value: BigNumber;
}

/**
 * @param from The address to transfer tokens from
 * @param to The address to transfer tokens to
 * @param value The amount to be transferred
 */
export interface ITransferFromParams extends ITxParams {
  from: string;
  to: string;
  value: BigNumber;
}

/**
 * @param spender The address which will spend the funds
 * @param value The amount of tokens to be spent
 */
export interface IApproveParams extends ITxParams {
  spender: string;
  value: BigNumber;
}

/**
 * @param spender The address which will spend the funds.
 * @param addedValue The amount of tokens to increase the allowance by.
 */
export interface IncreaseApprovalParams extends ITxParams {
  spender: string;
  addedValue: BigNumber;
}

/**
 * @param spender The address which will spend the funds.
 * @param subtractedValue The amount of tokens to decrease the allowance by.
 */
export interface DecreaseApprovalParams extends ITxParams {
  spender: string;
  subtractedValue: BigNumber;
}

/**
 * This class includes the functionality related to interacting with the PolyToken contract.
 */
export class PolyTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = PolyToken.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private polyTokenContract: Promise<PolyTokenContract>;

  /**
   * Instantiate PolyTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.polyTokenContract = this._getPolyTokenContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.polyTokenContract).address;
  }

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public getBalanceOf = async (params: IGetBalanceOfParams): Promise<BigNumber> => {
    const address = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    return await (await this.polyTokenContract).balanceOf.callAsync(
      address
    );
  }

  /**
   * Function to check the amount of tokens a spender is allowed to spend
   * @return A BigNumber specifying the amount of tokens left available for the spender
   */
  public allowance = async (params: IAllowanceParams): Promise<BigNumber> => {
    const spender = await this._getDefaultFromAddress();
    return await (await this.polyTokenContract).allowance.callAsync(
      params.owner,
      spender
    );
  }

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: IApproveParams) => {
    return async () => {
      return (await this.polyTokenContract).approve.sendTransactionAsync(
        params.spender,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @param contractAddress     The hex encoded address where the contract is deployed.
   * @param eventName           The contract event you would like to subscribe to.
   * @param indexFilterValues   An object where the keys are indexed args returned by the event and
   *                            the value is the value you are interested in.
   * @param callback            Callback that gets called when a log is added/removed
   * @param isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
   * @return Subscription token used later to unsubscribe
   */
  public subscribe = <ArgsType extends PolyTokenEventArgs>(
    contractAddress: string,
    eventName: PolyTokenEvents,
    indexFilterValues: IndexedFilterValues,
    callback: EventCallback<ArgsType>,
    isVerbose: boolean = false,
  ): string => {
    assert.isETHAddressHex('contractAddress', contractAddress);
    assert.doesBelongToStringEnum('eventName', eventName, PolyTokenEvents);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', callback);
    const normalizedContractAddress = contractAddress.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        eventName,
        indexFilterValues,
        PolyToken.abi,
        callback,
        isVerbose,
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
   * @param contractAddress     An address of the contract that emitted the logs.
   * @param eventName           The contract event you would like to subscribe to.
   * @param blockRange          Block range to get logs from.
   * @param indexFilterValues   An object where the keys are indexed args returned by the event and
   *                            the value is the value you are interested in.
   * @return Array of logs that match the parameters
   */
  public getLogsAsync = async <ArgsType extends PolyTokenEventArgs>(
    contractAddress: string,
    eventName: PolyTokenEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues,
  ): Promise<Array<LogEntry | LogWithDecodedArgs<ArgsType>>> => {
    assert.isETHAddressHex('contractAddress', contractAddress);
    assert.doesBelongToStringEnum('eventName', eventName, PolyTokenEvents);
    assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = contractAddress.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        eventName,
        blockRange,
        indexFilterValues,
        PolyToken.abi,
    );
    return logs;
  }

  private async _getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
      this.abi,
      await this.polymathRegistry.getPolyTokenAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
