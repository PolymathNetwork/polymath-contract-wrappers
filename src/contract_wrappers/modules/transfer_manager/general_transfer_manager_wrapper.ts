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
import { GeneralTransferManager } from '@polymathnetwork/contract-artifacts';
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
  IGetLogs
} from '../../../types';
import { assert } from '../../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ModuleWrapper } from '../module_wrapper';
import { type } from 'os';

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

interface IGeneralTransferManagerSubscribeAsyncParams extends ISubscribe {
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

interface IGetGeneralTransferManagerLogsAsyncParams extends IGetLogs {
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
  
interface InvestorIndexParams {
  investorIndex: BigNumber,
}

interface InvestorAddressParams {
  investorAddress: string,
}

interface NonceMapParams {
  address: string,
  nonce: BigNumber,
}

interface ChangeDefaultsParams extends TxParams {
  defaultFromTime: BigNumber,
  defaultToTime: BigNumber,
}

interface ChangeIssuanceAddressParams extends TxParams {
  issuanceAddress: string,
}

interface ChangeSigningAddressParams extends TxParams {
  signingAddress: string,
}

interface ChangeAllowAllTransfersParams extends TxParams {
  allowAllTransfers: boolean,
}

interface ChangeAllowAllWhitelistTransfersParams extends TxParams {
  allowAllWhitelistTransfers: boolean,
}

interface ChangeAllowAllWhitelistIssuancesParams extends TxParams {
  allowAllWhitelistIssuances: boolean,
}

interface ChangeAllowAllBurnTransfersParams extends TxParams {
  allowAllBurnTransfers: boolean,
}

interface VerifyTransferParams extends TxParams {
  from: string,
  to: string,
  amount: BigNumber,
  data: string,
  isTransfer: boolean,
}

interface ModifyWhitelistParams extends TxParams {
  investor: string,
  fromTime: BigNumber,
  toTime: BigNumber,
  expiryTime: BigNumber,
  canBuyFromSTO: boolean,
}

interface ModifyWhitelistSignedParams extends TxParams {
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

interface GetInvestorsDataParams {
  investors: string[],
}

//// Return types ////
interface TimeRestriction {
  /** The moment when the sale lockup period ends and the investor can freely sell or transfer away their tokens */
  canSendAfter: BigNumber, 
  /** The moment when the purchase lockup period ends and the investor can freely purchase or receive from others */
  canReceiveAfter: BigNumber, 
  /** The moment till investors KYC will be validated. After that investor need to do re-KYC */
  expiryTime: BigNumber, 
  /** Used to know whether the investor is restricted investor or not */
  canBuyFromSTO: boolean, 
}

interface Defaults {
  canSendAfter: BigNumber,
  canReceiveAfter: BigNumber;
}

interface WhitelistData {
  investor: string,
  timeRestriction: TimeRestriction
}
//// End of return types ////

/**
 * This class includes the functionality related to interacting with the General Transfer Manager contract.
 */
export class GeneralTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = GeneralTransferManager.abi;
  protected _contract: Promise<GeneralTransferManagerContract>;

  /**
   * Instantiate GeneralTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<GeneralTransferManagerContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  public allowAllBurnTransfers = async () => {
    return await (await this._contract).allowAllBurnTransfers.callAsync();
  }

  public allowAllWhitelistTransfers = async () => {
    return await (await this._contract).allowAllWhitelistTransfers.callAsync();
  }

  public unpause = async (params: TxParams) => {
    return (await this._contract).unpause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public investors = async (params: InvestorIndexParams) => {
    return await (await this._contract).investors.callAsync(
      params.investorIndex,
    );
  }

  public paused = async (): Promise<boolean> => {
    return await (await this._contract).paused.callAsync();
  }

  public pause = async (params: TxParams) => {
    return (await this._contract).pause.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  } 

  public whitelist = async (params: InvestorAddressParams) => {
    const result = await (await this._contract).whitelist.callAsync(
      params.investorAddress,
    );
    const typedResult: TimeRestriction = {
      canSendAfter: result[0], 
      canReceiveAfter: result[1], 
      expiryTime: result[2], 
      canBuyFromSTO: result[3].toNumber() === 1
    }
    return typedResult;
  }

  public nonceMap = async (params: NonceMapParams) => {
    return await (await this._contract).nonceMap.callAsync(
      params.address,
      params.nonce,
    );
  }

  public allowAllTransfers = async () => {
    return await (await this._contract).allowAllTransfers.callAsync();
  }

  public signingAddress = async () => {
    return await (await this._contract).signingAddress.callAsync();
  }

  public issuanceAddress = async () => {
    return await (await this._contract).issuanceAddress.callAsync();
  }

  public allowAllWhitelistIssuances = async () => {
    return await (await this._contract).allowAllWhitelistIssuances.callAsync();
  }

  public defaults = async () => {
    const result = await (await this._contract).defaults.callAsync();
    const typedResult: Defaults = {
      canSendAfter: result[0],
      canReceiveAfter: result[1]
    }
    return typedResult;
  }

  public changeDefaults = async (params: ChangeDefaultsParams) => {
    return (await this._contract).changeDefaults.sendTransactionAsync(
      params.defaultFromTime,
      params.defaultToTime,
      params.txData,
      params.safetyFactor
    );
  }

  public changeIssuanceAddress = async (params: ChangeIssuanceAddressParams) => {
    return (await this._contract).changeIssuanceAddress.sendTransactionAsync(
      params.issuanceAddress,
      params.txData,
      params.safetyFactor
    );
  }

  public changeSigningAddress = async (params: ChangeSigningAddressParams) => {
    return (await this._contract).changeSigningAddress.sendTransactionAsync(
      params.signingAddress,
      params.txData,
      params.safetyFactor
    );
  }

  public changeAllowAllTransfers = async (params: ChangeAllowAllTransfersParams) => {
    return (await this._contract).changeAllowAllTransfers.sendTransactionAsync(
      params.allowAllTransfers,
      params.txData,
      params.safetyFactor
    );
  }

  public changeAllowAllWhitelistTransfers = async (params: ChangeAllowAllWhitelistTransfersParams) => {
    return (await this._contract).changeAllowAllWhitelistTransfers.sendTransactionAsync(
      params.allowAllWhitelistTransfers,
      params.txData,
      params.safetyFactor
    );
  }

  public changeAllowAllWhitelistIssuances = async (params: ChangeAllowAllWhitelistIssuancesParams) => {
    return (await this._contract).changeAllowAllWhitelistIssuances.sendTransactionAsync(
      params.allowAllWhitelistIssuances,
      params.txData,
      params.safetyFactor
    );
  }

  public changeAllowAllBurnTransfers = async (params: ChangeAllowAllBurnTransfersParams) => {
    return (await this._contract).changeAllowAllBurnTransfers.sendTransactionAsync(
      params.allowAllBurnTransfers,
      params.txData,
      params.safetyFactor
    );
  }

  public verifyTransfer = async (params: VerifyTransferParams) => {
    return (await this._contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.amount,
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor
    );
  }

  public modifyWhitelist = async (params: ModifyWhitelistParams) => {
    return (await this._contract).modifyWhitelist.sendTransactionAsync(
      params.investor,
      params.fromTime,
      params.toTime,
      params.expiryTime,
      params.canBuyFromSTO,
      params.txData,
      params.safetyFactor
    );
  }

  public modifyWhitelistSigned = async (params: ModifyWhitelistSignedParams) => {
    return (await this._contract).modifyWhitelistSigned.sendTransactionAsync(
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
      params.txData,
      params.safetyFactor
    );
  }

  public getInvestors = async () => {
    return await (await this._contract).getInvestors.callAsync();
  }

  public getAllInvestorsData = async () => {
    const result = await (await this._contract).getAllInvestorsData.callAsync();
    const typedResult: WhitelistData[] = [];
    for (let i = 0; i < result[0].length; i++) {
      const whitelistData: WhitelistData = {
        investor: result[0][i],
        timeRestriction: {
          canSendAfter: result[1][i], 
          canReceiveAfter: result[2][i], 
          expiryTime: result[3][i], 
          canBuyFromSTO: result[4][i]
        }
      }
      typedResult.push(whitelistData);
    }
    return typedResult;
  }

  public getInvestorsData = async (params: GetInvestorsDataParams) => {
    const result = await (await this._contract).getInvestorsData.callAsync(
        params.investors,
    );
    const typedResult: WhitelistData[] = [];
    for (let i = 0; i < params.investors.length; i++) {
      const whitelistData: WhitelistData = {
        investor: params.investors[i],
        timeRestriction: {
          canSendAfter: result[0][i], 
          canReceiveAfter: result[1][i], 
          expiryTime: result[2][i], 
          canBuyFromSTO: result[3][i]
        }
      }
      typedResult.push(whitelistData);
    }
    return typedResult;
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
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
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
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetGeneralTransferManagerLogsAsyncParams = async <ArgsType extends GeneralTransferManagerEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      GeneralTransferManager.abi,
    );
    return logs;
  }
}
