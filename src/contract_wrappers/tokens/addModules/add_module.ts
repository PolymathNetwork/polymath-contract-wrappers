import { BigNumber } from '@0x/utils';
import { FundRaiseType, ModuleName, TxParams } from '../../../types';

export interface AddModuleParams extends TxParams {
  moduleName: ModuleName;
  address: string;
  maxCost?: BigNumber;
  budget?: BigNumber;
  data?:
    | CountTransferManagerData
    | PercentageTransferManagerData
    | DividendCheckpointData
    | CappedSTOData
    | USDTieredSTOData;
}

export interface CountTransferManagerData {
  maxHolderCount: number;
}

export interface PercentageTransferManagerData {
  maxHolderPercentage: BigNumber;
  allowPrimaryIssuance: boolean;
}

export interface DividendCheckpointData {
  wallet: string;
}

export interface CappedSTOData {
  startTime: Date;
  endTime: Date;
  cap: BigNumber;
  rate: BigNumber;
  fundRaiseTypes: FundRaiseType[];
  fundsReceiver: string;
}

export interface USDTieredSTOData {
  startTime: Date;
  endTime: Date;
  ratePerTier: BigNumber[];
  ratePerTierDiscountPoly: BigNumber[];
  tokensPerTierTotal: BigNumber[];
  tokensPerTierDiscountPoly: BigNumber[];
  nonAccreditedLimitUSD: BigNumber;
  minimumInvestmentUSD: BigNumber;
  fundRaiseTypes: FundRaiseType[];
  wallet: string;
  reserveWallet: string;
  usdTokens: string[];
}
export abstract class AddModule {
  // Maybe we can pass in CappedSTO.abi and CappedSTOData here
  abstract getData(): string;

  abstract callAssertions(): void;
}
