import { DetailedERC20Contract, DetailedERC20EventArgs, DetailedERC20Events } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { DetailedERC20 } from '@polymathnetwork/contract-artifacts';
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
 * @param spender The address which will spend the funds
 * @param value The amount of tokens to be spent
 */
export interface IApproveParams extends ITxParams {
    spender: string;
    value: BigNumber;
}

/**
 * @param from The address which will spend the funds
 * @param to The address who will receive the funds
 * @param value The amount of tokens to be spent
 */
export interface ITransferFromParams extends ITxParams {
    from: string;
    to: string;
    value: BigNumber;
}

/**
 * @param owner The address to query the the balance of
 */
export interface IGetBalanceOfParams {
    owner?: string;
}

/**
 * @param to The address who will receive the funds
 * @param value The amount of tokens to be spent
 */
export interface ITransferParams extends ITxParams {
    to: string;
    value: BigNumber;
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
 * This class includes the functionality related to interacting with the DetailedERC20 contract.
 */
export class DetailedERC20Wrapper extends ContractWrapper {
  public abi: ContractAbi = DetailedERC20.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private detailedERC20Contract: Promise<DetailedERC20Contract>;

  /**
   * Instantiate DetailedERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.detailedERC20Contract = this._getDetailedERC20Contract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.detailedERC20Contract).address;
  }

  /**
   * Returns the token name
   */
  public getName = async (): Promise<string> => {
    return await (await this.detailedERC20Contract).name.callAsync();
  }

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: IApproveParams) => {
    return async () => {
      return (await this.detailedERC20Contract).approve.sendTransactionAsync(
        params.spender,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Returns the token total supply
   */
  public getTotalSupply = async (): Promise<BigNumber> => {
    return await (await this.detailedERC20Contract).totalSupply.callAsync();
  }

  /**
   * Send tokens amount of tokens from address from to address to
   */
  public transferFrom = async (params: ITransferFromParams) => {
    return async () => {
      return (await this.detailedERC20Contract).transferFrom.sendTransactionAsync(
        params.from,
        params.to,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Returns the setted decimals
   */
  public getDecimals = async (): Promise<BigNumber> => {
    return await (await this.detailedERC20Contract).decimals.callAsync();
  }

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public getBalanceOf = async (params: IGetBalanceOfParams): Promise<BigNumber> => {
    const address = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    return await (await this.detailedERC20Contract).balanceOf.callAsync(
      address
    );
  }

  /**
   * Returns the token symbol
   */
  public getSymbol = async (): Promise<string> => {
    return await (await this.detailedERC20Contract).symbol.callAsync();
  }

  /**
   * Transfer the balance from token owner's account to 'to' account
   */
  public transfer = async (params: ITransferParams) => {
    return async () => {
      return (await this.detailedERC20Contract).transfer.sendTransactionAsync(
        params.to,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Function to check the amount of tokens a spender is allowed to spend
   * @return A BigNumber specifying the amount of tokens left available for the spender
   */
  public allowance = async (params: IAllowanceParams): Promise<BigNumber> => {
    return await (await this.detailedERC20Contract).allowance.callAsync(
      params.owner,
      params.spender
    );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync = async <ArgsType extends DetailedERC20EventArgs>(
    params: ISubscribeAsyncParams<DetailedERC20Events, ArgsType>
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, DetailedERC20Events);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.detailedERC20Contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        DetailedERC20.abi,
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
  public getLogsAsync = async <ArgsType extends DetailedERC20EventArgs>(
    params: IGetLogsAsyncParams<DetailedERC20Events>
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, DetailedERC20Events);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.detailedERC20Contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        DetailedERC20.abi,
    );
    return logs;
  }

  private async _getDetailedERC20Contract(): Promise<DetailedERC20Contract> {
    return new DetailedERC20Contract(
      this.abi,
      await this.polymathRegistry.getPolyTokenAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}