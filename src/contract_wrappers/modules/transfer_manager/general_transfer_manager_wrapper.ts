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
import { bigNumberToDate, dateToBigNumber, numberToBigNumber, valueToWei } from '../../../utils/convert';
import ContractFactory from '../../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  FlagsType,
  Perm,
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

interface ModifyKYCDataParams extends TxParams {
  investor: string;
  canSendAfter: Date;
  canReceiveAfter: Date;
  expiryTime: Date;
}

/**
 * @param investor is the address to whitelist
 * @param canSendAfter is the moment when the sale lockup period ends and the investor can freely sell his tokens
 * @param canReceiveAfter is the moment when the purchase lockup period ends and the investor can freely purchase tokens from others
 * @param expiryTime is the moment till investors KYC will be validated. After that investor need to do re-KYC
 * @param validFrom is the time that this signature is valid from
 * @param validTo is the time that this signature is valid until
 * @param nonce nonce of signature (avoid replay attack)
 * @param signature issuer signature
 */
interface ModifyKYCDataSignedParams extends TxParams {
  investor: string;
  canSendAfter: Date;
  canReceiveAfter: Date;
  expiryTime: Date;
  validFrom: Date;
  validTo: Date;
  nonce: number;
  signature: string;
}

interface GetInvestorFlag {
  investor: string;
  flag: FlagsType;
}

interface GetInvestorFlags {
  investor: string;
}

interface GetKYCDataParams {
  investors: string[];
}

/**
 * @param partition Identifier
 * @param tokenHolder Whom token amount need to query
 * @param additionalBalance It is the `_value` that transfer during transfer/transferFrom function call
 */
interface GetTokensByPartitionParams {
  partition: string;
  tokenHolder: string;
  additionalBalance: BigNumber;
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
  canNotBuyFromSTO: boolean;
}

interface Defaults {
  canSendAfter: Date;
  canReceiveAfter: Date;
}

interface WhitelistData {
  investor: string;
  timeRestriction: TimeRestriction;
}

interface KYCData {
  canSendAfter: Date;
  canReceiveAfter: Date;
  expiryTime: Date;
}

interface KYCDataWithInvestor extends KYCData {
  investor: string;
}

interface InvestorAndFlag {
  investor: string;
  flag: FlagsType;
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

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public nonceMap = async (params: NonceMapParams) => {
    assert.isETHAddressHex('address', params.address);
    return (await this.contract).nonceMap.callAsync(params.address, numberToBigNumber(params.nonce));
  };

  public issuanceAddress = async () => {
    return (await this.contract).issuanceAddress.callAsync();
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
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Flags), 'Caller is not allowed');
    return (await this.contract).changeDefaults.sendTransactionAsync(
      dateToBigNumber(params.defaultFromTime),
      dateToBigNumber(params.defaultToTime),
      params.txData,
      params.safetyFactor,
    );
  };

  public changeIssuanceAddress = async (params: ChangeIssuanceAddressParams) => {
    assert.isETHAddressHex('issuanceAddress', params.issuanceAddress);
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Flags), 'Caller is not allowed');
    return (await this.contract).changeIssuanceAddress.sendTransactionAsync(
      params.issuanceAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyKYCData = async (params: ModifyKYCDataParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Whitelist), 'Caller is not allowed');
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

  public getInvestorFlag = async (params: GetInvestorFlag) => {
    const result = await (await this.contract).getInvestorFlag.callAsync(params.investor, params.flag);
    return result;
  };

  private isFlagTrue = (flagPosition: FlagsType, packedFlags: number) => {
    // eslint-disable-next-line no-bitwise
    const bitInFlagPosition = (packedFlags >> flagPosition) & 1;
    return !!bitInFlagPosition;
  };

  private unpackFlags = (investor: string, flags: BigNumber) => {
    let isAccredited = false;
    let canNotBuyFromSTO = false;
    let isVolRestricted = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const flag in FlagsType) {
      if (Object.prototype.hasOwnProperty.call(FlagsType, flag)) {
        const position = Number(flag);
        if (!flag) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const isSet = this.isFlagTrue(position, flags.toNumber());
        switch (position) {
          case FlagsType.IsAccredited: {
            isAccredited = isSet;
            break;
          }
          case FlagsType.CanNotBuyFromSto: {
            canNotBuyFromSTO = isSet;
            break;
          }
          case FlagsType.IsVolRestricted: {
            isVolRestricted = isSet;
            break;
          }
          default: {
            break;
          }
        }
      }
    }

    return {
      investor,
      isAccredited,
      canNotBuyFromSTO,
      isVolRestricted,
    };
  };

  public getAllInvestorFlags = async () => {
    const result = await (await this.contract).getAllInvestorFlags.callAsync();
    const [investors, flags] = result;
    const investorFlags = [];
    for (let i = 0; i < investors[0].length; i += 1) {
      investorFlags.push(this.unpackFlags(investors[i], flags[i]));
    }
    return investorFlags;
  };

  public getInvestorFlags = async (params: GetInvestorFlags) => {
    const { investor } = params;
    const flags = await (await this.contract).getInvestorFlags.callAsync(investor);
    return this.unpackFlags(investor, flags);
  };

  public getAllKYCData = async () => {
    const result = await (await this.contract).getAllKYCData.callAsync();
    const typedResult: KYCDataWithInvestor[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const KYCData: KYCDataWithInvestor = {
        investor: result[0][i],
        canSendAfter: bigNumberToDate(result[1][i]),
        canReceiveAfter: bigNumberToDate(result[2][i]),
        expiryTime: bigNumberToDate(result[3][i]),
      };
      typedResult.push(KYCData);
    }
    return typedResult;
  };

  public getKYCData = async (params: GetKYCDataParams) => {
    const result = await (await this.contract).getKYCData.callAsync(params.investors);
    const typedResult: KYCData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      const KYCData: KYCData = {
        canSendAfter: bigNumberToDate(result[0][i]),
        canReceiveAfter: bigNumberToDate(result[1][i]),
        expiryTime: bigNumberToDate(result[2][i]),
      };
      typedResult.push(KYCData);
    }
    return typedResult;
  };

  /**
   * Return the amount of tokens for a given user as per the partition
   */
  public getTokensByPartition = async (params: GetTokensByPartitionParams) => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).getTokensByPartition.callAsync(
      params.partition,
      params.tokenHolder,
      params.additionalBalance,
    );
    return valueToWei(result, decimals);
  };

  public modifyKYCDataSigned = async (params: ModifyKYCDataSignedParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Whitelist), 'Caller is not allowed');
    assert.isLessThanMax64BytesDate('canSendAfter', params.canSendAfter);
    assert.isLessThanMax64BytesDate('canReceiveAfter', params.canReceiveAfter);
    assert.isLessThanMax64BytesDate('expiryTime', params.expiryTime);
    assert.isPastDate(params.validFrom, 'ValidFrom date must be in the past');
    assert.isFutureDate(params.validTo, 'ValidTo date must be in the future');
    assert.assert(
      !(await this.nonceMap({ address: params.investor, nonce: params.nonce })),
      'Already used signature of investor address and nonce',
    );
    return (await this.contract).modifyKYCDataSigned.sendTransactionAsync(
      params.investor,
      dateToBigNumber(params.canSendAfter),
      dateToBigNumber(params.canReceiveAfter),
      dateToBigNumber(params.expiryTime),
      dateToBigNumber(params.validFrom),
      dateToBigNumber(params.validTo),
      numberToBigNumber(params.nonce),
      params.signature,
      params.txData,
      params.safetyFactor,
    );
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
