import {
  PolyTokenEventArgs,
  PolyTokenEvents,
  CappedSTOFactoryEventArgs,
  CappedSTOEventArgs,
  ERC20DetailedEventArgs,
  ERC20DetailedEvents,
  ERC20DividendCheckpointEventArgs,
  EtherDividendCheckpointEventArgs,
  FeatureRegistryEventArgs,
  GeneralTransferManagerEventArgs,
  ManualApprovalTransferManagerEventArgs,
  ModuleFactoryEventArgs,
  ModuleRegistryEventArgs,
  PolyTokenFaucetEventArgs,
  PolymathRegistryEventArgs,
  SecurityTokenRegistryEventArgs,
  SecurityTokenEventArgs,
  USDTieredSTOFactoryEventArgs,
  USDTieredSTOEventArgs,
  CappedSTOFactoryEvents,
  CappedSTOEvents,
  ERC20DividendCheckpointEvents,
  EtherDividendCheckpointEvents,
  FeatureRegistryEvents,
  GeneralTransferManagerEvents,
  ManualApprovalTransferManagerEvents,
  ModuleFactoryEvents,
  ModuleRegistryEvents,
  PolyTokenFaucetEvents,
  PolymathRegistryEvents,
  SecurityTokenRegistryEvents,
  ISecurityTokenRegistryEvents,
  SecurityTokenEvents,
  USDTieredSTOFactoryEvents,
  USDTieredSTOEvents,
  GeneralPermissionManagerEventArgs,
  GeneralPermissionManagerEvents,
  ModuleContract,
  GeneralPermissionManagerContract,
  GeneralTransferManagerContract,
  CappedSTOContract,
  USDTieredSTOContract,
  ERC20DividendCheckpointContract,
  STOContract,
  STOEvents,
  STOEventArgs,
  ERC20DetailedContract,
  PolyTokenContract,
  ISecurityTokenContract,
  EtherDividendCheckpointContract,
  ManualApprovalTransferManagerContract,
  CountTransferManagerContract,
  CountTransferManagerEventArgs,
  CountTransferManagerEvents,
  PercentageTransferManagerContract,
  PercentageTransferManagerEventArgs,
  PercentageTransferManagerEvents,
  VolumeRestrictionTMContract,
  VolumeRestrictionTMEvents,
  VolumeRestrictionTMEventArgs,
  PolyTokenFaucetContract,
  TxData,
  BigNumber,
  ContractEventArg,
  DecodedLogArgs,
  LogWithDecodedArgs,
  BlockParam,
} from '@polymathnetwork/abi-wrappers';

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
}

export enum FundRaiseType {
  ETH = 0,
  POLY = 1,
  StableCoin = 2,
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
  tickerRegFee,
  stLaunchFee,
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
  VolumeRestrictionTM = 'VolumeRestrictionTM',
  CappedSTO = 'CappedSTO',
  UsdTieredSTO = 'USDTieredSTO',
  ERC20DividendCheckpoint = 'ERC20DividendCheckpoint',
  EtherDividendCheckpoint = 'EtherDividendCheckpoint',
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

export type ContractEventArgs =
  | PolyTokenEventArgs
  | CappedSTOFactoryEventArgs
  | CappedSTOEventArgs
  | ERC20DetailedEventArgs
  | ERC20DividendCheckpointEventArgs
  | EtherDividendCheckpointEventArgs
  | FeatureRegistryEventArgs
  | GeneralPermissionManagerEventArgs
  | GeneralTransferManagerEventArgs
  | ManualApprovalTransferManagerEventArgs
  | ModuleFactoryEventArgs
  | ModuleRegistryEventArgs
  | PolyTokenFaucetEventArgs
  | PolymathRegistryEventArgs
  | SecurityTokenRegistryEventArgs
  | SecurityTokenEventArgs
  | USDTieredSTOFactoryEventArgs
  | USDTieredSTOEventArgs
  | STOEventArgs
  | CountTransferManagerEventArgs
  | PercentageTransferManagerEventArgs
  | VolumeRestrictionTMEventArgs;

export type ContractEvents =
  | PolyTokenEvents
  | CappedSTOFactoryEvents
  | CappedSTOEvents
  | ERC20DetailedEvents
  | ERC20DividendCheckpointEvents
  | EtherDividendCheckpointEvents
  | FeatureRegistryEvents
  | GeneralPermissionManagerEvents
  | GeneralTransferManagerEvents
  | ManualApprovalTransferManagerEvents
  | ModuleFactoryEvents
  | ModuleRegistryEvents
  | PolyTokenFaucetEvents
  | PolymathRegistryEvents
  | SecurityTokenRegistryEvents
  | ISecurityTokenRegistryEvents
  | SecurityTokenEvents
  | USDTieredSTOFactoryEvents
  | USDTieredSTOEvents
  | STOEvents
  | CountTransferManagerEvents
  | PercentageTransferManagerEvents
  | VolumeRestrictionTMEvents;

/**
 * @param eventName           The contract event you would like to subscribe to.
 * @param blockRange          Block range to get logs from.
 * @param indexFilterValues   An object where the keys are indexed args returned by the event and
 *                            the value is the value you are interested in.
 */
export interface GetLogsAsyncParams {
  eventName: ContractEvents;
  blockRange: BlockRange;
  indexFilterValues: IndexedFilterValues;
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

export type ERC20Contract =
  | ERC20DetailedContract
  | ISecurityTokenContract
  | PolyTokenContract
  | PolyTokenFaucetContract;

export type GenericModuleContract =
  | ModuleContract
  | GeneralPermissionManagerContract
  | GeneralTransferManagerContract
  | STOBaseContract
  | DividendCheckpointBaseContract
  | ManualApprovalTransferManagerContract
  | CountTransferManagerContract
  | PercentageTransferManagerContract
  | VolumeRestrictionTMContract;

export type STOBaseContract = STOContract | CappedSTOContract | USDTieredSTOContract;

export type DividendCheckpointBaseContract = ERC20DividendCheckpointContract | EtherDividendCheckpointContract;

export const PERCENTAGE_DECIMALS = new BigNumber(16);
export const FULL_DECIMALS = new BigNumber(18);
