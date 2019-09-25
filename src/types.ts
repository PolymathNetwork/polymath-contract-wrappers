import {
  PolyTokenEventArgs_3_0_0,
  PolyTokenEvents_3_0_0,
  CappedSTOFactoryEventArgs_3_0_0,
  CappedSTOEventArgs_3_0_0,
  ERC20DetailedEventArgs_3_0_0,
  ERC20DetailedEvents_3_0_0,
  ERC20DividendCheckpointEventArgs_3_0_0,
  EtherDividendCheckpointEventArgs_3_0_0,
  FeatureRegistryEventArgs_3_0_0,
  GeneralTransferManagerEventArgs_3_0_0,
  ManualApprovalTransferManagerEventArgs_3_0_0,
  ModuleFactoryEventArgs_3_0_0,
  ModuleRegistryEventArgs_3_0_0,
  PolyTokenFaucetEventArgs_3_0_0,
  PolymathRegistryEventArgs_3_0_0,
  USDTieredSTOFactoryEventArgs_3_0_0,
  USDTieredSTOEventArgs_3_0_0,
  CappedSTOFactoryEvents_3_0_0,
  CappedSTOEvents_3_0_0,
  ERC20DividendCheckpointEvents_3_0_0,
  EtherDividendCheckpointEvents_3_0_0,
  FeatureRegistryEvents_3_0_0,
  GeneralTransferManagerEvents_3_0_0,
  ManualApprovalTransferManagerEvents_3_0_0,
  ModuleFactoryEvents_3_0_0,
  ModuleRegistryEvents_3_0_0,
  PolyTokenFaucetEvents_3_0_0,
  PolymathRegistryEvents_3_0_0,
  ISecurityTokenRegistryEvents_3_0_0,
  USDTieredSTOFactoryEvents_3_0_0,
  USDTieredSTOEvents_3_0_0,
  GeneralPermissionManagerEventArgs_3_0_0,
  GeneralPermissionManagerEvents_3_0_0,
  ModuleContract_3_0_0,
  GeneralPermissionManagerContract_3_0_0,
  GeneralTransferManagerContract_3_0_0,
  CappedSTOContract_3_0_0,
  USDTieredSTOContract_3_0_0,
  ERC20DividendCheckpointContract_3_0_0,
  ERC20DetailedContract_3_0_0,
  PolyTokenContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  EtherDividendCheckpointContract_3_0_0,
  ManualApprovalTransferManagerContract_3_0_0,
  CountTransferManagerContract_3_0_0,
  CountTransferManagerEventArgs_3_0_0,
  CountTransferManagerEvents_3_0_0,
  PercentageTransferManagerContract_3_0_0,
  PercentageTransferManagerEventArgs_3_0_0,
  PercentageTransferManagerEvents_3_0_0,
  VolumeRestrictionTMContract_3_0_0,
  VolumeRestrictionTMEvents_3_0_0,
  VolumeRestrictionTMEventArgs_3_0_0,
  VestingEscrowWalletEventArgs_3_0_0,
  VestingEscrowWalletContract_3_0_0,
  VestingEscrowWalletEvents_3_0_0,
  LockUpTransferManagerEventArgs_3_0_0,
  LockUpTransferManagerContract_3_0_0,
  LockUpTransferManagerEvents_3_0_0,
  BlacklistTransferManagerEventArgs_3_0_0,
  BlacklistTransferManagerContract_3_0_0,
  BlacklistTransferManagerEvents_3_0_0,
  PolyTokenFaucetContract_3_0_0,
  TxData,
  BigNumber,
  ContractEventArg,
  DecodedLogArgs,
  LogWithDecodedArgs,
  BlockParam,
  ISecurityTokenEvents_3_0_0,
  ISecurityTokenEventArgs_3_0_0,
  ISecurityTokenRegistryEventArgs_3_0_0,
  CappedSTOContract_3_1_0,
  USDTieredSTOContract_3_1_0,
  GeneralTransferManagerContract_3_1_0,
  GeneralPermissionManagerContract_3_1_0,
  VestingEscrowWalletContract_3_1_0,
  RestrictedPartialSaleTMContract_3_1_0,
  RestrictedPartialSaleTMEvents_3_1_0,
  RestrictedPartialSaleTMEventArgs_3_1_0,
  GeneralTransferManagerEventArgs_3_1_0,
  CappedSTOEventArgs_3_1_0,
  USDTieredSTOEventArgs_3_1_0,
  GeneralPermissionManagerEventArgs_3_1_0,
  GeneralTransferManagerEvents_3_1_0,
  GeneralPermissionManagerEvents_3_1_0,
  VestingEscrowWalletEvents_3_1_0,
  VestingEscrowWalletEventArgs_3_1_0,
  CappedSTOEvents_3_1_0,
  USDTieredSTOEvents_3_1_0,
} from '@polymathnetwork/abi-wrappers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * @param txData Data to override default values on tx, i.e. 'from', 'gasPrice'
 * @param safetyFactor Factor to use for gas limit estimation
 */
export interface TxParams {
  txData?: Partial<TxData>;
  safetyFactor?: number;
}

export enum NetworkId {
  Mainnet = 1,
  Kovan = 42,
  Local = 15,
}

export enum ModuleType {
  PermissionManager = 1,
  TransferManager = 2,
  STO = 3,
  Dividends = 4,
  Burn = 5,
  Wallet = 7,
}

export enum TransferType {
  General,
  Issuance,
  Redemption,
}

export enum FundRaiseType {
  ETH = 0,
  POLY = 1,
  StableCoin = 2,
}

export enum CappedSTOFundRaiseType {
  ETH = 0,
  POLY = 1,
}

export enum FlagsType {
  IsAccredited,
  CanNotBuyFromSto,
  IsVolRestricted,
}

export enum TransferResult {
  INVALID,
  NA,
  VALID,
  FORCE_VALID,
}

export enum FeeType {
  TickerRegFee = 'tickerRegFee',
  StLaunchFee = 'stLaunchFee',
}

export enum Feature {
  CustomModulesAllowed = 'customModulesAllowed',
  FreezeMintingAllowed = 'freezeMintingAllowed',
}

export enum Partition {
  Unlocked = 'UNLOCKED',
  Locked = 'LOCKED',
  Undefined = 'UNDEFINED',
}

export enum BoundType {
  LowerBound = 'lowerBound',
  UpperBound = 'upperBound',
}

export enum PolymathContract {
  PolyToken = 'PolyToken',
  ModuleRegistry = 'ModuleRegistry',
  FeatureRegistry = 'FeatureRegistry',
  SecurityTokenRegistry = 'SecurityTokenRegistry',
  PolyUsdOracle = 'PolyUsdOracle',
  EthUsdOracle = 'EthUsdOracle',
}

export enum ModuleName {
  GeneralPermissionManager = 'GeneralPermissionManager',
  CountTransferManager = 'CountTransferManager',
  GeneralTransferManager = 'GeneralTransferManager',
  ManualApprovalTransferManager = 'ManualApprovalTransferManager',
  PercentageTransferManager = 'PercentageTransferManager',
  LockUpTransferManager = 'LockUpTransferManager',
  BlacklistTransferManager = 'BlacklistTransferManager',
  VolumeRestrictionTM = 'VolumeRestrictionTM',
  RestrictedPartialSaleTM = 'RestrictedPartialSaleTM',
  CappedSTO = 'CappedSTO',
  UsdTieredSTO = 'USDTieredSTO',
  ERC20DividendCheckpoint = 'ERC20DividendCheckpoint',
  EtherDividendCheckpoint = 'EtherDividendCheckpoint',
  VestingEscrowWallet = 'VestingEscrowWallet',
}

export enum TransferStatusCode {
  TransferFailure = '0x50',
  TransferSuccess = '0x51',
  InsufficientBalance = '0x52',
  InsufficientAllowance = '0x53',
  TransfersHalted = '0x54',
  FundsLocked = '0x55',
  InvalidSender = '0x56',
  InvalidReceiver = '0x57',
  InvalidOperator = '0x58',
}

export enum Perm {
  Admin = 'ADMIN',
  Operator = 'OPERATOR',
}

export enum RestrictionType {
  Fixed = 0,
  Percentage = 1,
}

export interface DecodedLogEvent<ArgsType extends DecodedLogArgs> {
  isRemoved: boolean;
  log: LogWithDecodedArgs<ArgsType>;
}

export type EventCallback<ArgsType extends DecodedLogArgs> = (
  err: null | Error,
  log?: DecodedLogEvent<ArgsType>,
) => void;

export interface IndexedFilterValues {
  [index: string]: ContractEventArg;
}

export interface BlockRange {
  fromBlock: BlockParam;
  toBlock: BlockParam;
}

export type ContractEventArgs_3_0_0 =
  | PolyTokenEventArgs_3_0_0
  | CappedSTOFactoryEventArgs_3_0_0
  | CappedSTOEventArgs_3_0_0
  | ERC20DetailedEventArgs_3_0_0
  | ERC20DividendCheckpointEventArgs_3_0_0
  | EtherDividendCheckpointEventArgs_3_0_0
  | FeatureRegistryEventArgs_3_0_0
  | GeneralPermissionManagerEventArgs_3_0_0
  | GeneralTransferManagerEventArgs_3_0_0
  | ManualApprovalTransferManagerEventArgs_3_0_0
  | ModuleFactoryEventArgs_3_0_0
  | ModuleRegistryEventArgs_3_0_0
  | PolyTokenFaucetEventArgs_3_0_0
  | PolymathRegistryEventArgs_3_0_0
  | USDTieredSTOFactoryEventArgs_3_0_0
  | USDTieredSTOEventArgs_3_0_0
  | ISecurityTokenEventArgs_3_0_0
  | ISecurityTokenRegistryEventArgs_3_0_0
  | CountTransferManagerEventArgs_3_0_0
  | PercentageTransferManagerEventArgs_3_0_0
  | LockUpTransferManagerEventArgs_3_0_0
  | VolumeRestrictionTMEventArgs_3_0_0
  | BlacklistTransferManagerEventArgs_3_0_0
  | VestingEscrowWalletEventArgs_3_0_0;

export type ContractEventArgs_3_1_0 =
  | GeneralTransferManagerEventArgs_3_1_0
  | RestrictedPartialSaleTMEventArgs_3_1_0
  | CappedSTOEventArgs_3_1_0
  | USDTieredSTOEventArgs_3_1_0
  | GeneralPermissionManagerEventArgs_3_1_0
  | VestingEscrowWalletEventArgs_3_1_0;

export type ContractEventArgs = ContractEventArgs_3_0_0 | ContractEventArgs_3_1_0;

export type ContractEvents_3_0_0 =
  | PolyTokenEvents_3_0_0
  | CappedSTOFactoryEvents_3_0_0
  | CappedSTOEvents_3_0_0
  | ERC20DetailedEvents_3_0_0
  | ERC20DividendCheckpointEvents_3_0_0
  | EtherDividendCheckpointEvents_3_0_0
  | FeatureRegistryEvents_3_0_0
  | GeneralPermissionManagerEvents_3_0_0
  | GeneralTransferManagerEvents_3_0_0
  | ManualApprovalTransferManagerEvents_3_0_0
  | ModuleFactoryEvents_3_0_0
  | ModuleRegistryEvents_3_0_0
  | PolyTokenFaucetEvents_3_0_0
  | PolymathRegistryEvents_3_0_0
  | ISecurityTokenRegistryEvents_3_0_0
  | ISecurityTokenEvents_3_0_0
  | USDTieredSTOFactoryEvents_3_0_0
  | USDTieredSTOEvents_3_0_0
  | CountTransferManagerEvents_3_0_0
  | PercentageTransferManagerEvents_3_0_0
  | VestingEscrowWalletEvents_3_0_0
  | LockUpTransferManagerEvents_3_0_0
  | BlacklistTransferManagerEvents_3_0_0
  | VolumeRestrictionTMEvents_3_0_0;

export type ContractEvents_3_1_0 =
  | GeneralTransferManagerEvents_3_1_0
  | RestrictedPartialSaleTMEvents_3_1_0
  | GeneralPermissionManagerEvents_3_1_0
  | VestingEscrowWalletEvents_3_1_0
  | CappedSTOEvents_3_1_0
  | USDTieredSTOEvents_3_1_0;

export type ContractEvents = ContractEvents_3_0_0 | ContractEvents_3_1_0;

/**
 * @param eventName           The contract event you would like to subscribe to.
 * @param blockRange          Block range to get logs from.
 * @param indexFilterValues   An object where the keys are indexed args returned by the event and
 *                            the value is the value you are interested in.
 */
export interface GetLogsAsyncParams {
  eventName: ContractEvents;
  blockRange?: BlockRange;
  indexFilterValues?: IndexedFilterValues;
}

/**
 * @param contractAddress     The hex encoded address where the contract is deployed.
 * @param eventName           The contract event you would like to subscribe to.
 * @param indexFilterValues   An object where the keys are indexed args returned by the event and
 *                            the value is the value you are interested in.
 * @param callback            Callback that gets called when a log is added/removed
 * @param isVerbose           Enable verbose subscription warnings (e.g recoverable network issues encountered)
 */
export interface SubscribeAsyncParams {
  eventName: ContractEvents;
  indexFilterValues: IndexedFilterValues;
  callback: EventCallback<ContractEventArg>;
  isVerbose?: boolean;
}

export interface GetLogs {
  (params: GetLogsAsyncParams): Promise<LogWithDecodedArgs<ContractEventArgs>[]>;
}

export interface Subscribe {
  (params: SubscribeAsyncParams): Promise<string>;
}

export type ERC20Contract_3_0_0 =
  | ERC20DetailedContract_3_0_0
  | ISecurityTokenContract_3_0_0
  | PolyTokenContract_3_0_0
  | PolyTokenFaucetContract_3_0_0;

export type ERC20Contract = ERC20Contract_3_0_0;

export type GenericModuleContract_3_0_0 =
  | ModuleContract_3_0_0
  | GeneralPermissionManagerContract_3_0_0
  | GeneralTransferManagerContract_3_0_0
  | STOBaseContract_3_0_0
  | DividendCheckpointBaseContract_3_0_0
  | ManualApprovalTransferManagerContract_3_0_0
  | CountTransferManagerContract_3_0_0
  | PercentageTransferManagerContract_3_0_0
  | VolumeRestrictionTMContract_3_0_0
  | VestingEscrowWalletContract_3_0_0
  | LockUpTransferManagerContract_3_0_0
  | BlacklistTransferManagerContract_3_0_0
  | VolumeRestrictionTMContract_3_0_0;

export type GenericModuleContract_3_1_0 =
  | STOBaseContract_3_1_0
  | GeneralTransferManagerContract_3_1_0
  | GeneralPermissionManagerContract_3_1_0
  | VestingEscrowWalletContract_3_1_0
  | RestrictedPartialSaleTMContract_3_1_0;

export type GenericModuleContract = GenericModuleContract_3_0_0 | GenericModuleContract_3_1_0;

export type STOBaseContract_3_0_0 = CappedSTOContract_3_0_0 | USDTieredSTOContract_3_0_0;

export type STOBaseContract_3_1_0 = CappedSTOContract_3_1_0 | USDTieredSTOContract_3_1_0;

export type STOBaseContract = STOBaseContract_3_0_0 | STOBaseContract_3_1_0;

export type DividendCheckpointBaseContract_3_0_0 =
  | ERC20DividendCheckpointContract_3_0_0
  | EtherDividendCheckpointContract_3_0_0;

export type DividendCheckpointBaseContract = DividendCheckpointBaseContract_3_0_0;

export const PERCENTAGE_DECIMALS = new BigNumber(16);
export const FULL_DECIMALS = new BigNumber(18);

export enum ErrorCode {
  Unauthorized = 'Unauthorized',
  InvalidAddress = 'InvalidAddress',
  InsufficientBalance = 'InsufficientBalance',
  InvalidSubscriptionToken = 'InvalidSubscriptionToken',
  DuplicatedStrings = 'DuplicatedStrings',
  TooLate = 'TooLate',
  TooEarly = 'TooEarly',
  InvalidData = 'InvalidData',
  MismatchedArrayLength = 'MismatchedArrayLength',
  InvalidVersion = 'InvalidVersion',
  InvalidPartition = 'InvalidPartition',
  ContractPaused = 'ContractPaused',
  PreconditionRequired = 'PreconditionRequired',
  AlreadyClaimed = 'AlreadyClaimed',
  AddressExcluded = 'AddressExcluded',
  InvalidDividend = 'InvalidDividend',
  InvalidCheckpoint = 'InvalidCheckpoint',
  ArrayTooLarge = 'ArrayTooLarge',
  InvalidBound = 'InvalidBound',
  InsufficientAllowance = 'InsufficientAllowance',
  DifferentMode = 'DifferentMode',
  InvalidTransfer = 'InvalidTransfer',
  InvalidDiscount = 'InvalidDiscount',
  STOClosed = 'STOClosed',
  CoinNotAllowed = 'CoinNotAllowed',
  AlreadyExists = 'AlreadyExists',
  NotFound = 'NotFound',
  TickerExpired = 'TickerExpired',
  UnknownNetwork = 'UnknownNetwork',
  UnsupportedVersion = 'UnsupportedVersion',
}

export enum ContractVersion {
  V3_0_0 = '3.0.0',
  V3_1_0 = '3.1.0',
}
