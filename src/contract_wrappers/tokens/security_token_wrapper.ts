import {
  FeatureRegistryContract,
  ISecurityTokenContract,
  ModuleFactoryContract,
  ModuleRegistryContract,
  PolyResponse,
  PolyTokenContract,
  SecurityTokenApprovalEventArgs,
  SecurityTokenAuthorizedOperatorByPartitionEventArgs,
  SecurityTokenAuthorizedOperatorEventArgs,
  SecurityTokenCheckpointCreatedEventArgs,
  SecurityTokenControllerRedemptionEventArgs,
  SecurityTokenControllerTransferEventArgs,
  SecurityTokenDisableControllerEventArgs,
  SecurityTokenDocumentRemovedEventArgs,
  SecurityTokenDocumentUpdatedEventArgs,
  SecurityTokenEventArgs,
  SecurityTokenEvents,
  SecurityTokenFreezeIssuanceEventArgs,
  SecurityTokenFreezeTransfersEventArgs,
  SecurityTokenGranularityChangedEventArgs,
  SecurityTokenIssuedByPartitionEventArgs,
  SecurityTokenIssuedEventArgs,
  SecurityTokenModuleAddedEventArgs,
  SecurityTokenModuleArchivedEventArgs,
  SecurityTokenModuleBudgetChangedEventArgs,
  SecurityTokenModuleRemovedEventArgs,
  SecurityTokenModuleUnarchivedEventArgs,
  SecurityTokenModuleUpgradedEventArgs,
  SecurityTokenOwnershipTransferredEventArgs,
  SecurityTokenRedeemedByPartitionEventArgs,
  SecurityTokenRedeemedEventArgs,
  SecurityTokenRevokedOperatorByPartitionEventArgs,
  SecurityTokenRevokedOperatorEventArgs,
  SecurityTokenSetControllerEventArgs,
  SecurityTokenTokenUpgradedEventArgs,
  SecurityTokenTransferByPartitionEventArgs,
  SecurityTokenTransferEventArgs,
  SecurityTokenTreasuryWalletChangedEventArgs,
  SecurityTokenUpdateTokenDetailsEventArgs,
  SecurityTokenUpdateTokenNameEventArgs,
  CappedSTO,
  CountTransferManager,
  ERC20DividendCheckpoint,
  EtherDividendCheckpoint,
  ISecurityToken,
  PercentageTransferManager,
  USDTieredSTO,
  TxData,
  Web3Wrapper,
  ContractAbi,
  LogWithDecodedArgs,
  BigNumber,
  ethers,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';
import ContractFactory from '../../factories/contractFactory';
import {
  EventCallback,
  Feature,
  FULL_DECIMALS,
  FundRaiseType,
  GetLogs,
  GetLogsAsyncParams,
  ModuleName,
  ModuleType,
  Partition,
  PERCENTAGE_DECIMALS,
  Perm,
  Subscribe,
  SubscribeAsyncParams,
  TxParams,
  CappedSTOFundRaiseType,
  TransferStatusCode,
} from '../../types';
import {
  bigNumberToDate,
  bytes32ArrayToStringArray,
  bytes32ToString,
  dateToBigNumber,
  numberToBigNumber,
  parsePartitionBytes32Value,
  stringToBytes32,
  valueArrayToWeiArray,
  valueToWei,
  weiToValue,
} from '../../utils/convert';
import functionsUtils from '../../utils/functions_utils';

const NO_MODULE_DATA = '0x0000000000000000';
const MAX_CHECKPOINT_NUMBER = new BigNumber(2 ** 256 - 1);
const BIG_NUMBER_ZERO = new BigNumber(0);

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Approval;
  callback: EventCallback<SecurityTokenApprovalEventArgs>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Transfer;
  callback: EventCallback<SecurityTokenTransferEventArgs>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Transfer;
}

interface ModuleAddedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleAdded;
  callback: EventCallback<SecurityTokenModuleAddedEventArgs>;
}

interface GetModuleAddedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleAdded;
}

interface ModuleUpgradedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleUpgraded;
  callback: EventCallback<SecurityTokenModuleUpgradedEventArgs>;
}

interface GetModuleUpgradedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleUpgraded;
}

interface UpdateTokenDetailsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails;
  callback: EventCallback<SecurityTokenUpdateTokenDetailsEventArgs>;
}

interface GetUpdateTokenDetailsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails;
}

interface UpdateTokenNameSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenName;
  callback: EventCallback<SecurityTokenUpdateTokenNameEventArgs>;
}

interface GetUpdateTokenNameLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenName;
}

interface GranularityChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.GranularityChanged;
  callback: EventCallback<SecurityTokenGranularityChangedEventArgs>;
}

interface GetGranularityChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.GranularityChanged;
}

interface ModuleArchivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleArchived;
  callback: EventCallback<SecurityTokenModuleArchivedEventArgs>;
}

interface GetModuleArchivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleArchived;
}

interface ModuleUnarchivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleUnarchived;
  callback: EventCallback<SecurityTokenModuleUnarchivedEventArgs>;
}

interface GetModuleUnarchivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleUnarchived;
}

interface ModuleRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleRemoved;
  callback: EventCallback<SecurityTokenModuleRemovedEventArgs>;
}

interface GetModuleRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleRemoved;
}

interface ModuleBudgetChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleBudgetChanged;
  callback: EventCallback<SecurityTokenModuleBudgetChangedEventArgs>;
}

interface GetModuleBudgetChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleBudgetChanged;
}

interface TransferByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.TransferByPartition;
  callback: EventCallback<SecurityTokenTransferByPartitionEventArgs>;
}

interface GetTransferByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.TransferByPartition;
}

interface AuthorizedOperatorSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.AuthorizedOperator;
  callback: EventCallback<SecurityTokenAuthorizedOperatorEventArgs>;
}

interface GetAuthorizedOperatorLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.AuthorizedOperator;
}

interface RevokedOperatorSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.RevokedOperator;
  callback: EventCallback<SecurityTokenRevokedOperatorEventArgs>;
}

interface GetRevokedOperatorLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.RevokedOperator;
}

interface AuthorizedOperatorByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.AuthorizedOperatorByPartition;
  callback: EventCallback<SecurityTokenAuthorizedOperatorByPartitionEventArgs>;
}

interface GetAuthorizedOperatorByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.AuthorizedOperatorByPartition;
}

interface RevokedOperatorByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.RevokedOperatorByPartition;
  callback: EventCallback<SecurityTokenRevokedOperatorByPartitionEventArgs>;
}

interface GetRevokedOperatorByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.RevokedOperatorByPartition;
}

interface IssuedByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.IssuedByPartition;
  callback: EventCallback<SecurityTokenIssuedByPartitionEventArgs>;
}

interface GetIssuedByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.IssuedByPartition;
}

interface RedeemedByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.RedeemedByPartition;
  callback: EventCallback<SecurityTokenRedeemedByPartitionEventArgs>;
}

interface GetRedeemedByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.RedeemedByPartition;
}

interface ControllerTransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ControllerTransfer;
  callback: EventCallback<SecurityTokenControllerTransferEventArgs>;
}

interface GetControllerTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ControllerTransfer;
}

interface ControllerRedemptionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ControllerRedemption;
  callback: EventCallback<SecurityTokenControllerRedemptionEventArgs>;
}

interface GetControllerRedemptionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ControllerRedemption;
}

interface DocumentRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.DocumentRemoved;
  callback: EventCallback<SecurityTokenDocumentRemovedEventArgs>;
}

interface GetDocumentRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.DocumentRemoved;
}

interface DocumentUpdatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.DocumentUpdated;
  callback: EventCallback<SecurityTokenDocumentUpdatedEventArgs>;
}

interface GetDocumentUpdatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.DocumentUpdated;
}

interface FreezeTransfersSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeTransfers;
  callback: EventCallback<SecurityTokenFreezeTransfersEventArgs>;
}

interface GetFreezeTransfersLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeTransfers;
}

interface CheckpointCreatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.CheckpointCreated;
  callback: EventCallback<SecurityTokenCheckpointCreatedEventArgs>;
}

interface GetCheckpointCreatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.CheckpointCreated;
}

interface FreezeIssuanceSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeIssuance;
  callback: EventCallback<SecurityTokenFreezeIssuanceEventArgs>;
}

interface GetFreezeIssuanceLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeIssuance;
}

interface IssuedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Issued;
  callback: EventCallback<SecurityTokenIssuedEventArgs>;
}

interface GetIssuedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Issued;
}

interface RedeemedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Redeemed;
  callback: EventCallback<SecurityTokenRedeemedEventArgs>;
}

interface GetRedeemedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Redeemed;
}

interface SetControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.SetController;
  callback: EventCallback<SecurityTokenSetControllerEventArgs>;
}

interface GetSetControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.SetController;
}

interface TreasuryWalletChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.TreasuryWalletChanged;
  callback: EventCallback<SecurityTokenTreasuryWalletChangedEventArgs>;
}

interface GetTreasuryWalletChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.TreasuryWalletChanged;
}

interface DisableControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.DisableController;
  callback: EventCallback<SecurityTokenDisableControllerEventArgs>;
}

interface GetDisableControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.DisableController;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred;
  callback: EventCallback<SecurityTokenOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred;
}

interface TokenUpgradedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.TokenUpgraded;
  callback: EventCallback<SecurityTokenTokenUpgradedEventArgs>;
}

interface GetTokenUpgradedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.TokenUpgraded;
}

interface SecurityTokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
  (params: ModuleAddedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUpgradedSubscribeAsyncParams): Promise<string>;
  (params: UpdateTokenDetailsSubscribeAsyncParams): Promise<string>;
  (params: UpdateTokenNameSubscribeAsyncParams): Promise<string>;
  (params: GranularityChangedSubscribeAsyncParams): Promise<string>;
  (params: ModuleArchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUnarchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleRemovedSubscribeAsyncParams): Promise<string>;
  (params: ModuleBudgetChangedSubscribeAsyncParams): Promise<string>;
  (params: TransferByPartitionSubscribeAsyncParams): Promise<string>;
  (params: AuthorizedOperatorSubscribeAsyncParams): Promise<string>;
  (params: RevokedOperatorSubscribeAsyncParams): Promise<string>;
  (params: AuthorizedOperatorByPartitionSubscribeAsyncParams): Promise<string>;
  (params: RevokedOperatorByPartitionSubscribeAsyncParams): Promise<string>;
  (params: IssuedByPartitionSubscribeAsyncParams): Promise<string>;
  (params: RedeemedByPartitionSubscribeAsyncParams): Promise<string>;
  (params: ControllerTransferSubscribeAsyncParams): Promise<string>;
  (params: ControllerRedemptionSubscribeAsyncParams): Promise<string>;
  (params: DocumentRemovedSubscribeAsyncParams): Promise<string>;
  (params: DocumentUpdatedSubscribeAsyncParams): Promise<string>;
  (params: FreezeTransfersSubscribeAsyncParams): Promise<string>;
  (params: CheckpointCreatedSubscribeAsyncParams): Promise<string>;
  (params: FreezeIssuanceSubscribeAsyncParams): Promise<string>;
  (params: IssuedSubscribeAsyncParams): Promise<string>;
  (params: RedeemedSubscribeAsyncParams): Promise<string>;
  (params: SetControllerSubscribeAsyncParams): Promise<string>;
  (params: TreasuryWalletChangedSubscribeAsyncParams): Promise<string>;
  (params: DisableControllerSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: TokenUpgradedSubscribeAsyncParams): Promise<string>;
}

interface GetSecurityTokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenApprovalEventArgs>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenTransferEventArgs>[]>;
  (params: GetModuleAddedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleAddedEventArgs>[]>;
  (params: GetModuleUpgradedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleUpgradedEventArgs>[]>;
  (params: GetUpdateTokenDetailsLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenUpdateTokenDetailsEventArgs>[]
  >;
  (params: GetUpdateTokenNameLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenUpdateTokenNameEventArgs>[]>;
  (params: GetGranularityChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenGranularityChangedEventArgs>[]
  >;
  (params: GetModuleArchivedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleArchivedEventArgs>[]>;
  (params: GetModuleUnarchivedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleUnarchivedEventArgs>[]>;
  (params: GetModuleRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleRemovedEventArgs>[]>;
  (params: GetModuleBudgetChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenModuleBudgetChangedEventArgs>[]
  >;
  (params: GetTransferByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenModuleBudgetChangedEventArgs>[]
  >;
  (params: GetAuthorizedOperatorLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetRevokedOperatorLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetAuthorizedOperatorByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]
  >;
  (params: GetRevokedOperatorByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]
  >;
  (params: GetIssuedByPartitionLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetRedeemedByPartitionLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetControllerTransferLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetControllerRedemptionLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]
  >;
  (params: GetDocumentRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetDocumentUpdatedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetFreezeTransfersLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetCheckpointCreatedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenCheckpointCreatedEventArgs>[]>;
  (params: GetFreezeIssuanceLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeIssuanceEventArgs>[]>;
  (params: GetIssuedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenIssuedEventArgs>[]>;
  (params: GetRedeemedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenRedeemedEventArgs>[]>;
  (params: GetSetControllerLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenSetControllerEventArgs>[]>;
  (params: GetTreasuryWalletChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenTreasuryWalletChangedEventArgs>[]
  >;
  (params: GetDisableControllerLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenDisableControllerEventArgs>[]>;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenOwnershipTransferredEventArgs>[]
  >;
  (params: GetTokenUpgradedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenTokenUpgradedEventArgs>[]>;
}

interface IsOperatorParams {
  operator: string;
  tokenHolder: string;
}

interface IsOperatorForPartitionParams extends IsOperatorParams {
  partition: Partition;
}

interface PartitionsOfParams {
  tokenHolder: string;
}

interface FreezeIssuanceParams extends TxParams {
  signature: string;
}
/**
 * @param type type of the module
 */
interface ModuleTypeParams {
  type: ModuleType;
}

interface ModuleAddressParams {
  moduleAddress: string;
}

/**
 * @param module address of the module
 */
interface ModuleAddressTxParams extends TxParams {
  moduleAddress: string;
}

/**
 * @param datastore address
 */
interface DataStoreAddressParams extends TxParams {
  dataStore: string;
}

/**
 * @param name
 * @param uri
 * @param documentHash
 */
interface SetDocumentParams extends TxParams {
  name: string;
  uri: string;
  documentHash: string;
}

/**
 * @param name
 */
interface DocumentParams extends TxParams {
  name: string;
}

/**
 * @param treasuryWallet address
 */
interface ChangeTreasuryWalletParams extends TxParams {
  treasuryWallet: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface CanTransferParams {
  to: string;
  value: BigNumber;
  data: string;
}

interface CanTransferFromParams extends CanTransferParams {
  from: string;
}

interface CanTransferByPartitionParams extends CanTransferFromParams {
  partition: Partition;
}

interface ChangeApprovalParams extends TxParams {
  spender: string;
  value: BigNumber;
}

interface TransferOwnershipParams extends TxParams {
  newOwner: string;
}

interface ModuleNameParams {
  moduleName: ModuleName;
}

interface WithdrawERC20Params extends TxParams {
  tokenContract: string;
  value: BigNumber;
}

interface ChangeModuleBudgetParams extends TxParams {
  module: string;
  change: BigNumber;
  increase: boolean;
}

interface UpdateTokenDetailsParams extends TxParams {
  newTokenDetails: string;
}

interface ChangeGranularityParams extends TxParams {
  granularity: BigNumber;
}

interface ChangeNameParams extends TxParams {
  name: string;
}

interface CheckpointIdParams {
  checkpointId: number;
}

interface GetInvestorsSubsetAtParams extends CheckpointIdParams {
  start: number;
  end: number;
}

interface IterateInvestorsParams {
  start: number;
  end: number;
}

interface TransferWithDataParams extends TxParams {
  to: string;
  value: BigNumber;
  data: string;
}

interface TransferFromWithDataParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

interface IssueParams extends TxParams {
  investor: string;
  value: BigNumber;
  data?: string;
}

interface IssueByPartitionParams extends IssueParams {
  partition: Partition;
}

interface IssueMultiParams extends TxParams {
  investors: string[];
  values: BigNumber[];
}

interface CheckPermissionParams {
  delegateAddress: string;
  moduleAddress: string;
  permission: Perm;
}

interface RedeemParams extends TxParams {
  value: BigNumber;
  data: string;
}

interface RedeemByPartitionParams extends RedeemParams {
  partition: Partition;
}

interface OperatorRedeemByPartitionParams extends RedeemByPartitionParams {
  tokenHolder: string;
  operatorData: string;
}

interface RedeemFromParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
}

interface BalanceOfAtParams {
  investor: string;
  checkpointId: number;
}

interface BalanceOfByPartitionParams {
  partition: Partition;
  tokenHolder: string;
}

interface TransferByPartitionParams extends TxParams {
  partition: Partition;
  to: string;
  value: BigNumber;
  data: string;
}

interface AuthorizeOperatorParams extends TxParams {
  operator: string;
}

interface AuthorizeOperatorByPartitionParams extends AuthorizeOperatorParams {
  partition: Partition;
}

interface RevokeOperatorParams extends TxParams {
  operator: string;
}

interface RevokeOperatorByPartitionParams extends RevokeOperatorParams {
  partition: Partition;
}

interface OperatorTransferByPartitionParams extends TransferByPartitionParams {
  from: string;
  operatorData: string;
}

interface SetControllerParams extends TxParams {
  controller: string;
}

interface DisableControllerParams extends TxParams {
  signature: string;
}

interface ControllerTransferParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
  operatorData: string;
}

interface ControllerRedeemParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
  operatorData: string;
}

interface AddModuleParams extends TxParams {
  moduleName: ModuleName;
  address: string;
  archived: boolean;
  maxCost?: BigNumber;
  budget?: BigNumber;
  label?: string;
  data?:
    | CountTransferManagerData
    | PercentageTransferManagerData
    | DividendCheckpointData
    | CappedSTOData
    | USDTieredSTOData;
}

interface ProduceAddModuleInformation {
  maxCost: BigNumber;
  budget: BigNumber;
  data: string;
}

interface AddNoDataModuleParams extends AddModuleParams {
  moduleName:
    | ModuleName.GeneralPermissionManager
    | ModuleName.GeneralTransferManager
    | ModuleName.ManualApprovalTransferManager
    | ModuleName.VolumeRestrictionTM;
  data?: undefined;
}

interface AddCountTransferManagerParams extends AddModuleParams {
  moduleName: ModuleName.CountTransferManager;
  data: CountTransferManagerData;
}

interface AddPercentageTransferManagerParams extends AddModuleParams {
  moduleName: ModuleName.PercentageTransferManager;
  data: PercentageTransferManagerData;
}

interface AddDividendCheckpointParams extends AddModuleParams {
  moduleName: ModuleName.EtherDividendCheckpoint | ModuleName.ERC20DividendCheckpoint;
  data: DividendCheckpointData;
}

interface AddCappedSTOParams extends AddModuleParams {
  moduleName: ModuleName.CappedSTO;
  data: CappedSTOData;
}

interface AddUSDTieredSTOParams extends AddModuleParams {
  moduleName: ModuleName.UsdTieredSTO;
  data: USDTieredSTOData;
}

interface CountTransferManagerData {
  maxHolderCount: number;
}

interface PercentageTransferManagerData {
  maxHolderPercentage: BigNumber;
  allowPrimaryIssuance: boolean;
}

interface DividendCheckpointData {
  wallet: string;
}

interface CappedSTOData {
  startTime: Date;
  endTime: Date;
  cap: BigNumber;
  rate: BigNumber;
  /**
   * In the smart contracts, this parameter is a single-element array.
   * It has been abstracted and simplified here
   */
  fundRaiseType: CappedSTOFundRaiseType;
  fundsReceiver: string;
}

interface USDTieredSTOData {
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
  treasuryWallet: string;
  usdTokens: string[];
}

interface AddModuleInterface {
  (params: AddCountTransferManagerParams): Promise<PolyResponse>;
  (params: AddPercentageTransferManagerParams): Promise<PolyResponse>;
  (params: AddDividendCheckpointParams): Promise<PolyResponse>;
  (params: AddCappedSTOParams): Promise<PolyResponse>;
  (params: AddUSDTieredSTOParams): Promise<PolyResponse>;
  (params: AddNoDataModuleParams): Promise<PolyResponse>;
}

// // Return types ////
interface ModuleData {
  /** Module name */
  name: string;
  /** Module address */
  address: string;
  /** Module factory address */
  factoryAddress: string;
  /** Whether module is archived */
  archived: boolean;
  /** Modules types */
  types: number[];
  /** Module label */
  label: string;
}

interface DocumentData {
  documentUri: string;
  documentHash: string;
  documentTime: Date;
}

interface CanTransferFromData {
  /** Status Code */
  statusCode: TransferStatusCode;
  /** Reason Code */
  reasonCode: string;
}

interface CanTransferByPartitionData extends CanTransferFromData {
  /** Partition */
  partition: Partition;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export default class SecurityTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = ISecurityToken.abi;

  protected contract: Promise<ISecurityTokenContract>;

  protected contractFactory: ContractFactory;

  protected featureRegistryContract = async (): Promise<FeatureRegistryContract> => {
    return this.contractFactory.getFeatureRegistryContract();
  };

  protected moduleFactoryContract = async (address: string): Promise<ModuleFactoryContract> => {
    return this.contractFactory.getModuleFactoryContract(address);
  };

  protected polyTokenContract = async (): Promise<PolyTokenContract> => {
    return this.contractFactory.getPolyTokenContract();
  };

  protected moduleRegistryContract = async (): Promise<ModuleRegistryContract> => {
    return this.contractFactory.getModuleRegistryContract();
  };

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ISecurityTokenContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract);
    this.contract = contract;
    this.contractFactory = contractFactory;
  }

  /**
   * Value of current checkpoint
   */
  public currentCheckpointId = async () => {
    return (await this.contract).currentCheckpointId.callAsync();
  };

  public isOperator = async (params: IsOperatorParams): Promise<boolean> => {
    return (await this.contract).isOperator.callAsync(params.operator, params.tokenHolder);
  };

  public isOperatorForPartition = async (params: IsOperatorForPartitionParams): Promise<boolean> => {
    return (await this.contract).isOperatorForPartition.callAsync(
      stringToBytes32(params.partition),
      params.operator,
      params.tokenHolder,
    );
  };

  public partitionsOf = async (params: PartitionsOfParams): Promise<Partition[]> => {
    const partitions = await (await this.contract).partitionsOf.callAsync(params.tokenHolder);
    return partitions.map(parsePartitionBytes32Value);
  };

  /**
   * Datastore address
   * @return address
   */
  public dataStore = async (): Promise<string> => {
    return (await this.contract).dataStore.callAsync();
  };

  /**
   * Granular level of the token
   */
  public granularity = async () => {
    return (await this.contract).granularity.callAsync();
  };

  /**
   * Controller
   */
  public controller = async () => {
    return (await this.contract).controller.callAsync();
  };

  public decreaseAllowance = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).decreaseAllowance.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  public polyToken = async () => {
    return (await this.contract).polyToken.callAsync();
  };

  public polymathRegistry = async () => {
    return (await this.contract).polymathRegistry.callAsync();
  };

  public controllerDisabled = async () => {
    return (await this.contract).controllerDisabled.callAsync();
  };

  public owner = async () => {
    return (await this.contract).owner.callAsync();
  };

  public isIssuable = async () => {
    return (await this.contract).isIssuable.callAsync();
  };

  public isOwner = async (): Promise<boolean> => {
    return (await this.contract).isOwner.callAsync();
  };

  public isControllable = async () => {
    return (await this.contract).isControllable.callAsync();
  };

  public moduleRegistry = async () => {
    return (await this.contract).moduleRegistry.callAsync();
  };

  public securityTokenRegistry = async () => {
    return (await this.contract).securityTokenRegistry.callAsync();
  };

  public tokenDetails = async () => {
    return (await this.contract).tokenDetails.callAsync();
  };

  public increaseAllowance = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).increaseAllowance.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  public transfersFrozen = async () => {
    return (await this.contract).transfersFrozen.callAsync();
  };

  public transferOwnership = async (params: TransferOwnershipParams) => {
    assert.isNonZeroETHAddressHex('newOwner', params.newOwner);
    return (await this.contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor,
    );
  };

  public updateFromRegistry = async (params: TxParams) => {
    return (await this.contract).updateFromRegistry.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public archiveModule = async (params: ModuleAddressTxParams) => {
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleExists(params.moduleAddress);
    await this.checkIsNotArchived(params.moduleAddress);
    return (await this.contract).archiveModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public unarchiveModule = async (params: ModuleAddressTxParams) => {
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleExists(params.moduleAddress);
    await this.checkIsArchived(params.moduleAddress);
    return (await this.contract).unarchiveModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeModule = async (params: ModuleAddressTxParams) => {
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleStructAddressIsNotZero(params.moduleAddress);
    await this.checkIsArchived(params.moduleAddress);
    return (await this.contract).removeModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public getModulesByName = async (params: ModuleNameParams) => {
    const moduleNameHex = stringToBytes32(params.moduleName);
    return (await this.contract).getModulesByName.callAsync(moduleNameHex);
  };

  public withdrawERC20 = async (params: WithdrawERC20Params) => {
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).withdrawERC20.sendTransactionAsync(
      params.tokenContract,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  public changeModuleBudget = async (params: ChangeModuleBudgetParams) => {
    assert.isETHAddressHex('module', params.module);
    await this.checkModuleStructAddressIsNotZero(params.module);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeModuleBudget.sendTransactionAsync(
      params.module,
      valueToWei(params.change, await this.decimals()),
      params.increase,
      params.txData,
      params.safetyFactor,
    );
  };

  public updateTokenDetails = async (params: UpdateTokenDetailsParams) => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).updateTokenDetails.sendTransactionAsync(
      params.newTokenDetails,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeGranularity = async (params: ChangeGranularityParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.isBigNumberGreaterThanZero(params.granularity, 'Granularity must not be 0');
    return (await this.contract).changeGranularity.sendTransactionAsync(
      params.granularity,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeName = async (params: ChangeNameParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.name.length > 0, 'Name required');
    return (await this.contract).changeName.sendTransactionAsync(params.name, params.txData, params.safetyFactor);
  };

  public changeTreasuryWallet = async (params: ChangeTreasuryWalletParams) => {
    assert.isETHAddressHex('treasuryWallet', params.treasuryWallet);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeTreasuryWallet.sendTransactionAsync(
      params.treasuryWallet,
      params.txData,
      params.safetyFactor,
    );
  };

  public changeDataStore = async (params: DataStoreAddressParams) => {
    assert.isETHAddressHex('dataStore', params.dataStore);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeDataStore.sendTransactionAsync(
      params.dataStore,
      params.txData,
      params.safetyFactor,
    );
  };

  public getInvestors = async () => {
    return (await this.contract).getInvestors.callAsync();
  };

  public getInvestorsAt = async (params: CheckpointIdParams) => {
    return (await this.contract).getInvestorsAt.callAsync(numberToBigNumber(params.checkpointId));
  };

  public getInvestorsSubsetAt = async (params: GetInvestorsSubsetAtParams) => {
    return (await this.contract).getInvestorsSubsetAt.callAsync(
      numberToBigNumber(params.checkpointId),
      numberToBigNumber(params.start),
      numberToBigNumber(params.end),
    );
  };

  public iterateInvestors = async (params: IterateInvestorsParams) => {
    return (await this.contract).iterateInvestors.callAsync(
      numberToBigNumber(params.start),
      numberToBigNumber(params.end),
    );
  };

  public getInvestorCount = async (): Promise<BigNumber> => {
    return (await this.contract).getInvestorCount.callAsync();
  };

  public holderCount = async (): Promise<BigNumber> => {
    return (await this.contract).holderCount.callAsync();
  };

  public freezeTransfers = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(!(await this.transfersFrozen()), 'Transfers already frozen');
    return (await this.contract).freezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unfreezeTransfers = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(await this.transfersFrozen(), 'Transfers are not frozen');
    return (await this.contract).unfreezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public transferWithData = async (params: TransferWithDataParams) => {
    assert.isNonZeroETHAddressHex('to', params.to);
    return (await this.contract).transferWithData.sendTransactionAsync(
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public transferFromWithData = async (params: TransferFromWithDataParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isNonZeroETHAddressHex('to', params.to);
    return (await this.contract).transferFromWithData.sendTransactionAsync(
      params.from,
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public freezeIssuance = async (params: FreezeIssuanceParams) => {
    assert.assert(await this.isIssuable(), 'Issuance frozen');
    assert.assert(
      functionsUtils.checksumAddressComparision(
        await this.owner(),
        (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      ),
      'Msg sender must be owner',
    );
    return (await this.contract).freezeIssuance.sendTransactionAsync(
      params.signature,
      params.txData,
      params.safetyFactor,
    );
  };

  public issue = async (params: IssueParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    await this.checkOnlyOwner(params.txData);
    assert.assert(await this.isIssuable(), 'Issuance frozen');
    const canTransfer = await this.canTransfer({
      to: params.investor,
      value: params.value,
      data: params.data || '0x00',
    });
    assert.assert(
      canTransfer.statusCode !== TransferStatusCode.TransferFailure,
      `Transfer Status: ${canTransfer.statusCode}`,
    );
    return (await this.contract).issue.sendTransactionAsync(
      params.investor,
      valueToWei(params.value, await this.decimals()),
      params.data || '0x00',
      params.txData,
      params.safetyFactor,
    );
  };

  public issueByPartition = async (params: IssueByPartitionParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    await this.checkOnlyOwner(params.txData);
    assert.assert(await this.isIssuable(), 'Issuance frozen');
    assert.isValidPartition(params.partition);
    return (await this.contract).issueByPartition.sendTransactionAsync(
      params.partition,
      params.investor,
      valueToWei(params.value, await this.decimals()),
      params.data || '0x00',
      params.txData,
      params.safetyFactor,
    );
  };

  public issueMulti = async (params: IssueMultiParams) => {
    params.investors.forEach(address => assert.isNonZeroETHAddressHex('investors', address));
    assert.assert(
      params.investors.length === params.values.length,
      'Number of investors passed in must be equivalent to number of values',
    );
    assert.assert(await this.isIssuable(), 'Issuance frozen');
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).issueMulti.sendTransactionAsync(
      params.investors,
      valueArrayToWeiArray(params.values, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  public checkPermission = async (params: CheckPermissionParams): Promise<boolean> => {
    assert.isETHAddressHex('delegateAddress', params.delegateAddress);
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    return (await this.contract).checkPermission.callAsync(
      params.delegateAddress,
      params.moduleAddress,
      stringToBytes32(params.permission),
    );
  };

  public redeem = async (params: RedeemParams) => {
    await this.checkBalanceFromGreaterThanValue((await this.web3Wrapper.getAvailableAddressesAsync())[0], params.value);
    return (await this.contract).redeem.sendTransactionAsync(
      valueToWei(params.value, await this.decimals()),
      stringToBytes32(params.data),
      params.txData,
      params.safetyFactor,
    );
  };

  public redeemByPartition = async (params: RedeemByPartitionParams) => {
    await this.checkBalanceFromGreaterThanValue((await this.web3Wrapper.getAvailableAddressesAsync())[0], params.value);
    assert.isValidPartition(params.partition);
    return (await this.contract).redeemByPartition.sendTransactionAsync(
      params.partition,
      valueToWei(params.value, await this.decimals()),
      stringToBytes32(params.data),
      params.txData,
      params.safetyFactor,
    );
  };

  public operatorRedeemByPartition = async (params: OperatorRedeemByPartitionParams) => {
    await this.checkBalanceFromGreaterThanValue((await this.web3Wrapper.getAvailableAddressesAsync())[0], params.value);
    assert.isNonZeroETHAddressHex('TokenHolder', params.tokenHolder);
    assert.assert(params.operatorData.length > 0, 'Operator data cannot be 0');
    assert.isValidPartition(params.partition);
    return (await this.contract).operatorRedeemByPartition.sendTransactionAsync(
      params.partition,
      params.tokenHolder,
      valueToWei(params.value, await this.decimals()),
      stringToBytes32(params.data),
      stringToBytes32(params.operatorData),
      params.txData,
      params.safetyFactor,
    );
  };

  public redeemFrom = async (params: RedeemFromParams) => {
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);
    assert.assert(
      (await this.allowance({
        owner: params.from,
        spender: (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      })).isGreaterThanOrEqualTo(params.value),
      'Insufficient allowance for inputted burn value',
    );
    assert.isETHAddressHex('from', params.from);
    return (await this.contract).redeemFrom.sendTransactionAsync(
      params.from,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public createCheckpoint = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(
      (await this.currentCheckpointId()).isLessThan(MAX_CHECKPOINT_NUMBER),
      'Reached maximum checkpoint number',
    );
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public getCheckpointTimes = async () => {
    const timestamps = await (await this.contract).getCheckpointTimes.callAsync();

    return timestamps.map(bigNumberToDate);
  };

  public totalSupplyAt = async (params: CheckpointIdParams) => {
    assert.assert(
      (await this.currentCheckpointId()).isGreaterThanOrEqualTo(params.checkpointId),
      'Checkpoint id must be less than or equal to currentCheckpoint',
    );
    return weiToValue(
      await (await this.contract).totalSupplyAt.callAsync(numberToBigNumber(params.checkpointId)),
      await this.decimals(),
    );
  };

  public balanceOfAt = async (params: BalanceOfAtParams) => {
    assert.isETHAddressHex('investor', params.investor);
    assert.assert(
      (await this.currentCheckpointId()).isGreaterThanOrEqualTo(params.checkpointId),
      'Checkpoint id must be less than or equal to currentCheckpoint',
    );
    return weiToValue(
      await (await this.contract).balanceOfAt.callAsync(params.investor, numberToBigNumber(params.checkpointId)),
      await this.decimals(),
    );
  };

  public balanceOfByPartition = async (params: BalanceOfByPartitionParams) => {
    assert.isETHAddressHex('investor', params.tokenHolder);
    return weiToValue(
      await (await this.contract).balanceOfByPartition.callAsync(stringToBytes32(params.partition), params.tokenHolder),
      await this.decimals(),
    );
  };

  public transferByPartition = async (params: TransferByPartitionParams) => {
    assert.isETHAddressHex('To', params.to);
    assert.isValidPartition(params.partition);
    return (await this.contract).transferByPartition.sendTransactionAsync(
      stringToBytes32(params.partition),
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public authorizeOperator = async (params: AuthorizeOperatorParams) => {
    assert.isETHAddressHex('Operator', params.operator);
    return (await this.contract).authorizeOperator.sendTransactionAsync(
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  public revokeOperator = async (params: AuthorizeOperatorParams) => {
    assert.isETHAddressHex('Operator', params.operator);
    return (await this.contract).revokeOperator.sendTransactionAsync(
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  public authorizeOperatorByPartition = async (params: AuthorizeOperatorByPartitionParams) => {
    assert.isETHAddressHex('Operator', params.operator);
    assert.isValidPartition(params.partition);
    return (await this.contract).authorizeOperatorByPartition.sendTransactionAsync(
      stringToBytes32(params.partition),
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  public revokeOperatorByPartition = async (params: RevokeOperatorByPartitionParams) => {
    assert.isETHAddressHex('Operator', params.operator);
    assert.isValidPartition(params.partition);
    return (await this.contract).revokeOperatorByPartition.sendTransactionAsync(
      stringToBytes32(params.partition),
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  public operatorTransferByPartition = async (params: OperatorTransferByPartitionParams) => {
    assert.isETHAddressHex('To', params.to);
    assert.isETHAddressHex('From', params.from);
    assert.assert(params.operatorData.length > 0, 'Operator data cannot be 0');
    assert.isValidPartition(params.partition);
    return (await this.contract).operatorTransferByPartition.sendTransactionAsync(
      stringToBytes32(params.partition),
      params.from,
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.operatorData,
      params.txData,
      params.safetyFactor,
    );
  };

  public setController = async (params: SetControllerParams) => {
    await this.checkOnlyOwner(params.txData);
    await this.checkIsControllable();
    assert.isETHAddressHex('controller', params.controller);
    return (await this.contract).setController.sendTransactionAsync(
      params.controller,
      params.txData,
      params.safetyFactor,
    );
  };

  public disableController = async (params: DisableControllerParams) => {
    await this.checkOnlyOwner(params.txData);
    await this.checkIsControllable();
    return (await this.contract).disableController.sendTransactionAsync(
      params.signature,
      params.txData,
      params.safetyFactor,
    );
  };

  public controllerTransfer = async (params: ControllerTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isNonZeroETHAddressHex('to', params.to);
    await this.checkMsgSenderIsController(params.txData);
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);

    return (await this.contract).controllerTransfer.sendTransactionAsync(
      params.from,
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.operatorData,
      params.txData,
      params.safetyFactor,
    );
  };

  public controllerRedeem = async (params: ControllerRedeemParams) => {
    assert.isETHAddressHex('from', params.from);
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);
    await this.checkMsgSenderIsController(params.txData);
    return (await this.contract).controllerRedeem.sendTransactionAsync(
      params.from,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.operatorData,
      params.txData,
      params.safetyFactor,
    );
  };

  public getVersion = async (): Promise<BigNumber[]> => {
    return (await this.contract).getVersion.callAsync();
  };

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: ModuleTypeParams) => {
    return (await this.contract).getModulesByType.callAsync(params.type);
  };

  public getTreasuryWallet = async (): Promise<string> => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  public addModule: AddModuleInterface = async (params: AddModuleParams) => {
    const producedAddModuleInfo = await this.addModuleRequirementsAndGetData(params);
    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      producedAddModuleInfo.data,
      producedAddModuleInfo.maxCost,
      producedAddModuleInfo.budget,
      params.archived,
      params.txData,
      params.safetyFactor,
    );
  };

  public addModuleWithLabel: AddModuleInterface = async (params: AddModuleParams) => {
    const producedAddModuleInfo = await this.addModuleRequirementsAndGetData(params);
    return (await this.contract).addModuleWithLabel.sendTransactionAsync(
      params.address,
      producedAddModuleInfo.data,
      producedAddModuleInfo.maxCost,
      producedAddModuleInfo.budget,
      params.label ? stringToBytes32(params.label) : '',
      params.archived,
      params.txData,
      params.safetyFactor,
    );
  };

  public upgradeModule = async (params: ModuleAddressTxParams) => {
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleExists(params.moduleAddress);
    return (await this.contract).upgradeModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  public upgradeToken = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).upgradeToken.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * @return Returns the data associated to a module
   */
  public getModule = async (params: ModuleAddressParams) => {
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    const result = await (await this.contract).getModule.callAsync(params.moduleAddress);
    const typedResult: ModuleData = {
      name: bytes32ToString(result[0]),
      address: result[1],
      factoryAddress: result[2],
      archived: result[3],
      types: result[4].map(t => new BigNumber(t).toNumber()),
      label: bytes32ToString(result[5]),
    };
    return typedResult;
  };

  private getTransferStatusCode = (result: string) => {
    let status: TransferStatusCode = TransferStatusCode.TransferSuccess;
    switch (result) {
      case TransferStatusCode.TransferFailure: {
        status = TransferStatusCode.TransferFailure;
        break;
      }
      case TransferStatusCode.TransferSuccess: {
        status = TransferStatusCode.TransferSuccess;
        break;
      }
      case TransferStatusCode.InsufficientBalance: {
        status = TransferStatusCode.InsufficientBalance;
        break;
      }
      case TransferStatusCode.InsufficientAllowance: {
        status = TransferStatusCode.InsufficientAllowance;
        break;
      }
      case TransferStatusCode.TransfersHalted: {
        status = TransferStatusCode.TransfersHalted;
        break;
      }
      case TransferStatusCode.FundsLocked: {
        status = TransferStatusCode.FundsLocked;
        break;
      }
      case TransferStatusCode.InvalidSender: {
        status = TransferStatusCode.InvalidSender;
        break;
      }
      case TransferStatusCode.InvalidReceiver: {
        status = TransferStatusCode.InvalidReceiver;
        break;
      }
      case TransferStatusCode.InvalidOperator: {
        status = TransferStatusCode.InvalidOperator;
        break;
      }
      default: {
        break;
      }
    }
    return status;
  };

  /**
   * Validates if can transfer
   * @return statusCode, reasonCode
   */
  public canTransfer = async (params: CanTransferParams) => {
    assert.isETHAddressHex('to', params.to);
    const result = await (await this.contract).canTransfer.callAsync(
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
    );
    const status = this.getTransferStatusCode(result[0]);
    const typedResult: CanTransferFromData = {
      statusCode: status,
      reasonCode: bytes32ToString(result[1]),
    };
    return typedResult;
  };

  /**
   * Validates if can transfer from
   * @return statusCode, reasonCode
   */
  public canTransferFrom = async (params: CanTransferFromParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const result = await (await this.contract).canTransferFrom.callAsync(
      params.from,
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
    );
    const status = this.getTransferStatusCode(result[0]);
    const typedResult: CanTransferFromData = {
      statusCode: status,
      reasonCode: bytes32ToString(result[1]),
    };
    return typedResult;
  };

  /**
   * Validates if can transfer with partition
   * @return statusCode, reasonCode, partition
   */
  public canTransferByPartition = async (params: CanTransferByPartitionParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const result = await (await this.contract).canTransferByPartition.callAsync(
      params.from,
      params.to,
      stringToBytes32(params.partition),
      valueToWei(params.value, await this.decimals()),
      params.data,
    );
    const status = this.getTransferStatusCode(result[0]);
    const typedResult: CanTransferByPartitionData = {
      statusCode: status,
      reasonCode: bytes32ToString(result[1]),
      partition: parsePartitionBytes32Value(result[2]),
    };
    return typedResult;
  };

  public setDocument = async (params: SetDocumentParams) => {
    assert.assert(params.name.length > 0, 'Bad name, cannot be empty');
    assert.assert(params.uri.length > 0, 'Bad uri, cannot be empty');
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).setDocument.sendTransactionAsync(
      stringToBytes32(params.name),
      params.uri,
      stringToBytes32(params.documentHash),
      params.txData,
      params.safetyFactor,
    );
  };

  public removeDocument = async (params: DocumentParams) => {
    await this.checkOnlyOwner(params.txData);
    const document = await this.getDocument({ name: params.name });
    assert.assert(document.documentUri.length !== 0, 'Document does not exist');
    return (await this.contract).removeDocument.sendTransactionAsync(
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * @return Returns the data associated to a module
   */
  public getDocument = async (params: DocumentParams) => {
    const result = await (await this.contract).getDocument.callAsync(stringToBytes32(params.name));
    const typedResult: DocumentData = {
      documentUri: result[0],
      documentHash: bytes32ToString(result[1]),
      documentTime: bigNumberToDate(result[2]),
    };
    return typedResult;
  };

  public getAllDocuments = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllDocuments.callAsync());
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: SecurityTokenSubscribeAsyncParams = async <ArgsType extends SecurityTokenEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ISecurityToken.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetSecurityTokenLogsAsyncParams = async <ArgsType extends SecurityTokenEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      ISecurityToken.abi,
    );
    return logs;
  };

  private checkModuleExists = async (moduleAddress: string) => {
    assert.assert((await this.getModule({ moduleAddress })).name !== '', 'Module does not exist');
  };

  private checkIsArchived = async (moduleAddress: string) => {
    assert.assert((await this.getModule({ moduleAddress })).archived, 'Module is not yet archived');
  };

  private checkIsNotArchived = async (moduleAddress: string) => {
    assert.assert(!(await this.getModule({ moduleAddress })).archived, 'Module is archived');
  };

  private checkModuleStructAddressIsNotZero = async (moduleAddress: string) => {
    assert.isNonZeroETHAddressHex('address', (await this.getModule({ moduleAddress })).address);
  };

  private checkModuleStructAddressIsEmpty = async (moduleAddress: string) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(
        (await this.getModule({ moduleAddress })).address,
        '0x0000000000000000000000000000000000000000',
      ),
      'Module already exists at that address',
    );
  };

  private checkIsControllable = async () => {
    assert.assert(await this.isControllable(), 'Controller currently disabled');
  };

  private checkBalanceFromGreaterThanValue = async (from: string, value: BigNumber) => {
    assert.assert(
      (await this.balanceOf({ owner: from })).isGreaterThanOrEqualTo(value),
      'Insufficient balance for inputted value',
    );
  };

  private checkModuleCostBelowMaxCost = async (moduleFactory: string, maxCost: BigNumber) => {
    const moduleCost = await (await this.moduleFactoryContract(moduleFactory)).setupCostInPoly.callAsync();
    assert.assert(
      maxCost.isGreaterThanOrEqualTo(moduleCost),
      'Insufficient max cost to cover module factory setup cost',
    );
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(await this.address());
    assert.assert(
      polyTokenBalance.isGreaterThanOrEqualTo(moduleCost),
      'Insufficient poly token balance for module cost',
    );
  };

  private checkOnlyOwner = async (txData: Partial<TxData> | undefined) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(txData)),
      'Msg sender must be owner',
    );
  };

  private checkMsgSenderIsController = async (txData: Partial<TxData> | undefined) => {
    assert.assert(
      (await this.isControllable()) && (await this.controller()) === (await this.getCallerAddress(txData)),
      'Msg sender must be controller',
    );
  };

  private checkUseModuleVerified = async (address: string) => {
    if (await (await this.featureRegistryContract()).getFeatureStatus.callAsync(Feature.CustomModulesAllowed)) {
      const isOwner = (await (await this.moduleFactoryContract(address)).owner.callAsync()) === (await this.owner());
      assert.assert(
        (await this.checkForRegisteredModule(address)) || isOwner,
        'ModuleFactory must be verified or SecurityToken owner must be ModuleFactory owner',
      );
    } else {
      assert.assert(await this.checkForRegisteredModule(address), 'ModuleFactory must be verified');
    }
    assert.assert(await this.isCompatibleModule(address), 'Version should within the compatible range of ST');
  };

  private checkForRegisteredModule = async (moduleAddress: string) => {
    const moduleRegistry = await this.moduleRegistryContract();
    const allModulesTypes = [
      await moduleRegistry.getModulesByType.callAsync(ModuleType.PermissionManager),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.STO),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.Burn),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.Dividends),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.TransferManager),
    ];
    const allModules = await Promise.all(
      allModulesTypes.map(myPromise => {
        return myPromise.includes(moduleAddress);
      }),
    );
    return allModules.includes(true);
  };

  private isCompatibleModule = async (address: string) => {
    const versions = await this.getVersion();
    const upperSTVersionBounds = (await (await this.moduleFactoryContract(
      address,
    )).getUpperSTVersionBounds.callAsync()).map(v => new BigNumber(v));
    const lowerSTVersionBounds = (await (await this.moduleFactoryContract(
      address,
    )).getLowerSTVersionBounds.callAsync()).map(v => new BigNumber(v));
    const skipUpperVersionBound = upperSTVersionBounds.every(v => v.isZero());
    const skipLowerVersionBound = lowerSTVersionBounds.every(v => v.isZero());
    let isCompatible = true;
    for (let i = 0; i < 3; i += 1) {
      isCompatible =
        isCompatible &&
        (skipLowerVersionBound || lowerSTVersionBounds[i].isLessThanOrEqualTo(versions[i])) &&
        (skipUpperVersionBound || upperSTVersionBounds[i].isGreaterThanOrEqualTo(versions[i]));
    }
    return isCompatible;
  };

  private cappedSTOAssertions = async (data: CappedSTOData) => {
    assert.isBigNumberGreaterThanZero(data.rate, 'Rate of token should be greater than 0');
    assert.isNonZeroETHAddressHex('Funds Receiver', data.fundsReceiver);
    assert.isFutureDate(data.startTime, 'Start time date not valid');
    assert.assert(data.endTime > data.startTime, 'End time not valid');
    assert.isBigNumberGreaterThanZero(data.cap, 'Cap should be greater than 0');
  };

  private usdTieredSTOAssertions = async (data: USDTieredSTOData) => {
    assert.isFutureDate(data.startTime, 'Start time date not valid');
    assert.assert(data.endTime > data.startTime, 'End time not valid');
    assert.assert(data.tokensPerTierTotal.length > 0, 'No tiers provided');
    assert.areValidArrayLengths(
      [data.ratePerTier, data.tokensPerTierTotal, data.ratePerTierDiscountPoly, data.tokensPerTierDiscountPoly],
      'Tier data length mismatch',
    );
    for (let i = 0; i < data.ratePerTier.length; i += 1) {
      assert.isBigNumberGreaterThanZero(data.ratePerTier[i], 'Rate per tier should be greater than 0');
      assert.isBigNumberGreaterThanZero(data.tokensPerTierTotal[i], 'Invalid token amount');
      assert.assert(
        data.tokensPerTierDiscountPoly[i].isLessThanOrEqualTo(data.tokensPerTierTotal[i]),
        'Too many discounted tokens',
      );
      assert.assert(data.ratePerTierDiscountPoly[i].isLessThanOrEqualTo(data.ratePerTier[i]), 'Invalid discount');
    }
    assert.assert(data.fundRaiseTypes.length > 0 && data.fundRaiseTypes.length <= 3, 'Raise type is not specified');
    assert.isNonZeroETHAddressHex('Wallet', data.wallet);
    assert.isNonZeroETHAddressHex('ReserveWallet', data.treasuryWallet);
  };

  private async addModuleRequirementsAndGetData(params: AddModuleParams): Promise<ProduceAddModuleInformation> {
    const maxCost = params.maxCost === undefined ? BIG_NUMBER_ZERO : valueToWei(params.maxCost, FULL_DECIMALS);
    const budget = params.budget === undefined ? BIG_NUMBER_ZERO : valueToWei(params.budget, FULL_DECIMALS);
    assert.isETHAddressHex('address', params.address);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleCostBelowMaxCost(params.address, maxCost);
    await this.checkModuleStructAddressIsEmpty(params.address);
    await this.checkUseModuleVerified(params.address);
    const decimals = await this.decimals();
    let iface: ethers.utils.Interface;
    let data: string;
    switch (params.moduleName) {
      case ModuleName.CountTransferManager:
        iface = new ethers.utils.Interface(CountTransferManager.abi);
        data = iface.functions.configure.encode([(params.data as CountTransferManagerData).maxHolderCount]);
        break;
      case ModuleName.PercentageTransferManager:
        iface = new ethers.utils.Interface(PercentageTransferManager.abi);
        data = iface.functions.configure.encode([
          valueToWei(
            (params.data as PercentageTransferManagerData).maxHolderPercentage,
            PERCENTAGE_DECIMALS,
          ).toString(),
          (params.data as PercentageTransferManagerData).allowPrimaryIssuance,
        ]);
        break;
      case ModuleName.CappedSTO:
        await this.cappedSTOAssertions(params.data as CappedSTOData);
        iface = new ethers.utils.Interface(CappedSTO.abi);
        data = iface.functions.configure.encode([
          dateToBigNumber((params.data as CappedSTOData).startTime).toNumber(),
          dateToBigNumber((params.data as CappedSTOData).endTime).toNumber(),
          valueToWei((params.data as CappedSTOData).cap, decimals).toString(),
          valueToWei((params.data as CappedSTOData).rate, FULL_DECIMALS).toString(),
          [(params.data as CappedSTOData).fundRaiseType], // the module's configure function expects an array
          (params.data as CappedSTOData).fundsReceiver,
        ]);
        break;
      case ModuleName.UsdTieredSTO:
        await this.usdTieredSTOAssertions(params.data as USDTieredSTOData);
        iface = new ethers.utils.Interface(USDTieredSTO.abi);
        data = iface.functions.configure.encode([
          dateToBigNumber((params.data as USDTieredSTOData).startTime).toNumber(),
          dateToBigNumber((params.data as USDTieredSTOData).endTime).toNumber(),
          (params.data as USDTieredSTOData).ratePerTier.map(e => {
            return valueToWei(e, FULL_DECIMALS).toString();
          }),
          (params.data as USDTieredSTOData).ratePerTierDiscountPoly.map(e => {
            return valueToWei(e, FULL_DECIMALS).toString();
          }),
          (params.data as USDTieredSTOData).tokensPerTierTotal.map(e => {
            return valueToWei(e, decimals).toString();
          }),
          (params.data as USDTieredSTOData).tokensPerTierDiscountPoly.map(e => {
            return valueToWei(e, decimals).toString();
          }),
          valueToWei((params.data as USDTieredSTOData).nonAccreditedLimitUSD, FULL_DECIMALS).toString(),
          valueToWei((params.data as USDTieredSTOData).minimumInvestmentUSD, FULL_DECIMALS).toString(),
          (params.data as USDTieredSTOData).fundRaiseTypes,
          (params.data as USDTieredSTOData).wallet,
          (params.data as USDTieredSTOData).treasuryWallet,
          (params.data as USDTieredSTOData).usdTokens,
        ]);
        break;
      case ModuleName.ERC20DividendCheckpoint:
        assert.isNonZeroETHAddressHex('Wallet', (params.data as DividendCheckpointData).wallet);
        iface = new ethers.utils.Interface(ERC20DividendCheckpoint.abi);
        data = iface.functions.configure.encode([(params.data as DividendCheckpointData).wallet]);
        break;
      case ModuleName.EtherDividendCheckpoint:
        assert.isNonZeroETHAddressHex('Wallet', (params.data as DividendCheckpointData).wallet);
        iface = new ethers.utils.Interface(EtherDividendCheckpoint.abi);
        data = iface.functions.configure.encode([(params.data as DividendCheckpointData).wallet]);
        break;
      default:
        data = NO_MODULE_DATA;
        break;
    }
    return { maxCost, budget, data };
  }
}
