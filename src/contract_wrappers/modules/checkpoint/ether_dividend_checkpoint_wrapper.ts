import {
    EtherDividendCheckpointContract,
    EtherDividendCheckpointEventArgs,
    EtherDividendCheckpointEvents,
    EtherDividendCheckpointEtherDividendDepositedEventArgs,
    EtherDividendCheckpointEtherDividendClaimedEventArgs,
    EtherDividendCheckpointEtherDividendReclaimedEventArgs,
    EtherDividendCheckpointEtherDividendClaimFailedEventArgs,
    EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs,
    EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs,
    EtherDividendCheckpointSetWithholdingEventArgs,
    EtherDividendCheckpointSetWithholdingFixedEventArgs,
    EtherDividendCheckpointSetWalletEventArgs,
    EtherDividendCheckpointUpdateDividendDatesEventArgs,
    EtherDividendCheckpointPauseEventArgs,
    EtherDividendCheckpointUnpauseEventArgs,
  } from '@polymathnetwork/abi-wrappers';
  import { EtherDividendCheckpoint } from '@polymathnetwork/contract-artifacts';
  import { Web3Wrapper } from '@0x/web3-wrapper';
  import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
  import { BigNumber } from '@0x/utils';
  import * as _ from 'lodash';
  import {
    TxParams,
    IGetLogsAsyncParams,
    ISubscribeAsyncParams,
    EventCallback,
    ISubscribe,
    IGetLogs,
    TxPayableParams
  } from '../../../types';
  import { assert } from '../../../utils/assert';
  import { schemas } from '@0x/json-schemas';
  import { DividendCheckpointWrapper } from './dividend_checkpoint_wrapper';
    
  interface IEtherDividendDepositedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendDeposited,
    callback: EventCallback<EtherDividendCheckpointEtherDividendDepositedEventArgs>,
  }
  
  interface IGetEtherDividendDepositedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendDeposited,
  }

  interface IEtherDividendClaimedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendClaimed,
    callback: EventCallback<EtherDividendCheckpointEtherDividendClaimedEventArgs>,
  }
  
  interface IGetEtherDividendClaimedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendClaimed,
  }

  interface IEtherDividendReclaimedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendReclaimed,
    callback: EventCallback<EtherDividendCheckpointEtherDividendReclaimedEventArgs>,
  }
  
  interface IGetEtherDividendReclaimedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendReclaimed,
  }

  interface IEtherDividendClaimFailedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendClaimFailed,
    callback: EventCallback<EtherDividendCheckpointEtherDividendClaimFailedEventArgs>,
  }
  
  interface IGetEtherDividendClaimFailedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendClaimFailed,
  }

  interface IEtherDividendWithholdingWithdrawnSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendWithholdingWithdrawn,
    callback: EventCallback<EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs>,
  }
  
  interface IGetEtherDividendWithholdingWithdrawnLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.EtherDividendWithholdingWithdrawn,
  }

  interface ISetDefaultExcludedAddressesSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetDefaultExcludedAddresses,
    callback: EventCallback<EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs>,
  }
  
  interface IGetSetDefaultExcludedAddressesLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetDefaultExcludedAddresses,
  }

  interface ISetWithholdingSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetWithholding,
    callback: EventCallback<EtherDividendCheckpointSetWithholdingEventArgs>,
  }
  
  interface IGetSetWithholdingLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetWithholding,
  }

  interface ISetWithholdingFixedSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetWithholdingFixed,
    callback: EventCallback<EtherDividendCheckpointSetWithholdingFixedEventArgs>,
  }
  
  interface IGetSetWithholdingFixedLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetWithholdingFixed,
  }

  interface ISetWalletSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetWallet,
    callback: EventCallback<EtherDividendCheckpointSetWalletEventArgs>,
  }
  
  interface IGetSetWalletLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.SetWallet,
  }

  interface IUpdateDividendDatesSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.UpdateDividendDates,
    callback: EventCallback<EtherDividendCheckpointUpdateDividendDatesEventArgs>,
  }
  
  interface IGetUpdateDividendDatesLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.UpdateDividendDates,
  }

  interface IPauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.Pause,
    callback: EventCallback<EtherDividendCheckpointPauseEventArgs>,
  }
  
  interface IGetPauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.Pause,
  }

  interface IUnpauseSubscribeAsyncParams extends ISubscribeAsyncParams {
    eventName: EtherDividendCheckpointEvents.Unpause,
    callback: EventCallback<EtherDividendCheckpointUnpauseEventArgs>,
  }
  
  interface IGetUnpauseLogsAsyncParams extends IGetLogsAsyncParams {
    eventName: EtherDividendCheckpointEvents.Unpause,
  }
  
  interface IEtherDividendCheckpointSubscribeAsyncParams extends ISubscribe {
    (params: IEtherDividendDepositedSubscribeAsyncParams): Promise<string>,
    (params: IEtherDividendClaimedSubscribeAsyncParams): Promise<string>,
    (params: IEtherDividendReclaimedSubscribeAsyncParams): Promise<string>,
    (params: IEtherDividendClaimFailedSubscribeAsyncParams): Promise<string>,
    (params: IEtherDividendWithholdingWithdrawnSubscribeAsyncParams): Promise<string>,
    (params: ISetDefaultExcludedAddressesSubscribeAsyncParams): Promise<string>,
    (params: ISetWithholdingSubscribeAsyncParams): Promise<string>,
    (params: ISetWithholdingFixedSubscribeAsyncParams): Promise<string>,
    (params: ISetWalletSubscribeAsyncParams): Promise<string>,
    (params: IUpdateDividendDatesSubscribeAsyncParams): Promise<string>,
    (params: IPauseSubscribeAsyncParams): Promise<string>,
    (params: IUnpauseSubscribeAsyncParams): Promise<string>,
  }
  
  interface IGetEtherDividendCheckpointLogsAsyncParams extends IGetLogs {
    (params: IGetEtherDividendDepositedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointEtherDividendDepositedEventArgs>>>,
    (params: IGetEtherDividendClaimedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointEtherDividendClaimedEventArgs>>>,
    (params: IGetEtherDividendReclaimedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointEtherDividendReclaimedEventArgs>>>,
    (params: IGetEtherDividendClaimFailedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointEtherDividendClaimFailedEventArgs>>>,
    (params: IGetEtherDividendWithholdingWithdrawnLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs>>>,
    (params: IGetSetDefaultExcludedAddressesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs>>>,
    (params: IGetSetWithholdingLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointSetWithholdingEventArgs>>>,
    (params: IGetSetWithholdingFixedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointSetWithholdingFixedEventArgs>>>,
    (params: IGetSetWalletLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointSetWalletEventArgs>>>,
    (params: IGetUpdateDividendDatesLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointUpdateDividendDatesEventArgs>>>,
    (params: IGetPauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointPauseEventArgs>>>,
    (params: IGetUnpauseLogsAsyncParams): Promise<Array<LogWithDecodedArgs<EtherDividendCheckpointUnpauseEventArgs>>>,
  }

    interface SetWithholdingFixedParams extends TxParams {
        investors: string[],
        withholding: BigNumber,
    }

    interface GetDividendDataParams extends TxParams {
        dividendIndex: BigNumber,
    }

    interface PullDividendPaymentParams extends TxParams {
        dividendIndex: BigNumber,
    }

    interface PushDividendPaymentToAddressesParams extends TxParams {
        dividendIndex: BigNumber,
        payees: string[],
    }

    interface IsClaimedParams {
        investor: string,
        dividendIndex: BigNumber,
    }

    interface CalculateDividendParams {
        dividendIndex: BigNumber,
        payee: string,
    }

    interface GetDividendIndexParams {
        checkpointId: BigNumber,
    }

    interface UpdateDividendDatesParams extends TxParams {
        dividendIndex: BigNumber,
        maturity: BigNumber,
        expiry: BigNumber,
    }

    interface GetCheckpointDataParams {
        checkpointId: BigNumber,
    }

    interface IsExcludedParams {
        investor: string,
        dividendIndex: BigNumber,
    }

    interface SetWithholdingParams extends TxParams {
        investors: string[],
        withholding: BigNumber[],
    }

    interface ReclaimERC20Params extends TxParams {
        tokenContract: string,
    }

    interface ChangeWalletParams extends TxParams {
        wallet: string,
    }

    interface SetDefaultExcludedParams extends TxParams {
        excluded: string[],
    }

    interface PushDividendPaymentParams extends TxParams {
        dividendIndex: BigNumber,
        start: BigNumber,
        iterations: BigNumber,
    }

    interface GetDividendProgressParams {
        dividendIndex: BigNumber,
    }

    interface CreateDividendParams extends TxPayableParams {
        maturity: BigNumber,
        expiry: BigNumber,
        name: string,
    }
    
    interface CreateDividendWithCheckpointParams extends TxPayableParams {
        maturity: BigNumber,
        expiry: BigNumber,
        checkpointId: BigNumber,
        name: string,
    }

    interface CreateDividendWithExclusionsParams extends TxPayableParams {
        maturity: BigNumber,
        expiry: BigNumber,
        excluded: string[],
        name: string,
    }

    interface CreateDividendWithCheckpointAndExclusionsParams extends TxPayableParams {
        maturity: BigNumber,
        expiry: BigNumber,
        checkpointId: BigNumber,
        excluded: string[],
        name: string,
    }

    interface ReclaimDividendParams extends TxParams {
        dividendIndex: BigNumber,
    }

    interface WithdrawWithholdingParams extends TxParams {
        dividendIndex: BigNumber,
    }

  /**
   * This class includes the functionality related to interacting with the EtherDividendCheckpoint contract.
   */
  export class EtherDividendCheckpointWrapper extends DividendCheckpointWrapper {
    public abi: ContractAbi = EtherDividendCheckpoint.abi;
    protected _address: string;
    protected _contract: Promise<EtherDividendCheckpointContract>;
  
    /**
     * Instantiate EtherDividendCheckpointWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param address The contract instance address
     */
    constructor(web3Wrapper: Web3Wrapper, address: string) {
      super(web3Wrapper, address);
      this._address = address;
      this._contract = this._getEtherDividendCheckpointContract();
    }
  
    public setWithholdingFixed = async (params: SetWithholdingFixedParams) => {
        return (await this._contract).setWithholdingFixed.sendTransactionAsync(
            params.investors,
            params.withholding,
            params.txData,
            params.safetyFactor
        );
    }

    public reclaimETH = async (params: TxParams) => {
        return (await this._contract).reclaimETH.sendTransactionAsync(
            params.txData,
            params.safetyFactor
        );
    }

    public pullDividendPayment = async (params: PullDividendPaymentParams) => {
        return (await this._contract).pullDividendPayment.sendTransactionAsync(
            params.dividendIndex,
            params.txData,
            params.safetyFactor
        );
    }

    public unpause = async (params: TxParams) => {
        return (await this._contract).unpause.sendTransactionAsync(
            params.txData,
            params.safetyFactor
        );
    }

    public pushDividendPaymentToAddresses = async (params: PushDividendPaymentToAddressesParams) => {
        return (await this._contract).pushDividendPaymentToAddresses.sendTransactionAsync(
            params.dividendIndex,
            params.payees,
            params.txData,
            params.safetyFactor
        );
    }

    public wallet = async (): Promise<string> => {
        return await (await this._contract).wallet.callAsync();
    }

    public isClaimed = async (params: IsClaimedParams): Promise<boolean> => {
        return await (await this._contract).isClaimed.callAsync(
            params.investor,
            params.dividendIndex,
        );
    }

    public paused = async (): Promise<boolean> => {
        return await (await this._contract).paused.callAsync();
    }

    public getDividendIndex = async (params: GetDividendIndexParams): Promise<BigNumber[]> => {
        return await (await this._contract).getDividendIndex.callAsync(
            params.checkpointId,
        );
    }

    public updateDividendDates = async (params: UpdateDividendDatesParams) => {
        return (await this._contract).updateDividendDates.sendTransactionAsync(
            params.dividendIndex,
            params.maturity,
            params.expiry,
            params.txData,
            params.safetyFactor
        );
    }

    public isExcluded = async (params: IsExcludedParams): Promise<boolean> => {
        return await (await this._contract).isExcluded.callAsync(
            params.investor,
            params.dividendIndex,
        );
    }

    public pause = async (params: TxParams) => {
        return (await this._contract).pause.sendTransactionAsync(
            params.txData,
            params.safetyFactor
        );
    }

    public setWithholding = async (params: SetWithholdingParams) => {
        return (await this._contract).setWithholding.sendTransactionAsync(
            params.investors,
            params.withholding,
            params.txData,
            params.safetyFactor
        );
    }

    public reclaimERC20 = async (params: ReclaimERC20Params) => {
        return (await this._contract).reclaimERC20.sendTransactionAsync(
            params.tokenContract,
            params.txData,
            params.safetyFactor
        );
    }

    public changeWallet = async (params: ChangeWalletParams) => {
        return (await this._contract).changeWallet.sendTransactionAsync(
            params.wallet,
            params.txData,
            params.safetyFactor
        );
    }

    public setDefaultExcluded = async (params: SetDefaultExcludedParams) => {
        return (await this._contract).setDefaultExcluded.sendTransactionAsync(
            params.excluded,
            params.txData,
            params.safetyFactor
        );
    }

    public pushDividendPayment = async (params: PushDividendPaymentParams) => {
        return (await this._contract).pushDividendPayment.sendTransactionAsync(
            params.dividendIndex,
            params.start,
            params.iterations,
            params.txData,
            params.safetyFactor
        );
    }

    public getDefaultExcluded = async (): Promise<string[]> => {
        return await (await this._contract).getDefaultExcluded.callAsync();
    }

    public createCheckpoint = async (params: TxParams) => {
        return (await this._contract).createCheckpoint.sendTransactionAsync(
            params.txData,
            params.safetyFactor
        );
    }

    public createDividend = async (params: CreateDividendParams) => {
        return (await this._contract).createDividend.sendTransactionAsync(
            params.maturity,
            params.expiry,
            params.name,
            params.txData,
            params.safetyFactor
        );
    }

    public createDividendWithCheckpoint = async (params: CreateDividendWithCheckpointParams) => {
        return (await this._contract).createDividendWithCheckpoint.sendTransactionAsync(
            params.maturity,
            params.expiry,
            params.checkpointId,
            params.name,
            params.txData,
            params.safetyFactor
        );
    }

    public createDividendWithExclusions = async (params: CreateDividendWithExclusionsParams) => {
        return (await this._contract).createDividendWithExclusions.sendTransactionAsync(
            params.maturity,
            params.expiry,
            params.excluded,
            params.name,
            params.txData,
            params.safetyFactor
        );
    }

    public createDividendWithCheckpointAndExclusions = async (params: CreateDividendWithCheckpointAndExclusionsParams) => {
        return (await this._contract).createDividendWithCheckpointAndExclusions.sendTransactionAsync(
            params.maturity,
            params.expiry,
            params.checkpointId,
            params.excluded,
            params.name,
            params.txData,
            params.safetyFactor
        );
    }

    public reclaimDividend = async (params: ReclaimDividendParams) => {
        return (await this._contract).reclaimDividend.sendTransactionAsync(
            params.dividendIndex,
        );
    }

    public withdrawWithholding = async (params: WithdrawWithholdingParams) => {
        return (await this._contract).withdrawWithholding.sendTransactionAsync(
            params.dividendIndex,
        );
    }
  
    /**
     * Subscribe to an event type emitted by the contract.
     * @return Subscription token used later to unsubscribe
     */
    public subscribeAsync: IEtherDividendCheckpointSubscribeAsyncParams = async <ArgsType extends EtherDividendCheckpointEventArgs>(
      params: ISubscribeAsyncParams
    ): Promise<string> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, EtherDividendCheckpointEvents);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      assert.isFunction('callback', params.callback);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        EtherDividendCheckpoint.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
      );
      return subscriptionToken;
    }
  
    /**
     * Gets historical logs without creating a subscription
     * @return Array of logs that match the parameters
     */
    public getLogsAsync: IGetEtherDividendCheckpointLogsAsyncParams = async <ArgsType extends EtherDividendCheckpointEventArgs>(
      params: IGetLogsAsyncParams
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
      assert.doesBelongToStringEnum('eventName', params.eventName, EtherDividendCheckpointEvents);
      assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
      assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
      const normalizedContractAddress = (await this._contract).address.toLowerCase();
      const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        EtherDividendCheckpoint.abi,
      );
      return logs;
    }
  
    private async _getEtherDividendCheckpointContract(): Promise<EtherDividendCheckpointContract> {
      return new EtherDividendCheckpointContract(
        this.abi,
        this._address,
        this._web3Wrapper.getProvider(),
        this._web3Wrapper.getContractDefaults(),
      );
    }
  }
    
  