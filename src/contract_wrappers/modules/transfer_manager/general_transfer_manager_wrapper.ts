import {
  GeneralTransferManagerContract,
  GeneralTransferManagerEventArgs,
  GeneralTransferManagerEvents,
  GeneralTransferManagerChangeIssuanceAddressEventArgs,
  GeneralTransferManagerModifyKYCDataEventArgs,
  GeneralTransferManagerModifyInvestorFlagEventArgs,
  GeneralTransferManagerModifyTransferRequirementsEventArgs,
  GeneralTransferManagerChangeDefaultsEventArgs,
  GeneralTransferManagerPauseEventArgs,
  GeneralTransferManagerUnpauseEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { GeneralTransferManager } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import {
  bigNumberToDate,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberToBigNumber,
  valueToWei,
} from '../../../utils/convert';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  Perms,
} from '../../../types';

interface ChangeIssuanceAddressSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.ChangeIssuanceAddress;
  callback: EventCallback<GeneralTransferManagerChangeIssuanceAddressEventArgs>;
}

interface GetChangeIssuanceAddressLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.ChangeIssuanceAddress;
}

interface ChangeDefaultsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.ChangeDefaults;
  callback: EventCallback<GeneralTransferManagerChangeDefaultsEventArgs>;
}

interface GetChangeDefaultsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.ChangeDefaults;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.Pause;
  callback: EventCallback<GeneralTransferManagerPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.Unpause;
  callback: EventCallback<GeneralTransferManagerUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.Unpause;
}

interface ModifyKYCDataSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.ModifyKYCData;
  callback: EventCallback<GeneralTransferManagerModifyKYCDataEventArgs>;
}

interface GetModifyKYCDataLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.ModifyKYCData;
}

interface ModifyInvestorFlagSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.ModifyInvestorFlag;
  callback: EventCallback<GeneralTransferManagerModifyInvestorFlagEventArgs>;
}

interface GetModifyInvestorFlagLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.ModifyInvestorFlag;
}

interface ModifyTransferRequirementsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: GeneralTransferManagerEvents.ModifyTransferRequirements;
  callback: EventCallback<GeneralTransferManagerModifyTransferRequirementsEventArgs>;
}

interface GetModifyTransferRequirementsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: GeneralTransferManagerEvents.ModifyTransferRequirements;
}

interface GeneralTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: ChangeIssuanceAddressSubscribeAsyncParams): Promise<string>;
  (params: ChangeDefaultsSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
  (params: ModifyKYCDataSubscribeAsyncParams): Promise<string>;
  (params: ModifyInvestorFlagSubscribeAsyncParams): Promise<string>;
  (params: ModifyTransferRequirementsSubscribeAsyncParams): Promise<string>;
}

interface GetGeneralTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetChangeIssuanceAddressLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerChangeIssuanceAddressEventArgs>[]
  >;
  (params: GetChangeDefaultsLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerChangeDefaultsEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralTransferManagerPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<GeneralTransferManagerUnpauseEventArgs>[]>;
  (params: GetModifyKYCDataLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerModifyKYCDataEventArgs>[]
  >;
  (params: GetModifyInvestorFlagLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerModifyInvestorFlagEventArgs>[]
  >;
  (params: GetModifyTransferRequirementsLogsAsyncParams): Promise<
    LogWithDecodedArgs<GeneralTransferManagerModifyTransferRequirementsEventArgs>[]
  >;
}

interface InvestorIndexParams {
  investorIndex: number;
}

interface InvestorAddressParams {
  investorAddress: string;
}

interface NonceMapParams {
  address: string;
  nonce: number;
}

interface ChangeDefaultsParams extends TxParams {
  defaultFromTime: Date;
  defaultToTime: Date;
}

interface ChangeIssuanceAddressParams extends TxParams {
  issuanceAddress: string;
}

interface ChangeSigningAddressParams extends TxParams {
  signingAddress: string;
}

interface ChangeAllowAllTransfersParams extends TxParams {
  allowAllTransfers: boolean;
}

interface ChangeAllowAllWhitelistTransfersParams extends TxParams {
  allowAllWhitelistTransfers: boolean;
}

interface ChangeAllowAllWhitelistIssuancesParams extends TxParams {
  allowAllWhitelistIssuances: boolean;
}

interface ChangeAllowAllBurnTransfersParams extends TxParams {
  allowAllBurnTransfers: boolean;
}

interface VerifyTransferParams extends TxParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
  isTransfer: boolean;
}

interface ModifyKYCDataParams extends TxParams {
  investor: string;
  canSendAfter: Date;
  canReceiveAfter: Date;
  expiryTime: Date;
}

interface ModifyWhitelistMultiParams extends TxParams {
  investors: string[];
  canSendAfters: Date[];
  canReceiveAfters: Date[];
  expiryTimes: Date[];
  canBuyFromSTO: boolean[];
}

interface ModifyWhitelistSignedParams extends TxParams {
  investor: string;
  canSendAfter: Date;
  canReceiveAfter: Date;
  expiryTime: Date;
  canBuyFromSTO: boolean;
  validFrom: Date;
  validTo: Date;
  nonce: number;
  v: number | BigNumber;
  r: string;
  s: string;
}

interface GetInvestorsDataParams {
  investors: string[];
}

interface GetInvestorFlag {
  investor: string;
  flag: number;
}

interface GetInvestorFlags {
  investor: string;
}

// // Return types ////
interface TimeRestriction {
  /** The moment when the sale lockup period ends and the investor can freely sell or transfer away their tokens */
  canSendAfter: Date;
  /** The moment when the purchase lockup period ends and the investor can freely purchase or receive from others */
  canReceiveAfter: Date;
  /** The moment till investors KYC will be validated. After that investor need to do re-KYC */
  expiryTime: Date;
  /** Used to know whether the investor is restricted investor or not */
  canBuyFromSTO: boolean;
}

interface Defaults {
  canSendAfter: Date;
  canReceiveAfter: Date;
}

interface WhitelistData {
  investor: string;
  timeRestriction: TimeRestriction;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the General Transfer Manager contract.
 */
export default class GeneralTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = GeneralTransferManager.abi;

  protected contract: Promise<GeneralTransferManagerContract>;

  /**
   * Instantiate GeneralTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralTransferManagerContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public allowAllBurnTransfers = async () => {
    return (await this.contract).allowAllBurnTransfers.callAsync();
  };

  public allowAllWhitelistTransfers = async () => {
    return (await this.contract).allowAllWhitelistTransfers.callAsync();
  };

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public investors = async (params: InvestorIndexParams) => {
    return (await this.contract).investors.callAsync(numberToBigNumber(params.investorIndex));
  };

  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public whitelist = async (params: InvestorAddressParams) => {
    assert.isETHAddressHex('investorAddress', params.investorAddress);
    const result = await (await this.contract).whitelist.callAsync(params.investorAddress);
    const typedResult: TimeRestriction = {
      canSendAfter: bigNumberToDate(result[0]),
      canReceiveAfter: bigNumberToDate(result[1]),
      expiryTime: bigNumberToDate(result[2]),
      canBuyFromSTO: new BigNumber(result[3]).toNumber() === 1,
    };
    return typedResult;
  };

  public nonceMap = async (params: NonceMapParams) => {
    assert.isETHAddressHex('address', params.address);
    return (await this.contract).nonceMap.callAsync(params.address, numberToBigNumber(params.nonce));
  };

  public allowAllTransfers = async () => {
    return (await this.contract).allowAllTransfers.callAsync();
  };

  public signingAddress = async () => {
    return (await this.contract).signingAddress.callAsync();
  };

  public issuanceAddress = async () => {
    return (await this.contract).issuanceAddress.callAsync();
  };

  public allowAllWhitelistIssuances = async () => {
    return (await this.contract).allowAllWhitelistIssuances.callAsync();
  };

  public defaults = async () => {
    const result = await (await this.contract).defaults.callAsync();
    const typedResult: Defaults = {
      canSendAfter: bigNumberToDate(result[0]),
      canReceiveAfter: bigNumberToDate(result[1]),
    };
    return typedResult;
  };

  public changeDefaults = async (params: ChangeDefaultsParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeDefaults.sendTransactionAsync(
      dateToBigNumber(params.defaultFromTime),
      dateToBigNumber(params.defaultToTime),
      params.txData,
      params.safetyFactor,
    );
  };

  public changeIssuanceAddress = async (params: ChangeIssuanceAddressParams) => {
    assert.isETHAddressHex('issuanceAddress', params.issuanceAddress);
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeIssuanceAddress.sendTransactionAsync(
      params.issuanceAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeSigningAddress = async (params: ChangeSigningAddressParams) => {
    assert.isETHAddressHex('signingAddress', params.signingAddress);
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeSigningAddress.sendTransactionAsync(
      params.signingAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeAllowAllTransfers = async (params: ChangeAllowAllTransfersParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeAllowAllTransfers.sendTransactionAsync(
      params.allowAllTransfers,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeAllowAllWhitelistTransfers = async (params: ChangeAllowAllWhitelistTransfersParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeAllowAllWhitelistTransfers.sendTransactionAsync(
      params.allowAllWhitelistTransfers,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeAllowAllWhitelistIssuances = async (params: ChangeAllowAllWhitelistIssuancesParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeAllowAllWhitelistIssuances.sendTransactionAsync(
      params.allowAllWhitelistIssuances,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeAllowAllBurnTransfers = async (params: ChangeAllowAllBurnTransfersParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Flags), 'Caller is not allowed');
    return (await this.contract).changeAllowAllBurnTransfers.sendTransactionAsync(
      params.allowAllBurnTransfers,
      params.txData,
      params.safetyFactor,
    );
  };

  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).verifyTransfer.sendTransactionAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
      params.isTransfer,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyKYCData = async (params: ModifyKYCDataParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Whitelist), 'Caller is not allowed');
    assert.isLessThanMax64BytesDate('canSendAfter', params.canSendAfter);
    assert.isLessThanMax64BytesDate('canReceiveAfter', params.canReceiveAfter);
    assert.isLessThanMax64BytesDate('expiryTime', params.expiryTime);
    return (await this.contract).modifyKYCData.sendTransactionAsync(
      params.investor,
      dateToBigNumber(params.canSendAfter),
      dateToBigNumber(params.canReceiveAfter),
      dateToBigNumber(params.expiryTime),
      params.txData,
      params.safetyFactor,
    );
  };

  public getAllInvestorFlags = async () => {
    const result = await (await this.contract).getAllInvestorFlags.callAsync();
    return result;
  };

  public getInvestorFlag = async (params: GetInvestorFlag) => {
    const result = await (await this.contract).getInvestorFlag.callAsync(params.investor, params.flag);
    return result;
  };

  public getInvestorFlags = async (params: GetInvestorFlags) => {
    const result = await (await this.contract).getInvestorFlags.callAsync(params.investor);
    return result;
  };

  public modifyWhitelistMulti = async (params: ModifyWhitelistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Whitelist), 'Caller is not allowed');
    params.investors.forEach(address => assert.isNonZeroETHAddressHex('investors', address));
    assert.assert(
      params.canSendAfters.length === params.canReceiveAfters.length &&
        params.canSendAfters.length === params.expiryTimes.length &&
        params.canSendAfters.length === params.canBuyFromSTO.length,
      'Array lengths missmatch',
    );
    params.canSendAfters.forEach(date => assert.isLessThanMax64BytesDate('canSendAfter', date));
    params.canReceiveAfters.forEach(date => assert.isLessThanMax64BytesDate('canReceiveAfter', date));
    params.expiryTimes.forEach(date => assert.isLessThanMax64BytesDate('expiryTime', date));
    return (await this.contract).modifyWhitelistMulti.sendTransactionAsync(
      params.investors,
      dateArrayToBigNumberArray(params.canSendAfters),
      dateArrayToBigNumberArray(params.canReceiveAfters),
      dateArrayToBigNumberArray(params.expiryTimes),
      params.canBuyFromSTO,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyWhitelistSigned = async (params: ModifyWhitelistSignedParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    assert.assert(await this.isCallerAllowed(params.txData, Perms.Whitelist), 'Caller is not allowed');
    assert.isLessThanMax64BytesDate('canSendAfter', params.canSendAfter);
    assert.isLessThanMax64BytesDate('canReceiveAfter', params.canReceiveAfter);
    assert.isLessThanMax64BytesDate('expiryTime', params.expiryTime);
    assert.isPastDate(params.validFrom, 'ValidFrom date must be in the past');
    assert.isFutureDate(params.validTo, 'ValidTo date must be in the future');
    assert.assert(
      !(await this.nonceMap({ address: params.investor, nonce: params.nonce })),
      'Already used signature of investor address and nonce',
    );
    return (await this.contract).modifyWhitelistSigned.sendTransactionAsync(
      params.investor,
      dateToBigNumber(params.canSendAfter),
      dateToBigNumber(params.canReceiveAfter),
      dateToBigNumber(params.expiryTime),
      params.canBuyFromSTO,
      dateToBigNumber(params.validFrom),
      dateToBigNumber(params.validTo),
      numberToBigNumber(params.nonce),
      params.v,
      params.r,
      params.s,
      params.txData,
      params.safetyFactor,
    );
  };

  public getInvestors = async () => {
    return (await this.contract).getInvestors.callAsync();
  };

  public getAllInvestorsData = async () => {
    const result = await (await this.contract).getAllInvestorsData.callAsync();
    const typedResult: WhitelistData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const whitelistData: WhitelistData = {
        investor: result[0][i],
        timeRestriction: {
          canSendAfter: bigNumberToDate(result[1][i]),
          canReceiveAfter: bigNumberToDate(result[2][i]),
          expiryTime: bigNumberToDate(result[3][i]),
          canBuyFromSTO: result[4][i],
        },
      };
      typedResult.push(whitelistData);
    }
    return typedResult;
  };

  public getInvestorsData = async (params: GetInvestorsDataParams) => {
    params.investors.forEach(address => assert.isETHAddressHex('investors', address));
    const result = await (await this.contract).getInvestorsData.callAsync(params.investors);
    const typedResult: WhitelistData[] = [];
    for (let i = 0; i < params.investors.length; i += 1) {
      const whitelistData: WhitelistData = {
        investor: params.investors[i],
        timeRestriction: {
          canSendAfter: bigNumberToDate(result[0][i]),
          canReceiveAfter: bigNumberToDate(result[1][i]),
          expiryTime: bigNumberToDate(result[2][i]),
          canBuyFromSTO: result[3][i],
        },
      };
      typedResult.push(whitelistData);
    }
    return typedResult;
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: GeneralTransferManagerSubscribeAsyncParams = async <
    ArgsType extends GeneralTransferManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      GeneralTransferManager.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetGeneralTransferManagerLogsAsyncParams = async <
    ArgsType extends GeneralTransferManagerEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, GeneralTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      GeneralTransferManager.abi,
    );
    return logs;
  };
}
