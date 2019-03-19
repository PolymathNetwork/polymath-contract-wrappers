import {
    GeneralPermissionManagerContract,
    GeneralPermissionManagerEventArgs,
    GeneralPermissionManagerEvents,
    GeneralPermissionManagerChangePermissionEventArgs,
    GeneralPermissionManagerAddDelegateEventArgs,
  } from '@polymathnetwork/abi-wrappers';
  import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
  import { GeneralPermissionManager } from '@polymathnetwork/contract-artifacts';
  import { Web3Wrapper } from '@0x/web3-wrapper';
  import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
  import { BigNumber } from '@0x/utils';
  import * as _ from 'lodash';
  import { ContractWrapper } from './contract_wrapper';
  import {
    ITxParams,
    IGetLogsAsyncParams,
    ISubscribeAsyncParams,
    EventCallback,
  } from '../types';
  import { assert } from '../utils/assert';
  import { schemas } from '@0x/json-schemas';
  
  interface IChangePermissionSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralPermissionManagerEvents.ChangePermission,
    callback: EventCallback<GeneralPermissionManagerChangePermissionEventArgs>,
  }
  
  interface IGetChangePermissionLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralPermissionManagerEvents.ChangePermission,
  }
  
  interface IAddDelegateSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralPermissionManagerEvents.AddDelegate,
    callback: EventCallback<GeneralPermissionManagerAddDelegateEventArgs>,
  }
  
  interface IGetAddDelegateLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralPermissionManagerEvents.AddDelegate,
  }
  
  interface IGeneralPermissionManagerSubscribeAsyncParams {
    (params: IChangePermissionSubscribeAsyncParams): Promise<string>,
    (params: IAddDelegateSubscribeAsyncParams): Promise<string>,
  }
  
  interface IGetGeneralPermissionManagerLogsAsyncParams {
    (params: IGetChangePermissionLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralPermissionManagerChangePermissionEventArgs>>>,
    (params: IGetAddDelegateLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralPermissionManagerAddDelegateEventArgs>>>,
  }

    interface IPermsParams {
        moduleAddress: string,
        delegateAddress: string,
        permission: string,
    }

    interface ITakeFeeParams extends ITxParams {
        amount: BigNumber,
    }

    interface IAllDelegatesParams {
        index: BigNumber,
    }

    interface IDelegateDetailsParams {
        address: string,
    }

    interface ICheckPermissionParams {
        delegate: string,
        module: string,
        perm: string,
    }

    interface IAddDelegateParams extends ITxParams {
        delegate: string,
        details: string,
    }

    interface IDeleteDelegateParams extends ITxParams {
        delegate: string,
    }

    interface ICheckDelegateParams {
        potentialDelegate: string,
    }

    interface IChangePermissionParams extends ITxParams {
        delegate: string,
        module: string,
        perm: string,
        valid: boolean,
    }

    interface IChangePermissionMultiParams extends ITxParams {
        delegate: string,
        modules: string[],
        perms: string[],
        valids: boolean[],
    }

    interface IGetAllDelegatesWithPermParams {
        module: string,
        perm: string,
    }

    interface IGetAllModulesAndPermsFromTypesParams {
        delegate: string,
        types: Array<number|BigNumber>,
    }

  /**
   * This class includes the functionality related to interacting with the General Permission Manager contract.
   */
  export class GeneralPermissionManagerWrapper extends ContractWrapper {
    public abi: ContractAbi = GeneralPermissionManager.abi;
    private polymathRegistry: PolymathRegistryWrapper;
    private generalPermissionManagerContract: Promise<GeneralPermissionManagerContract>;
  
    /**
     * Instantiate GeneralPermissionManagerWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param polymathRegistry The PolymathRegistryWrapper instance contract
     */
    constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
      super(web3Wrapper);
      this.polymathRegistry = polymathRegistry;
      this.generalPermissionManagerContract = this._getGeneralPermissionManagerContract();
    }
  
    /**
     * Returns the contract address
     */
    public getAddress = async (): Promise<string> => {
      return (await this.generalPermissionManagerContract).address;
    }

    public perms = async (params: IPermsParams): Promise<boolean> => {
        return await (await this.generalPermissionManagerContract).perms.callAsync(
            params.moduleAddress,
            params.delegateAddress,
            params.permission,
        );
    }

    public takeFee = async (params: ITakeFeeParams) => {
        return async () => {
            return (await this.generalPermissionManagerContract).takeFee.sendTransactionAsync(
                params.amount,
            );
        }
    }

    public polyToken = async (): Promise<string> => {
        return await (await this.generalPermissionManagerContract).polyToken.callAsync();
    }

    public CHANGE_PERMISSION = async (): Promise<string> => {
        return await (await this.generalPermissionManagerContract).CHANGE_PERMISSION.callAsync();
    }

    public allDelegates = async (params: IAllDelegatesParams): Promise<string> => {
        return await (await this.generalPermissionManagerContract).allDelegates.callAsync(
            params.index,
        );
    }

    public securityToken = async (): Promise<string> => {
        return await (await this.generalPermissionManagerContract).securityToken.callAsync();
    }

    public factory = async (): Promise<string> => {
        return await (await this.generalPermissionManagerContract).factory.callAsync();
    }

    public delegateDetails = async (params: IDelegateDetailsParams): Promise<string> => {
        return await (await this.generalPermissionManagerContract).delegateDetails.callAsync(
            params.address,
        );
    }

    public getInitFunction = async (): Promise<string> => {
        return await (await this.generalPermissionManagerContract).getInitFunction.callAsync();
    }

    public checkPermission = async (params: ICheckPermissionParams): Promise<boolean> => {
        return await (await this.generalPermissionManagerContract).checkPermission.callAsync(
            params.delegate,
            params.module,
            params.perm,
        );
    }

    public addDelegate = async (params: IAddDelegateParams) => {
        return async () => {
            return (await this.generalPermissionManagerContract).addDelegate.sendTransactionAsync(
                params.delegate,
                params.details,
            );
        }
    }

    public deleteDelegate = async (params: IDeleteDelegateParams) => {
        return async () => {
            return (await this.generalPermissionManagerContract).deleteDelegate.sendTransactionAsync(
                params.delegate,
            );
        }
    }

    public checkDelegate = async (params: ICheckDelegateParams): Promise<boolean> => {
        return await (await this.generalPermissionManagerContract).checkDelegate.callAsync(
            params.potentialDelegate,
        );
    }

    public changePermission = async (params: IChangePermissionParams) => {
        return async () => {
            return (await this.generalPermissionManagerContract).changePermission.sendTransactionAsync(
                params.delegate,
                params.module,
                params.perm,
                params.valid,
            );
        }
    }

    public changePermissionMulti = async (params: IChangePermissionMultiParams) => {
        return async () => {
            return (await this.generalPermissionManagerContract).changePermissionMulti.sendTransactionAsync(
                params.delegate,
                params.modules,
                params.perms,
                params.valids,
            );
        }
    }

    public getAllDelegatesWithPerm = async (params: IGetAllDelegatesWithPermParams): Promise<string[]> => {
        return await (await this.generalPermissionManagerContract).getAllDelegatesWithPerm.callAsync(
            params.module,
            params.perm,
        );
    }

    public getAllModulesAndPermsFromTypes = async (params: IGetAllModulesAndPermsFromTypesParams): Promise<[string[], string[]]> => {
        return await (await this.generalPermissionManagerContract).getAllModulesAndPermsFromTypes.callAsync(
            params.delegate,
            params.types,
        );
    }

    public getAllDelegates = async (): Promise<string[]> => {
        return await (await this.generalPermissionManagerContract).getAllDelegates.callAsync();
    }

    public getPermissions = async (): Promise<string[]> => {
        return await (await this.generalPermissionManagerContract).getPermissions.callAsync();
    }

    /**
     * Subscribe to an event type emitted by the contract.
     * @return Subscription token used later to unsubscribe
     */
    public subscribeAsync: IGeneralPermissionManagerSubscribeAsyncParams = async <ArgsType extends GeneralPermissionManagerEventArgs>(
      params: ISubscribeAsyncParams
    ): Promise<string> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      assert.isFunction('callback', params.callback);
      const normalizedContractAddress = (await this.generalPermissionManagerContract).address.toLowerCase();
      const subscriptionToken = this._subscribe<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.indexFilterValues,
          GeneralPermissionManager.abi,
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
    public getLogsAsync: IGetGeneralPermissionManagerLogsAsyncParams = async <ArgsType extends GeneralPermissionManagerEventArgs>(
      params: IGetLogsAsyncParams
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, GeneralPermissionManagerEvents);
      assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      const normalizedContractAddress = (await this.generalPermissionManagerContract).address.toLowerCase();
      const logs = await this._getLogsAsync<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.blockRange,
          params.indexFilterValues,
          GeneralPermissionManager.abi,
      );
      return logs;
    }
  
    private async _getGeneralPermissionManagerContract(): Promise<GeneralPermissionManagerContract> {
      return new GeneralPermissionManagerContract(
        this.abi,
        await this.polymathRegistry.getPolyTokenAddress(),
        this._web3Wrapper.getProvider(),
        this._web3Wrapper.getContractDefaults(),
      );
    }
  }
  