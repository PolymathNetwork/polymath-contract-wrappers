import {
    GeneralTransferManagerContract,
    GeneralTransferManagerEventArgs,
    GeneralTransferManagerEvents,
    GeneralTransferManagerChangeIssuanceAddressEventArgs,
    GeneralTransferManagerAllowAllTransfersEventArgs,
    GeneralTransferManagerAllowAllWhitelistTransfersEventArgs,
    GeneralTransferManagerAllowAllWhitelistIssuancesEventArgs,
    GeneralTransferManagerAllowAllBurnTransfersEventArgs,
    GeneralTransferManagerChangeSigningAddressEventArgs,
    GeneralTransferManagerChangeDefaultsEventArgs,
    GeneralTransferManagerModifyWhitelistEventArgs,
    GeneralTransferManagerPauseEventArgs,
    GeneralTransferManagerUnpauseEventArgs
  } from '@polymathnetwork/abi-wrappers';
  import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
  import { GeneralTransferManager } from '@polymathnetwork/contract-artifacts';
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
  
  interface IChangeIssuanceAddressSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.ChangeIssuanceAddress,
    callback: EventCallback<GeneralTransferManagerChangeIssuanceAddressEventArgs>,
  }
  
  interface IGetChangeIssuanceAddressLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.ChangeIssuanceAddress,
  }

  interface IAllowAllTransfersSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllTransfers,
    callback: EventCallback<GeneralTransferManagerAllowAllTransfersEventArgs>,
  }
  
  interface IGetAllowAllTransfersLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllTransfers,
  }

  interface IAllowAllWhitelistTransfersSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllWhitelistTransfers,
    callback: EventCallback<GeneralTransferManagerAllowAllWhitelistTransfersEventArgs>,
  }
  
  interface IGetAllowAllWhitelistTransfersLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllWhitelistTransfers,
  }

  interface IAllowAllWhitelistIssuancesSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllWhitelistIssuances,
    callback: EventCallback<GeneralTransferManagerAllowAllWhitelistIssuancesEventArgs>,
  }
  
  interface IGetAllowAllWhitelistIssuancesLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllWhitelistIssuances,
  }

  interface IAllowAllBurnTransfersSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllBurnTransfers,
    callback: EventCallback<GeneralTransferManagerAllowAllBurnTransfersEventArgs>,
  }
  
  interface IGetAllowAllBurnTransfersLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.AllowAllBurnTransfers,
  }

  interface IChangeSigningAddressSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.ChangeSigningAddress,
    callback: EventCallback<GeneralTransferManagerChangeSigningAddressEventArgs>,
  }
  
  interface IGetChangeSigningAddressLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.ChangeSigningAddress,
  }

  interface IChangeDefaultsSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.ChangeDefaults,
    callback: EventCallback<GeneralTransferManagerChangeDefaultsEventArgs>,
  }
  
  interface IGetChangeDefaultsLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.ChangeDefaults,
  }

  interface IModifyWhitelistSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.ModifyWhitelist,
    callback: EventCallback<GeneralTransferManagerModifyWhitelistEventArgs>,
  }
  
  interface IGetModifyWhitelistLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.ModifyWhitelist,
  }

  interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.Pause,
    callback: EventCallback<GeneralTransferManagerPauseEventArgs>,
  }
  
  interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.Pause,
  }

  interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: GeneralTransferManagerEvents.Unpause,
    callback: EventCallback<GeneralTransferManagerUnpauseEventArgs>,
  }
  
  interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: GeneralTransferManagerEvents.Unpause,
  }

  interface IGeneralTransferManagerSubscribeAsyncParams {
    (params: IChangeIssuanceAddressSubscribeAsyncParams): Promise<string>,
    (params: IAllowAllTransfersSubscribeAsyncParams): Promise<string>,
    (params: IAllowAllWhitelistTransfersSubscribeAsyncParams): Promise<string>,
    (params: IAllowAllWhitelistIssuancesSubscribeAsyncParams): Promise<string>,
    (params: IAllowAllBurnTransfersSubscribeAsyncParams): Promise<string>,
    (params: IChangeSigningAddressSubscribeAsyncParams): Promise<string>,
    (params: IChangeDefaultsSubscribeAsyncParams): Promise<string>,
    (params: IModifyWhitelistSubscribeAsyncParams): Promise<string>,
    (params: IPauseSubscribeAsyncParams): Promise<string>,
    (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  }
  
  interface IGetGeneralTransferManagerLogsAsyncParams {
    (params: IGetChangeIssuanceAddressLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerChangeIssuanceAddressEventArgs>>>,
    (params: IGetAllowAllTransfersLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerAllowAllTransfersEventArgs>>>,
    (params: IGetAllowAllWhitelistTransfersLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerAllowAllWhitelistTransfersEventArgs>>>,
    (params: IGetAllowAllWhitelistIssuancesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerAllowAllWhitelistIssuancesEventArgs>>>,
    (params: IGetAllowAllBurnTransfersLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerAllowAllBurnTransfersEventArgs>>>,
    (params: IGetChangeSigningAddressLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerChangeSigningAddressEventArgs>>>,
    (params: IGetChangeDefaultsLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerChangeDefaultsEventArgs>>>,
    (params: IGetModifyWhitelistLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerModifyWhitelistEventArgs>>>,
    (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerPauseEventArgs>>>,
    (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<GeneralTransferManagerUnpauseEventArgs>>>,
  }
  
    interface IInvestorsParams {
        index: BigNumber,
    }

    interface ITakeFeeParams extends ITxParams {
        amount: BigNumber,
    }

    interface IWhitelistParams {
        address: string,
    }

    interface INonceMapParams {
        address: string,
        nonce: BigNumber,
    }

    interface IChangeDefaultsParams extends ITxParams {
        defaultFromTime: BigNumber,
        defaultToTime: BigNumber,
    }

    interface IChangeIssuanceAddressParams extends ITxParams {
        issuanceAddress: string,
    }

    interface IChangeSigningAddressParams extends ITxParams {
        signingAddress: string,
    }

    interface IChangeAllowAllTransfersParams extends ITxParams {
        allowAllTransfers: boolean,
    }

    interface IChangeAllowAllWhitelistTransfersParams extends ITxParams {
        allowAllWhitelistTransfers: boolean,
    }

    interface IChangeAllowAllWhitelistIssuancesParams extends ITxParams {
        allowAllWhitelistIssuances: boolean,
    }

    interface IChangeAllowAllBurnTransfersParams extends ITxParams {
        allowAllBurnTransfers: boolean,
    }

    interface IVerifyTransferParams extends ITxParams {
        from: string,
        to: string,
        amount: BigNumber,
        data: string,
        isTransfer: boolean,
    }

    interface IModifyWhitelistParams extends ITxParams {
        investor: string,
        fromTime: BigNumber,
        toTime: BigNumber,
        expiryTime: BigNumber,
        canBuyFromSTO: boolean,
    }

    interface IModifyWhitelistSignedParams extends ITxParams {
        investor: string,
        fromTime: BigNumber,
        toTime: BigNumber,
        expiryTime: BigNumber,
        canBuyFromSTO: boolean,
        validFrom: BigNumber,
        validTo: BigNumber,
        nonce: BigNumber,
        v: number|BigNumber,
        r: string,
        s: string,
    }

    interface IGetInvestorsDataParams {
        investors: string[],
    }

  /**
   * This class includes the functionality related to interacting with the General Transfer Manager contract.
   */
  export class GeneralTransferManagerWrapper extends ContractWrapper {
    public abi: ContractAbi = GeneralTransferManager.abi;
    private polymathRegistry: PolymathRegistryWrapper;
    private generalTransferManagerContract: Promise<GeneralTransferManagerContract>;
  
    /**
     * Instantiate GeneralTransferManagerWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param polymathRegistry The PolymathRegistryWrapper instance contract
     */
    constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
      super(web3Wrapper);
      this.polymathRegistry = polymathRegistry;
      this.generalTransferManagerContract = this._getGeneralTransferManagerContract();
    }
  
    /**
     * Returns the contract address
     */
    public getAddress = async (): Promise<string> => {
      return (await this.generalTransferManagerContract).address;
    }
  
    public allowAllBurnTransfers = async (): Promise<boolean> => {
        return await (await this.generalTransferManagerContract).allowAllBurnTransfers.callAsync();
    }

    public WHITELIST = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).WHITELIST.callAsync();
    }

    public allowAllWhitelistTransfers = async (): Promise<boolean> => {
        return await (await this.generalTransferManagerContract).allowAllWhitelistTransfers.callAsync();
    }

    public unpause = async (params: ITxParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).unpause.sendTransactionAsync();
        }
    }

    public investors = async (params: IInvestorsParams): Promise<string> => {
        return await (await this.generalTransferManagerContract).investors.callAsync(
            params.index,
        );
    }

    public paused = async (): Promise<boolean> => {
        return await (await this.generalTransferManagerContract).paused.callAsync();
    }

    public takeFee = async (params: ITakeFeeParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).takeFee.sendTransactionAsync(
                params.amount,
            );
        }
    }

    public polyToken = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).polyToken.callAsync();
    }

    public pause = async (params: ITxParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).pause.sendTransactionAsync();
        }
    } 
    
    public FLAGS = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).FLAGS.callAsync();
    }

    public whitelist = async (params: IWhitelistParams): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> => {
        return await (await this.generalTransferManagerContract).whitelist.callAsync(
            params.address,
        );
    }

    public nonceMap = async (params: INonceMapParams): Promise<boolean> => {
        return await (await this.generalTransferManagerContract).nonceMap.callAsync(
            params.address,
            params.nonce,
        );
    }

    public allowAllTransfers = async (): Promise<boolean> => {
        return await (await this.generalTransferManagerContract).allowAllTransfers.callAsync();
    }

    public signingAddress = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).signingAddress.callAsync();
    }

    public issuanceAddress = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).issuanceAddress.callAsync();
    }

    public securityToken = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).securityToken.callAsync();
    }

    public factory = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).factory.callAsync();
    }

    public FEE_ADMIN = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).FEE_ADMIN.callAsync();
    }

    public allowAllWhitelistIssuances = async (): Promise<boolean> => {
        return await (await this.generalTransferManagerContract).allowAllWhitelistIssuances.callAsync();
    }

    public defaults = async (): Promise<[BigNumber, BigNumber]> => {
        return await (await this.generalTransferManagerContract).defaults.callAsync();
    }

    public getInitFunction = async (): Promise<string> => {
        return await (await this.generalTransferManagerContract).getInitFunction.callAsync();
    }

    public changeDefaults = async (params: IChangeDefaultsParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeDefaults.sendTransactionAsync(
                params.defaultFromTime,
                params.defaultToTime,
            );
        }
    }

    public changeIssuanceAddress = async (params: IChangeIssuanceAddressParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeIssuanceAddress.sendTransactionAsync(
                params.issuanceAddress,
            );
        }
    }

    public changeSigningAddress = async (params: IChangeSigningAddressParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeSigningAddress.sendTransactionAsync(
                params.signingAddress,
            );
        }
    }

    public changeAllowAllTransfers = async (params: IChangeAllowAllTransfersParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeAllowAllTransfers.sendTransactionAsync(
                params.allowAllTransfers,
            );
        }
    }

    public changeAllowAllWhitelistTransfers = async (params: IChangeAllowAllWhitelistTransfersParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeAllowAllWhitelistTransfers.sendTransactionAsync(
                params.allowAllWhitelistTransfers,
            );
        }
    }

    public changeAllowAllWhitelistIssuances = async (params: IChangeAllowAllWhitelistIssuancesParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeAllowAllWhitelistIssuances.sendTransactionAsync(
                params.allowAllWhitelistIssuances,
            );
        }
    }

    public changeAllowAllBurnTransfers = async (params: IChangeAllowAllBurnTransfersParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).changeAllowAllBurnTransfers.sendTransactionAsync(
                params.allowAllBurnTransfers,
            );
        }
    }

    public verifyTransfer = async (params: IVerifyTransferParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).verifyTransfer.sendTransactionAsync(
                params.from,
                params.to,
                params.amount,
                params.data,
                params.isTransfer,
            );
        }
    }

    public modifyWhitelist = async (params: IModifyWhitelistParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).modifyWhitelist.sendTransactionAsync(
                params.investor,
                params.fromTime,
                params.toTime,
                params.expiryTime,
                params.canBuyFromSTO,
            );
        }
    }

    public modifyWhitelistSigned = async (params: IModifyWhitelistSignedParams) => {
        return async () => {
            return (await this.generalTransferManagerContract).modifyWhitelistSigned.sendTransactionAsync(
                params.investor,
                params.fromTime,
                params.toTime,
                params.expiryTime,
                params.canBuyFromSTO,
                params.validFrom,
                params.validTo,
                params.nonce,
                params.v,
                params.r,
                params.s,
            );
        }
    }

    public getInvestors = async (): Promise<string[]> => {
        return await (await this.generalTransferManagerContract).getInvestors.callAsync();
    }

    public getAllInvestorsData = async (): Promise<[string[], BigNumber[], BigNumber[], BigNumber[], boolean[]]> => {
        return await (await this.generalTransferManagerContract).getAllInvestorsData.callAsync();
    }

    public getInvestorsData = async (params: IGetInvestorsDataParams): Promise<[BigNumber[], BigNumber[], BigNumber[], boolean[]]> => {
        return await (await this.generalTransferManagerContract).getInvestorsData.callAsync(
            params.investors,
        );
    }

    public getPermissions = async (): Promise<string[]> => {
        return await (await this.generalTransferManagerContract).getPermissions.callAsync();
    }
  
    /**
     * Subscribe to an event type emitted by the contract.
     * @return Subscription token used later to unsubscribe
     */
    public subscribeAsync: IGeneralTransferManagerSubscribeAsyncParams = async <ArgsType extends GeneralTransferManagerEventArgs>(
      params: ISubscribeAsyncParams
    ): Promise<string> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      assert.isFunction('callback', params.callback);
      const normalizedContractAddress = (await this.generalTransferManagerContract).address.toLowerCase();
      const subscriptionToken = this._subscribe<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.indexFilterValues,
          GeneralTransferManager.abi,
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
    public getLogsAsync: IGetGeneralTransferManagerLogsAsyncParams = async <ArgsType extends GeneralTransferManagerEventArgs>(
      params: IGetLogsAsyncParams
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents);
      assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      const normalizedContractAddress = (await this.generalTransferManagerContract).address.toLowerCase();
      const logs = await this._getLogsAsync<ArgsType>(
          normalizedContractAddress,
          params.eventName,
          params.blockRange,
          params.indexFilterValues,
          GeneralTransferManager.abi,
      );
      return logs;
    }
  
    private async _getGeneralTransferManagerContract(): Promise<GeneralTransferManagerContract> {
      return new GeneralTransferManagerContract(
        this.abi,
        await this.polymathRegistry.getPolyTokenAddress(),
        this._web3Wrapper.getProvider(),
        this._web3Wrapper.getContractDefaults(),
      );
    }
  }
  