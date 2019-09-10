import { USDTieredSTOContract_3_0_0, BigNumber, Web3Wrapper, USDTieredSTOEvents_3_0_0, EventCallback, USDTieredSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0, USDTieredSTOSetNonAccreditedLimitEventArgs_3_0_0, USDTieredSTOSetTreasuryWalletEventArgs_3_0_0, USDTieredSTOTokenPurchaseEventArgs_3_0_0, USDTieredSTOFundsReceivedEventArgs_3_0_0, USDTieredSTOReserveTokenMintEventArgs_3_0_0, USDTieredSTOSetAddressesEventArgs_3_0_0, USDTieredSTOSetLimitsEventArgs_3_0_0, USDTieredSTOSetTimesEventArgs_3_0_0, USDTieredSTOSetTiersEventArgs_3_0_0, USDTieredSTOSetFundRaiseTypesEventArgs_3_0_0, USDTieredSTOPauseEventArgs_3_0_0, USDTieredSTOUnpauseEventArgs_3_0_0, LogWithDecodedArgs, USDTieredSTOEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import USDTieredSTOWrapper, { TierIndexParams } from './common';
import assert from '../../../../utils/assert';
import {
  ErrorCode, ContractVersion, SubscribeAsyncParams, GetLogsAsyncParams, Subscribe, GetLogs, TxParams, FULL_DECIMALS,
} from '../../../../types';
import {
  numberToBigNumber,  
  weiToValue,
} from '../../../../utils/convert';
import ContractFactory from '../../../../factories/contractFactory';
import { WithSTO_3_0_0 } from '../sto_wrapper';

interface SetAllowBeneficialInvestmentsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetAllowBeneficialInvestments;
  callback: EventCallback<USDTieredSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0>;
}

interface GetSetAllowBeneficialInvestmentsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetAllowBeneficialInvestments;
}

interface SetNonAccreditedLimitSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetNonAccreditedLimit;
  callback: EventCallback<USDTieredSTOSetNonAccreditedLimitEventArgs_3_0_0>;
}

interface GetSetNonAccreditedLimitLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetNonAccreditedLimit;
}

interface SetTreasuryWalletSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetTreasuryWallet;
  callback: EventCallback<USDTieredSTOSetTreasuryWalletEventArgs_3_0_0>;
}

interface GetSetTreasuryWalletLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetTreasuryWallet;
}

interface TokenPurchaseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.TokenPurchase;
  callback: EventCallback<USDTieredSTOTokenPurchaseEventArgs_3_0_0>;
}

interface GetTokenPurchaseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.TokenPurchase;
}

interface FundsReceivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.FundsReceived;
  callback: EventCallback<USDTieredSTOFundsReceivedEventArgs_3_0_0>;
}

interface GetFundsReceivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.FundsReceived;
}

interface ReserveTokenMintSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.ReserveTokenMint;
  callback: EventCallback<USDTieredSTOReserveTokenMintEventArgs_3_0_0>;
}

interface GetReserveTokenMintLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.ReserveTokenMint;
}

interface SetAddressesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetAddresses;
  callback: EventCallback<USDTieredSTOSetAddressesEventArgs_3_0_0>;
}

interface GetSetAddressesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetAddresses;
}

interface SetLimitsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetLimits;
  callback: EventCallback<USDTieredSTOSetLimitsEventArgs_3_0_0>;
}

interface GetSetLimitsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetLimits;
}

interface SetTimesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetTimes;
  callback: EventCallback<USDTieredSTOSetTimesEventArgs_3_0_0>;
}

interface GetSetTimesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetTimes;
}

interface SetTiersSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetTiers;
  callback: EventCallback<USDTieredSTOSetTiersEventArgs_3_0_0>;
}

interface GetSetTiersLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetTiers;
}

interface SetFundRaiseTypesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetFundRaiseTypes;
  callback: EventCallback<USDTieredSTOSetFundRaiseTypesEventArgs_3_0_0>;
}

interface GetSetFundRaiseTypesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.SetFundRaiseTypes;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.Pause;
  callback: EventCallback<USDTieredSTOPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.Unpause;
  callback: EventCallback<USDTieredSTOUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: USDTieredSTOEvents_3_0_0.Unpause;
}

interface USDTieredSTOSubscribeAsyncParams extends Subscribe {
  (params: SetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>;
  (params: SetNonAccreditedLimitSubscribeAsyncParams): Promise<string>;
  (params: SetTreasuryWalletSubscribeAsyncParams): Promise<string>;
  (params: TokenPurchaseSubscribeAsyncParams): Promise<string>;
  (params: FundsReceivedSubscribeAsyncParams): Promise<string>;
  (params: ReserveTokenMintSubscribeAsyncParams): Promise<string>;
  (params: SetAddressesSubscribeAsyncParams): Promise<string>;
  (params: SetLimitsSubscribeAsyncParams): Promise<string>;
  (params: SetTimesSubscribeAsyncParams): Promise<string>;
  (params: SetTiersSubscribeAsyncParams): Promise<string>;
  (params: SetFundRaiseTypesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetUSDTieredSTOLogsAsyncParams extends GetLogs {
  (params: GetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0>[]
  >;
  (params: GetSetNonAccreditedLimitLogsAsyncParams): Promise<
    LogWithDecodedArgs<USDTieredSTOSetNonAccreditedLimitEventArgs_3_0_0>[]
  >;
  (params: GetSetTreasuryWalletLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetTreasuryWalletEventArgs_3_0_0>[]>;
  (params: GetTokenPurchaseLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOTokenPurchaseEventArgs_3_0_0>[]>;
  (params: GetFundsReceivedLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOFundsReceivedEventArgs_3_0_0>[]>;
  (params: GetReserveTokenMintLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOReserveTokenMintEventArgs_3_0_0>[]>;
  (params: GetSetAddressesLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetAddressesEventArgs_3_0_0>[]>;
  (params: GetSetLimitsLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetLimitsEventArgs_3_0_0>[]>;
  (params: GetSetTimesLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetTimesEventArgs_3_0_0>[]>;
  (params: GetSetTiersLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetTiersEventArgs_3_0_0>[]>;
  (params: GetSetFundRaiseTypesLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOSetFundRaiseTypesEventArgs_3_0_0>[]>;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<USDTieredSTOUnpauseEventArgs_3_0_0>[]>;
}

interface MintedByTier {
  mintedInETH: BigNumber;
  mintedInPOLY: BigNumber;
  mintedInSC: BigNumber;
}

interface Tier {
  /** How many token units a buyer gets per USD in this tier */
  rate: BigNumber;
  /** How many token units a buyer gets per USD in this tier (multiplied by 10**18) when investing in POLY up to tokensDiscountPoly */
  rateDiscountPoly: BigNumber;
  /** How many tokens are available in this tier (relative to totalSupply) */
  tokenTotal: BigNumber;
  /** How many token units are available in this tier (relative to totalSupply) at the ratePerTierDiscountPoly rate */
  tokensDiscountPoly: BigNumber;
  /** How many tokens have been minted in this tier (relative to totalSupply) */
  mintedTotal: BigNumber;
  /** How many tokens have been minted in this tier (relative to totalSupply) at discounted POLY rate */
  mintedDiscountPoly: BigNumber;
}

const USDTieredSTOWrapperBase_3_0_0 = WithSTO_3_0_0(USDTieredSTOWrapper);

export class USDTieredSTO_3_0_0 extends USDTieredSTOWrapperBase_3_0_0 {
  public contract: Promise<USDTieredSTOContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<USDTieredSTOContract_3_0_0>, contractFactory: ContractFactory) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Return the total number of tokens sold in a given tier
   * @return Total amount of tokens sold in the tier
   */
  public getTokensSoldByTier = async (params: TierIndexParams) => {
    const tiers = await this.getNumberOfTiers();
    assert.assert(params.tier < new BigNumber(tiers).toNumber(), ErrorCode.InvalidData, 'Invalid tier');
    return weiToValue(
      await (await this.contract).getTokensSoldByTier.callAsync(numberToBigNumber(params.tier)),
      await (await this.securityTokenContract()).decimals.callAsync(),
    );
  };

  /**
   * Ethereum account address to receive unsold tokens
   * @return wallet address
   */
  public treasuryWallet = async () => {
    return (await this.contract).treasuryWallet.callAsync();
  };

  /**
   *  Check if the STO is finalized
   *  @return boolean status of finalized
   */
  public isFinalized = async (): Promise<boolean> => {
    return (await this.contract).isFinalized.callAsync();
  };

  /**
   * Return tiers
   * @return rate, rateDiscountPoly, tokensTotal, tokensDiscountPoly, mintedTotal, mintedDiscountPoly
   */
  public tiers = async (params: TierIndexParams): Promise<Tier> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).tiers.callAsync(numberToBigNumber(params.tier));
    const typedResult: Tier = {
      rate: weiToValue(result[0], FULL_DECIMALS),
      rateDiscountPoly: weiToValue(result[1], FULL_DECIMALS),
      tokenTotal: weiToValue(result[2], decimals),
      tokensDiscountPoly: weiToValue(result[3], decimals),
      mintedTotal: weiToValue(result[4], decimals),
      mintedDiscountPoly: weiToValue(result[5], decimals),
    };
    return typedResult;
  }; 

  /**
   * Return array of minted tokens in each fund raise type for given tier
   * @return tokens amount by tier
   */
  public getTokensMintedByTier = async (params: TierIndexParams) => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    assert.assert(params.tier < (await this.getNumberOfTiers()), ErrorCode.InvalidData, 'Invalid tier');
    const result = await (await this.contract).getTokensMintedByTier.callAsync(numberToBigNumber(params.tier));
    const typedResult: MintedByTier = {
      mintedInETH: weiToValue(result[0], decimals),
      mintedInPOLY: weiToValue(result[1], decimals),
      mintedInSC: weiToValue(result[2], decimals),
    };
    return typedResult;
  };

  /**
   * Finalizes the STO and mint remaining tokens to reserve address
   * Reserve address must be whitelisted to successfully finalize
   */
  public finalize = async (params: TxParams) => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(!(await this.isFinalized()), ErrorCode.PreconditionRequired, 'STO is already finalized');
    // we can't execute mint to validate the method
    return (await this.contract).finalize.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: USDTieredSTOSubscribeAsyncParams = async <ArgsType extends USDTieredSTOEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetUSDTieredSTOLogsAsyncParams = async <ArgsType extends USDTieredSTOEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, USDTieredSTOEvents_3_0_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isUSDTieredSTO_3_0_0(wrapper: any): wrapper is USDTieredSTO_3_0_0 {
  return wrapper.version === ContractVersion.V3_0_0;
};