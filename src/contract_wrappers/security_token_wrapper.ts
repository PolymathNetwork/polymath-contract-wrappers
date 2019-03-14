import { SecurityTokenContract, SecurityTokenEventArgs, SecurityTokenEvents } from '@polymathnetwork/abi-wrappers';
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
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  private address: string;
  private securityTokenContract: Promise<SecurityTokenContract>;
  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address contract
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
   * Returns the token name
   */
  public getName = async (): Promise<string> => {
    return await (await this.securityTokenContract).name.callAsync();
  }

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: IApproveParams) => {
    return async () => {
      return (await this.securityTokenContract).approve.sendTransactionAsync(
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
    return await (await this.securityTokenContract).totalSupply.callAsync();
  }

  /**
   * Send tokens amount of tokens from address from to address to
   */
  public transferFrom = async (params: ITransferFromParams) => {
    return async () => {
      return (await this.securityTokenContract).transferFrom.sendTransactionAsync(
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
    return await (await this.securityTokenContract).decimals.callAsync();
  }

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public getBalanceOf = async (params: IGetBalanceOfParams): Promise<BigNumber> => {
    const address = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    return await (await this.securityTokenContract).balanceOf.callAsync(
      address
    );
  }

  /**
   * Returns the token symbol
   */
  public getSymbol = async (): Promise<string> => {
    return await (await this.securityTokenContract).symbol.callAsync();
  }

  /**
   * Transfer the balance from token owner's account to 'to' account
   */
  public transfer = async (params: ITransferParams) => {
    return async () => {
      return (await this.securityTokenContract).transfer.sendTransactionAsync(
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
    return await (await this.securityTokenContract).allowance.callAsync(
      params.owner,
      params.spender
    );
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
