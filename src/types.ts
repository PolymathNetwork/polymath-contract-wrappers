import { TxData } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { ContractEventArg, DecodedLogArgs, LogWithDecodedArgs, BlockParam } from 'ethereum-types';
import {
  PolyTokenEventArgs,
  PolyTokenEvents,
  CappedSTOFactoryEventArgs,
  CappedSTOEventArgs,
  DetailedERC20EventArgs,
  DetailedERC20Events,
  AlternativeERC20EventArgs,
  AlternativeERC20Events,
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
  DetailedERC20Contract,
  PolyTokenContract,
  SecurityTokenContract,
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

export enum Features {
  CustomModulesAllowed = 'customModulesAllowed',
  FreezeMintingAllowed = 'freezeMintingAllowed',
}

export enum PolymathContracts {
  polyToken = 'PolyToken',
  moduleRegistry = 'ModuleRegistry',
  featureRegistry = 'FeatureRegistry',
  securityTokenRegistry = 'SecurityTokenRegistry',
  polyUsdOracle = 'PolyUsdOracle',
  ethUsdOracle = 'EthUsdOracle',
}

export enum ModuleName {
  generalPermissionManager = 'GeneralPermissionManager',
  countTransferManager = 'CountTransferManager',
  generalTransferManager = 'GeneralTransferManager',
  manualApprovalTransferManager = 'ManualApprovalTransferManager',
  percentageTransferManager = 'PercentageTransferManager',
  volumeRestrictionTM = 'VolumeRestrictionTM',
  cappedSTO = 'CappedSTO',
  usdTieredSTO = 'USDTieredSTO',
  erc20DividendCheckpoint = 'ERC20DividendCheckpoint',
  etherDividendCheckpoint = 'EtherDividendCheckpoint',
}

export enum Perms {
  ChangePermission = 'CHANGE_PERMISSION',
  Admin = 'ADMIN',
  Flags = 'FLAGS',
  Whitelist = 'WHITELIST',
  TransferApproval = 'TRANSFER_APPROVAL',
  Checkpoint = 'CHECKPOINT',
  Manage = 'MANAGE',
  Distribute = 'DISTRIBUTE',
  FeeAdmin = 'FEE_ADMIN',
  PreSaleAdmin = 'PRE_SALE_ADMIN',
}

export enum RestrictionTypes {
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
  | DetailedERC20EventArgs
  | AlternativeERC20EventArgs
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
  | DetailedERC20Events
  | AlternativeERC20Events
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

export type ERC20Contract = DetailedERC20Contract | SecurityTokenContract | PolyTokenContract | PolyTokenFaucetContract;

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
