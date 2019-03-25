import {
  ERC20DividendCheckpointContract,
  ERC20DividendCheckpointEventArgs,
  ERC20DividendCheckpointEvents,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs,
  ERC20DividendCheckpointSetWithholdingEventArgs,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ERC20DividendCheckpoint } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { DividendCheckpointWrapper } from './dividend_checkpoint_wrapper';
  
  interface IERC20DividendDepositedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendDeposited,
    callback: EventCallback<ERC20DividendCheckpointERC20DividendDepositedEventArgs>,
  }
  
  interface IGetERC20DividendDepositedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendDeposited,
  }

  interface IERC20DividendClaimedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendClaimed,
    callback: EventCallback<ERC20DividendCheckpointERC20DividendClaimedEventArgs>,
  }
  
  interface IGetERC20DividendClaimedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendClaimed,
  }

  interface IERC20DividendReclaimedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendReclaimed,
    callback: EventCallback<ERC20DividendCheckpointERC20DividendReclaimedEventArgs>,
  }
  
  interface IGetERC20DividendReclaimedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendReclaimed,
  }

  interface IERC20DividendWithholdingWithdrawnSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendWithholdingWithdrawn,
    callback: EventCallback<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs>,
  }
  
  interface IGetERC20DividendWithholdingWithdrawnLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.ERC20DividendWithholdingWithdrawn,
  }

  interface ISetDefaultExcludedAddressesSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.SetDefaultExcludedAddresses,
    callback: EventCallback<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs>,
  }
  
  interface IGetSetDefaultExcludedAddressesLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.SetDefaultExcludedAddresses,
  }

  interface ISetWithholdingSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.SetWithholding,
    callback: EventCallback<ERC20DividendCheckpointSetWithholdingEventArgs>,
  }
  
  interface IGetSetWithholdingLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.SetWithholding,
  }

  interface ISetWithholdingFixedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ERC20DividendCheckpointEvents.SetWithholdingFixed,
    callback: EventCallback<ERC20DividendCheckpointSetWithholdingFixedEventArgs>,
  }
  
  interface IGetSetWithholdingFixedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ERC20DividendCheckpointEvents.SetWithholdingFixed,
  }

  interface IERC20DividendCheckpointSubscribeAsyncParams {
    (params: IERC20DividendDepositedSubscribeAsyncParams): Promise<string>,
    (params: IERC20DividendClaimedSubscribeAsyncParams): Promise<string>,
    (params: IERC20DividendReclaimedSubscribeAsyncParams): Promise<string>,
    (params: IERC20DividendWithholdingWithdrawnSubscribeAsyncParams): Promise<string>,
    (params: ISetDefaultExcludedAddressesSubscribeAsyncParams): Promise<string>,
    (params: ISetWithholdingSubscribeAsyncParams): Promise<string>,
    (params: ISetWithholdingFixedSubscribeAsyncParams): Promise<string>,
  }
  
  interface IGetERC20DividendCheckpointLogsAsyncParams {
    (params: IGetERC20DividendDepositedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendDepositedEventArgs>>>,
    (params: IGetERC20DividendClaimedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendClaimedEventArgs>>>,
    (params: IGetERC20DividendReclaimedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendReclaimedEventArgs>>>,
    (params: IGetERC20DividendWithholdingWithdrawnLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs>>>,
    (params: IGetSetDefaultExcludedAddressesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs>>>,
    (params: IGetSetWithholdingLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingEventArgs>>>,
    (params: IGetSetWithholdingFixedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ERC20DividendCheckpointSetWithholdingFixedEventArgs>>>,
  }
    
    interface IDividendTokensParams {
        investor: BigNumber
    }
    
    interface ICreateDividendParams extends ITxParams {
        maturity: BigNumber,
        expiry: BigNumber,
        token: string,
        amount: BigNumber,
        name: string,
    }
    
    interface ICreateDividendWithCheckpointParams extends ITxParams {
        maturity: BigNumber,
        expiry: BigNumber,
        token: string,
        amount: BigNumber,
        checkpointId: BigNumber,
        name: string,
    }
    
    interface ICreateDividendWithExclusionsParams extends ITxParams {
        maturity: BigNumber,
        expiry: BigNumber,
        token: string,
        amount: BigNumber,
        excluded: string[],
        name: string,
    }

    interface ICreateDividendWithCheckpointAndExclusionsParams extends ITxParams {
        maturity: BigNumber,
        expiry: BigNumber,
        token: string,
        amount: BigNumber,
        checkpointId: BigNumber,
        excluded: string[],
        name: string,
    }

  
  /**
   * This class includes the functionality related to interacting with the ERC20DividendCheckpoint contract.
   */
  export class ERC20DividendCheckpointWrapper extends DividendCheckpointWrapper {
    public abi: ContractAbi = ERC20DividendCheckpoint.abi;
    protected _address: string;
    protected _contract: Promise<ERC20DividendCheckpointContract>;
  
    /**
     * Instantiate ERC20DividendCheckpointWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param address The contract instance address
     */
    constructor(web3Wrapper: Web3Wrapper, address: string) {
        super(web3Wrapper, address);
        this._address = address;
        this._contract = this._getERC20DividendCheckpointContract();
    }

    public dividendTokens = async (params: IDividendTokensParams): Promise<string> => {
        return await (await this._contract).dividendTokens.callAsync(
            params.investor,
        );
    }

    public createDividend = async (params: ICreateDividendParams) => {
        return async () => {
            return (await this._contract).createDividend.sendTransactionAsync(
                params.maturity,
                params.expiry,
                params.token,
                params.amount,
                params.name,
            );
        }
    }

    public createDividendWithCheckpoint = async (params: ICreateDividendWithCheckpointParams) => {
        return async () => {
            return (await this._contract).createDividendWithCheckpoint.sendTransactionAsync(
                params.maturity,
                params.expiry,
                params.token,
                params.amount,
                params.checkpointId,
                params.name,
            );
        }
    }

    public createDividendWithExclusions = async (params: ICreateDividendWithExclusionsParams) => {
        return async () => {
            return (await this._contract).createDividendWithExclusions.sendTransactionAsync(
                params.maturity,
                params.expiry,
                params.token,
                params.amount,
                params.excluded,
                params.name,
            );
        }
    }

    public createDividendWithCheckpointAndExclusions = async (params: ICreateDividendWithCheckpointAndExclusionsParams) => {
        return async () => {
            return (await this._contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
                params.maturity,
                params.expiry,
                params.token,
                params.amount,
                params.checkpointId,
                params.excluded,
                params.name,
            );
        }
    }
  
    /**
     * Subscribe to an event type emitted by the contract.
     * @return Subscription token used later to unsubscribe
     */
    public subscribeAsync: IERC20DividendCheckpointSubscribeAsyncParams = async <ArgsType extends ERC20DividendCheckpointEventArgs>(
      params: ISubscribeAsyncParams
    ): Promise<string> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      assert.isFunction('callback', params.callback);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const subscriptionToken = this._subscribe<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.indexFilterValues,
          ERC20DividendCheckpoint.abi,
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
    public getLogsAsync: IGetERC20DividendCheckpointLogsAsyncParams = async <ArgsType extends ERC20DividendCheckpointEventArgs>(
      params: IGetLogsAsyncParams
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, ERC20DividendCheckpointEvents);
      assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const logs = await this._getLogsAsync<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.blockRange,
          params.indexFilterValues,
          ERC20DividendCheckpoint.abi,
      );
      return logs;
    }
  
    private async _getERC20DividendCheckpointContract(): Promise<ERC20DividendCheckpointContract> {
      return new ERC20DividendCheckpointContract(
        this.abi,
        this._address,
        this._web3Wrapper.getProvider(),
        this._web3Wrapper.getContractDefaults(),
      );
    }
  }
  
