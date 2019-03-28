import {
    ManualApprovalTransferManagerContract,
    ManualApprovalTransferManagerEventArgs,
    ManualApprovalTransferManagerEvents,
    ManualApprovalTransferManagerAddManualApprovalEventArgs,
    ManualApprovalTransferManagerModifyManualApprovalEventArgs,
    ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
    ManualApprovalTransferManagerPauseEventArgs,
    ManualApprovalTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { ManualApprovalTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
    TxParams,
    IGetLogsAsyncParams,
    ISubscribeAsyncParams,
    EventCallback,
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
  
  interface IAddManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.AddManualApproval,
    callback: EventCallback<ManualApprovalTransferManagerAddManualApprovalEventArgs>,
  }
  
  interface IGetAddManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.AddManualApproval,
  }

  interface IModifyManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval,
    callback: EventCallback<ManualApprovalTransferManagerModifyManualApprovalEventArgs>,
  }
  
  interface IGetModifyManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.ModifyManualApproval,
  }

  interface IRevokeManualApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval,
    callback: EventCallback<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>,
  }
  
  interface IGetRevokeManualApprovalLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.RevokeManualApproval,
  }

  interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Pause,
    callback: EventCallback<ManualApprovalTransferManagerPauseEventArgs>,
  }
  
  interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Pause,
  }

  interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Unpause,
    callback: EventCallback<ManualApprovalTransferManagerUnpauseEventArgs>,
  }
  
  interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: ManualApprovalTransferManagerEvents.Unpause,
  }

  interface IManualApprovalTransferManagerSubscribeAsyncParams {
    (params: IAddManualApprovalSubscribeAsyncParams): Promise<string>,
    (params: IModifyManualApprovalSubscribeAsyncParams): Promise<string>,
    (params: IRevokeManualApprovalSubscribeAsyncParams): Promise<string>,
    (params: IPauseSubscribeAsyncParams): Promise<string>,
    (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  }
  
  interface IGetManualApprovalTransferManagerLogsAsyncParams {
    (params: IGetAddManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerAddManualApprovalEventArgs>>>,
    (params: IGetModifyManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerModifyManualApprovalEventArgs>>>,
    (params: IGetRevokeManualApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerRevokeManualApprovalEventArgs>>>,
    (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerPauseEventArgs>>>,
    (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<ManualApprovalTransferManagerUnpauseEventArgs>>>,
  }

  /**
   * This class includes the functionality related to interacting with the ManualApproval Transfer Manager contract.
   */
  export class ManualApprovalTransferManagerWrapper extends ModuleWrapper {
    public abi: ContractAbi = ManualApprovalTransferManager.abi;
    protected _contract: Promise<ManualApprovalTransferManagerContract>;
  
    /**
     * Instantiate ManualApprovalTransferManagerWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param address The address of the GTM
     */
    constructor(web3Wrapper: Web3Wrapper, address: string) {
      super(web3Wrapper, address);
      this._contract = this._getManualApprovalTransferManagerContract();
    }
  
    /**
     * Returns the contract address
     */
    public getAddress = async (): Promise<string> => {
      return (await this._contract).address;
    }
  
  
    /**
     * Subscribe to an event type emitted by the contract.
     * @return Subscription token used later to unsubscribe
     */
    public subscribeAsync: IManualApprovalTransferManagerSubscribeAsyncParams = async <ArgsType extends ManualApprovalTransferManagerEventArgs>(
      params: ISubscribeAsyncParams
    ): Promise<string> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      assert.isFunction('callback', params.callback);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const subscriptionToken = this._subscribe<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.indexFilterValues,
          ManualApprovalTransferManager.abi,
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
    public getLogsAsync: IGetManualApprovalTransferManagerLogsAsyncParams = async <ArgsType extends ManualApprovalTransferManagerEventArgs>(
      params: IGetLogsAsyncParams
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, ManualApprovalTransferManagerEvents);
      assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const logs = await this._getLogsAsync<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.blockRange,
          params.indexFilterValues,
          ManualApprovalTransferManager.abi,
      );
      return logs;
    }
  
    private async _getManualApprovalTransferManagerContract(): Promise<ManualApprovalTransferManagerContract> {
      return new ManualApprovalTransferManagerContract(
        this.abi,
        this._address,
        this._web3Wrapper.getProvider(),
        this._web3Wrapper.getContractDefaults(),
      );
    }
  }
  