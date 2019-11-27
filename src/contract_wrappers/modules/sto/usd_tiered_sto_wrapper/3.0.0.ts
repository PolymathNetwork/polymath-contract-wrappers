import { USDTieredSTOContract_3_0_0, BigNumber, Web3Wrapper, PolyResponse } from '@polymathnetwork/abi-wrappers';
import USDTieredSTOCommon, { TierIndexParams } from './common';
import assert from '../../../../utils/assert';
import { ErrorCode, ContractVersion, TxParams, FULL_DECIMALS, Constructor, FundRaiseType } from '../../../../types';
import { numberToBigNumber, weiToValue } from '../../../../utils/convert';
import ContractFactory from '../../../../factories/contractFactory';
import { WithSTO_3_0_0 } from '../sto_wrapper';

/**
 * @param fundRaiseType Actual currency
 * @param oracleAddress Address of the oracle
 */
export interface ModifyOracleParams extends TxParams {
  fundRaiseType: FundRaiseType;
  oracleAddress: string;
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

const USDTieredSTOBase_3_0_0 = WithSTO_3_0_0((USDTieredSTOCommon as unknown) as Constructor<USDTieredSTOCommon>);

export class USDTieredSTO_3_0_0 extends USDTieredSTOBase_3_0_0 {
  public contract: Promise<USDTieredSTOContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate USDTieredSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<USDTieredSTOContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
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
   * Modifies oracle
   */
  public modifyOracle = async (params: ModifyOracleParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'The caller must be the ST owner',
    );
    assert.assert(
      params.fundRaiseType === FundRaiseType.POLY || params.fundRaiseType === FundRaiseType.ETH,
      ErrorCode.InvalidData,
      'Invalid currency',
    );
    return (await this.contract).modifyOracle.sendTransactionAsync(
      params.fundRaiseType,
      params.oracleAddress,
      params.txData,
      params.safetyFactor,
    );
  };
}

export function isUSDTieredSTO_3_0_0(wrapper: USDTieredSTOCommon): wrapper is USDTieredSTO_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
