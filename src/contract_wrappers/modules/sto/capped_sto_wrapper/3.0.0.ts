import { CappedSTOContract_3_0_0, Web3Wrapper, BigNumber } from '@polymathnetwork/abi-wrappers';
import CappedSTOCommon from './common';
import { ContractVersion, FULL_DECIMALS, Constructor } from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';
import { WithSTO_3_0_0 } from '../sto_wrapper';
import { bigNumberToDate, weiToValue } from '../../../../utils/convert';

// // Return types ////
export interface CappedSTODetails {
  /** Timestamp at which offering gets start. */
  startTime: Date;
  /** Timestamp at which offering ends. */
  endTime: Date;
  /** Number of token base units this STO will be allowed to sell to investors. */
  cap: BigNumber;
  /** Token units a buyer gets(multiplied by 10^18) per wei / base unit of POLY */
  rate: BigNumber;
  /** Amount of funds raised */
  fundsRaised: BigNumber;
  /** Number of individual investors this STO have. */
  investorCount: number;
  /** Amount of tokens get sold. */
  totalTokensSold: BigNumber;
  /** Boolean value to justify whether the fund raise type is POLY or not, i.e true for POLY. */
  isRaisedInPoly: boolean;
}
// // End of return types ////

const CappedSTOBase_3_0_0 = WithSTO_3_0_0((CappedSTOCommon as unknown) as Constructor<CappedSTOCommon>);

export class CappedSTO_3_0_0 extends CappedSTOBase_3_0_0 {
  public contract: Promise<CappedSTOContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate CappedSTO_3_0_0
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<CappedSTOContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Return the STO details
   * @return Date at which offering gets start, Date at which offering ends, Number of token base units this STO will
   * be allowed to sell to investors, Token units a buyer gets as the rate, Amount of funds raised, Number of
   * individual investors this STO have, Amount of tokens get sold, Boolean value to justify whether the fund raise
   * type is POLY or not, ie true for POLY
   */
  public getSTODetails = async (): Promise<CappedSTODetails> => {
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).getSTODetails.callAsync();
    const typedResult: CappedSTODetails = {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      cap: weiToValue(result[2], decimals),
      rate: weiToValue(result[3], FULL_DECIMALS),
      fundsRaised: weiToValue(result[4], FULL_DECIMALS),
      investorCount: new BigNumber(result[5]).toNumber(),
      totalTokensSold: weiToValue(result[6], decimals),
      isRaisedInPoly: result[7],
    };
    return typedResult;
  };
}

export function isCappedSTO_3_0_0(wrapper: CappedSTOCommon): wrapper is CappedSTO_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
