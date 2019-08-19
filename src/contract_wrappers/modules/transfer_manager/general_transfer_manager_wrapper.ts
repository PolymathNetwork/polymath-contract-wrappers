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
  GeneralTransferManager,
  Web3Wrapper,
  ContractAbi,
  LogWithDecodedArgs,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import {
  bigNumberToDate,
  dateToBigNumber,
  numberToBigNumber,
  valueToWei,
  weiToValue,
  bytes32ToString,
  stringToBytes32,
} from '../../../utils/convert';
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
  TransferType,
  Partition,
} from '../../../types';

const ONE_HUNDRED = new BigNumber(100);

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
 * @param investor is the address of the investor.
 * @param flag index of flag to change. flag is used to know specifics about investor like isAccredited.
 * @param value value of the flag. a flag can be true or false.
 */
interface ModifyInvestorFlag extends TxParams {
  investor: string;
  flag: FlagsType;
  value: boolean;
}

/**
 * @param investors list of the addresses to modify data about.
 * @param flag list of flag indexes to change. Flags are used to know specifics about investor like isAccredited.
 * @param value list of flag values to set. A flag can be true or false.
 */
interface ModifyInvestorFlagMulti extends TxParams {
  investors: string[];
  flag: FlagsType[];
  value: boolean[];
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 */
interface ExecuteTransfer extends TxParams {
  from: string;
  to: string;
  data: string;
}

/**
 * @param transferType type of transfer (0 = General, 1 = Issuance, 2 = Redemption)
 * @param fromValidKYC defines if KYC is required for the sender
 * @param toValidKYC defines if KYC is required for the receiver
 * @param fromRestricted defines if transfer time restriction is checked for the sender
 * @param toRestricted defines if transfer time restriction is checked for the receiver
 */
interface ModifyTransferRequirements extends TxParams {
  transferType: TransferType;
  fromValidKYC: boolean;
  toValidKYC: boolean;
  fromRestricted: boolean;
  toRestricted: boolean;
}

/**
 * @param transferTypes is a list of types of transfer (0 = General, 1 = Issuance, 2 = Redemption)
 * @param fromValidKYC is a list that defines if KYC is required for each sender
 * @param toValidKYC is a list that defines if KYC is required for each receiver
 * @param fromRestricted is a list that defines if transfer time restriction is checked for each sender
 * @param toRestricted is a list that defines if transfer time restriction is checked for each receiver
 */
interface ModifyTransferRequirementsMulti extends TxParams {
  transferTypes: TransferType[];
  fromValidKYC: boolean[];
  toValidKYC: boolean[];
  fromRestricted: boolean[];
  toRestricted: boolean[];
}

/**
 * @param investors is a list of addresses to whitelist
 * @param canSendAfter is a list of the moments when the sale lockup period ends and each investor can freely sell his tokens
 * @param canReceiveAfter is a list of the moments when the purchase lockup period ends and each investor can freely purchase tokens from others
 * @param expiryTime is a list of the moments up to which each investor's KYC will be validated. After that investor needs to re-do KYC
 */
interface ModifyKYCDataMulti extends TxParams {
  investors: string[];
  canSendAfter: Date[];
  canReceiveAfter: Date[];
  expiryTime: Date[];
}

/**
 * @param investors is a list of addresses to whitelist
 * @param canSendAfter is a list of the moments when the sale lockup period ends and each investor can freely sell his tokens
 * @param canReceiveAfter is a list of the moments when the purchase lockup period ends and each investor can freely purchase tokens from others
 * @param expiryTime is a list of the moments up to which each investor's KYC will be validated. After that investor needs to re-do KYC
 * @param validFrom is the time from which this signature is valid
 * @param validTo is the time until which this signature is valid
 * @param nonce nonce of signature (avoid replay attack)
 * @param signature issuer signature
 */
interface ModifyKYCDataSignedMulti extends TxParams {
  investors: string[];
  canSendAfter: Date[];
  canReceiveAfter: Date[];
  expiryTime: Date[];
  validFrom: Date;
  validTo: Date;
  nonce: number;
  signature: string;
}

interface GetInvestors {
  fromIndex: number;
  toIndex: number;
}

/**
 * @param partition identifier
 * @param tokenHolder whose token amount is being queried
 * @param additionalBalance it is the `_value` that transfer during transfer/transferFrom function call
 */
interface GetTokensByPartitionParams {
  partition: Partition;
  tokenHolder: string;
  additionalBalance: BigNumber;
}

// // Return types ////
interface Defaults {
  canSendAfter: Date;
  canReceiveAfter: Date;
}

interface KYCData {
  canSendAfter: Date;
  canReceiveAfter: Date;
  expiryTime: Date;
}

interface KYCDataWithInvestor extends KYCData {
  investor: string;
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
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    return (await this.contract).changeDefaults.sendTransactionAsync(
      dateToBigNumber(params.defaultFromTime),
      dateToBigNumber(params.defaultToTime),
      params.txData,
      params.safetyFactor,
    );
  };

  public changeIssuanceAddress = async (params: ChangeIssuanceAddressParams) => {
    assert.isETHAddressHex('issuanceAddress', params.issuanceAddress);
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    return (await this.contract).changeIssuanceAddress.sendTransactionAsync(
      params.issuanceAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public modifyKYCData = async (params: ModifyKYCDataParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
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
    for (let i = 0; i < investors.length; i += 1) {
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
      stringToBytes32(params.partition),
      params.tokenHolder,
      valueToWei(params.additionalBalance, decimals),
    );
    return weiToValue(result, decimals);
  };

  public modifyKYCDataSigned = async (params: ModifyKYCDataSignedParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
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
   * Used to modify investor Flag.
   */
  public modifyInvestorFlag = async (params: ModifyInvestorFlag) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('investor', params.investor);
    return (await this.contract).modifyInvestorFlag.sendTransactionAsync(
      params.investor,
      params.flag,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to modify investor data.
   */
  public modifyInvestorFlagMulti = async (params: ModifyInvestorFlagMulti) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(
      params.investors.length === params.flag.length && params.flag.length === params.value.length,
      'Mismatched input lengths',
    );
    return (await this.contract).modifyInvestorFlagMulti.sendTransactionAsync(
      params.investors,
      params.flag,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Default implementation of verifyTransfer used by SecurityToken
   * If the transfer request comes from the STO, it only checks that the investor is in the whitelist
   * If the transfer request comes from a token holder, it checks that:
   * a) Both are on the whitelist
   * b) Seller's sale lockup period is over
   * c) Buyer's purchase lockup is over
   */
  public executeTransfer = async (params: ExecuteTransfer) => {
    return (await this.contract).executeTransfer.sendTransactionAsync(
      params.from,
      params.to,
      ONE_HUNDRED, // this value isn't used by the contracts, so we send an arbitrary value
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Default implementation of verifyTransfer used by SecurityToken
   */
  public verifyTransfer = async (params: ExecuteTransfer) => {
    const result = await (await this.contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      ONE_HUNDRED, // this value isn't used by the contracts, so we send an arbitrary value
      params.data,
    );
    return result;
  };

  /**
   * Modifies the successful checks required for a transfer to be deemed valid.
   */
  public modifyTransferRequirements = async (params: ModifyTransferRequirements) => {
    const result = await (await this.contract).modifyTransferRequirements.sendTransactionAsync(
      params.transferType,
      params.fromValidKYC,
      params.toValidKYC,
      params.fromRestricted,
      params.toRestricted,
      params.txData,
      params.safetyFactor,
    );
    return result;
  };

  /**
   * Modifies the successful checks required for transfers.
   */
  public modifyTransferRequirementsMulti = async (params: ModifyTransferRequirementsMulti) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(
      params.transferTypes.length === params.fromValidKYC.length &&
        params.fromValidKYC.length === params.toValidKYC.length &&
        params.toValidKYC.length === params.fromRestricted.length &&
        params.fromRestricted.length === params.toRestricted.length,
      'Mismatched input lengths',
    );
    return (await this.contract).modifyTransferRequirementsMulti.sendTransactionAsync(
      params.transferTypes,
      params.fromValidKYC,
      params.toValidKYC,
      params.fromRestricted,
      params.toRestricted,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Add or remove KYC info of an investor.
   */
  public modifyKYCDataMulti = async (params: ModifyKYCDataMulti) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(
      params.investors.length === params.canSendAfter.length &&
        params.canSendAfter.length === params.canReceiveAfter.length &&
        params.canReceiveAfter.length === params.expiryTime.length,
      'Mismatched input lengths',
    );

    const canSendAfter = params.canSendAfter.map(dateToBigNumber);
    const canReceiveAfter = params.canReceiveAfter.map(dateToBigNumber);
    const expiryTime = params.expiryTime.map(dateToBigNumber);

    return (await this.contract).modifyKYCDataMulti.sendTransactionAsync(
      params.investors,
      canSendAfter,
      canReceiveAfter,
      expiryTime,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Adds or removes addresses from the whitelist - can be called by anyone with a valid signature
   */
  public modifyKYCDataSignedMulti = async (params: ModifyKYCDataSignedMulti) => {
    const canSendAfter = params.canSendAfter.map(dateToBigNumber);
    const canReceiveAfter = params.canReceiveAfter.map(dateToBigNumber);
    const expiryTime = params.expiryTime.map(dateToBigNumber);

    return (await this.contract).modifyKYCDataSignedMulti.sendTransactionAsync(
      params.investors,
      canSendAfter,
      canReceiveAfter,
      expiryTime,
      dateToBigNumber(params.validFrom),
      dateToBigNumber(params.validTo),
      new BigNumber(params.nonce),
      params.signature,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns list of all investors
   */
  public getAllInvestors = async () => {
    const result = await (await this.contract).getAllInvestors.callAsync();
    return result;
  };

  /**
   * Returns list of investors in a range
   */
  public getInvestors = async (params: GetInvestors) => {
    const result = await (await this.contract).getInvestors.callAsync(
      new BigNumber(params.fromIndex),
      new BigNumber(params.toIndex),
    );
    return result;
  };

  /**
   * Return the permissions flags that are associated with general transfer manager
   */
  public getPermissions = async () => {
    const call = await (await this.contract).getPermissions.callAsync();
    const result: Perm[] = [];
    for (let i = 0; i < call.length; i += 1) {
      switch (bytes32ToString(call[i])) {
        case Perm.Admin: {
          result.push(Perm.Admin);
          break;
        }
        case Perm.Operator: {
          result.push(Perm.Operator);
          break;
        }
        default: {
          break;
        }
      }
    }
    return result;
  };

  public getAddressBytes32 = async () => {
    const result = await (await this.contract).getAddressBytes32.callAsync();
    return bytes32ToString(result);
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
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      GeneralTransferManager.abi,
    );
    return logs;
  };
}
