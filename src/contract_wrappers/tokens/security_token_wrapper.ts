import {
  SecurityTokenContract,
  SecurityTokenEventArgs,
  SecurityTokenEvents,
  SecurityTokenApprovalEventArgs,
  SecurityTokenTransferEventArgs,
  SecurityTokenModuleAddedEventArgs,
  SecurityTokenUpdateTokenDetailsEventArgs,
  SecurityTokenGranularityChangedEventArgs,
  SecurityTokenModuleArchivedEventArgs,
  SecurityTokenModuleUnarchivedEventArgs,
  SecurityTokenModuleRemovedEventArgs,
  SecurityTokenModuleBudgetChangedEventArgs,
  SecurityTokenFreezeTransfersEventArgs,
  SecurityTokenCheckpointCreatedEventArgs,
  SecurityTokenFreezeMintingEventArgs,
  SecurityTokenMintedEventArgs,
  SecurityTokenBurntEventArgs,
  SecurityTokenSetControllerEventArgs,
  SecurityTokenForceTransferEventArgs,
  SecurityTokenForceBurnEventArgs,
  SecurityTokenDisableControllerEventArgs,
  SecurityTokenOwnershipRenouncedEventArgs,
  SecurityTokenOwnershipTransferredEventArgs,
  FeatureRegistryContract,
  ModuleFactoryContract,
  PolyTokenContract,
  ModuleRegistryContract,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import {
  SecurityToken,
  CountTransferManager,
  ERC20DividendCheckpoint,
  CappedSTO,
  USDTieredSTO,
  PercentageTransferManager,
  EtherDividendCheckpoint,
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper, TxData } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { ethers } from 'ethers';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ERC20TokenWrapper from './erc20_wrapper';
import ContractFactory from '../../factories/contractFactory';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  GetLogs,
  Subscribe,
  ModuleType,
  FundRaiseType,
  ModuleName,
  Features,
} from '../../types';
import { stringToBytes32, numberToBigNumber, dateToBigNumber, bytes32ToString } from '../../utils/convert';

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

interface UpdateTokenDetailsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails;
  callback: EventCallback<SecurityTokenUpdateTokenDetailsEventArgs>;
}

interface GetUpdateTokenDetailsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails;
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

interface FreezeMintingSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeMinting;
  callback: EventCallback<SecurityTokenFreezeMintingEventArgs>;
}

interface GetFreezeMintingLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeMinting;
}

interface MintedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Minted;
  callback: EventCallback<SecurityTokenMintedEventArgs>;
}

interface GetMintedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Minted;
}

interface BurntSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.Burnt;
  callback: EventCallback<SecurityTokenBurntEventArgs>;
}

interface GetBurntLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.Burnt;
}

interface SetControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.SetController;
  callback: EventCallback<SecurityTokenSetControllerEventArgs>;
}

interface GetSetControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.SetController;
}

interface ForceTransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ForceTransfer;
  callback: EventCallback<SecurityTokenForceTransferEventArgs>;
}

interface GetForceTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ForceTransfer;
}

interface ForceBurnSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.ForceBurn;
  callback: EventCallback<SecurityTokenForceBurnEventArgs>;
}

interface GetForceBurnLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.ForceBurn;
}

interface DisableControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.DisableController;
  callback: EventCallback<SecurityTokenDisableControllerEventArgs>;
}

interface GetDisableControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.DisableController;
}

interface OwnershipRenouncedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipRenounced;
  callback: EventCallback<SecurityTokenOwnershipRenouncedEventArgs>;
}

interface GetOwnershipRenouncedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipRenounced;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred;
  callback: EventCallback<SecurityTokenOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred;
}

interface SecurityTokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
  (params: ModuleAddedSubscribeAsyncParams): Promise<string>;
  (params: UpdateTokenDetailsSubscribeAsyncParams): Promise<string>;
  (params: GranularityChangedSubscribeAsyncParams): Promise<string>;
  (params: ModuleArchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUnarchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleRemovedSubscribeAsyncParams): Promise<string>;
  (params: ModuleBudgetChangedSubscribeAsyncParams): Promise<string>;
  (params: FreezeTransfersSubscribeAsyncParams): Promise<string>;
  (params: CheckpointCreatedSubscribeAsyncParams): Promise<string>;
  (params: FreezeMintingSubscribeAsyncParams): Promise<string>;
  (params: MintedSubscribeAsyncParams): Promise<string>;
  (params: BurntSubscribeAsyncParams): Promise<string>;
  (params: SetControllerSubscribeAsyncParams): Promise<string>;
  (params: ForceTransferSubscribeAsyncParams): Promise<string>;
  (params: ForceBurnSubscribeAsyncParams): Promise<string>;
  (params: DisableControllerSubscribeAsyncParams): Promise<string>;
  (params: OwnershipRenouncedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetSecurityTokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenApprovalEventArgs>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenTransferEventArgs>[]>;
  (params: GetModuleAddedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleAddedEventArgs>[]>;
  (params: GetUpdateTokenDetailsLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenUpdateTokenDetailsEventArgs>[]
  >;
  (params: GetGranularityChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenGranularityChangedEventArgs>[]
  >;
  (params: GetModuleArchivedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleArchivedEventArgs>[]>;
  (params: GetModuleUnarchivedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleUnarchivedEventArgs>[]>;
  (params: GetModuleRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleRemovedEventArgs>[]>;
  (params: GetModuleBudgetChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenModuleBudgetChangedEventArgs>[]
  >;
  (params: GetFreezeTransfersLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>[]>;
  (params: GetCheckpointCreatedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenCheckpointCreatedEventArgs>[]>;
  (params: GetFreezeMintingLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenFreezeMintingEventArgs>[]>;
  (params: GetMintedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenMintedEventArgs>[]>;
  (params: GetBurntLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenBurntEventArgs>[]>;
  (params: GetSetControllerLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenSetControllerEventArgs>[]>;
  (params: GetForceTransferLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenForceTransferEventArgs>[]>;
  (params: GetForceBurnLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenForceBurnEventArgs>[]>;
  (params: GetDisableControllerLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenDisableControllerEventArgs>[]>;
  (params: GetOwnershipRenouncedLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenOwnershipRenouncedEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<SecurityTokenOwnershipTransferredEventArgs>[]
  >;
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
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
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

interface CheckpointIdParams {
  checkpointId: number;
}

interface IterateInvestorsParams {
  start: Date;
  end: Date;
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

interface MintParams extends TxParams {
  investor: string;
  value: BigNumber;
}

interface MintWithDataParams extends MintParams {
  data: string;
}

interface MintMultiParams extends TxParams {
  investors: string[];
  values: BigNumber[];
}

interface CheckPermissionParams {
  delegateAddress: string;
  moduleAddress: string;
  permission: string;
}

interface BurnWithDataParams extends TxParams {
  value: BigNumber;
  data: string;
}

interface BurnFromWithDataParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
}

interface BalanceOfAtParams {
  investor: string;
  checkpointId: number;
}

interface SetControllerParams extends TxParams {
  controller: string;
}

interface ForceTransferParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
  log: string;
}

interface ForceBurnParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
  log: string;
}

interface AddModuleParams extends TxParams {
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
  moduleName: ModuleName.USDTieredSTO;
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
  fundRaiseTypes: FundRaiseType[];
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
  reserveWallet: string;
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
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export default class SecurityTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = SecurityToken.abi;

  protected contract: Promise<SecurityTokenContract>;

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
    contract: Promise<SecurityTokenContract>,
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

  public decreaseApproval = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).decreaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public polyToken = async () => {
    return (await this.contract).polyToken.callAsync();
  };

  public renounceOwnership = async (params: TxParams) => {
    return (await this.contract).renounceOwnership.sendTransactionAsync(params.txData, params.safetyFactor);
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

  public mintingFrozen = async () => {
    return (await this.contract).mintingFrozen.callAsync();
  };

  public moduleRegistry = async () => {
    return (await this.contract).moduleRegistry.callAsync();
  };

  public featureRegistry = async () => {
    return (await this.contract).featureRegistry.callAsync();
  };

  public securityTokenRegistry = async () => {
    return (await this.contract).securityTokenRegistry.callAsync();
  };

  public tokenDetails = async () => {
    return (await this.contract).tokenDetails.callAsync();
  };

  public increaseApproval = async (params: ChangeApprovalParams) => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).increaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
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
      params.value,
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
      params.change,
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

  public getInvestors = async () => {
    return (await this.contract).getInvestors.callAsync();
  };

  public getInvestorsAt = async (params: CheckpointIdParams) => {
    return (await this.contract).getInvestorsAt.callAsync(numberToBigNumber(params.checkpointId));
  };

  public iterateInvestors = async (params: IterateInvestorsParams) => {
    return (await this.contract).iterateInvestors.callAsync(dateToBigNumber(params.start), dateToBigNumber(params.end));
  };

  public getInvestorCount = async () => {
    return (await this.contract).getInvestorCount.callAsync();
  };

  public freezeTransfers = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(!(await this.transfersFrozen()), 'Transfers already frozen');
    return (await this.contract).freezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unfreezeTransfers = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(!(await this.transfersFrozen()), 'Transfers are not frozen');
    return (await this.contract).unfreezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public transferWithData = async (params: TransferWithDataParams) => {
    assert.isNonZeroETHAddressHex('to', params.to);
    return (await this.contract).transferWithData.sendTransactionAsync(
      params.to,
      params.value,
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
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public freezeMinting = async (params: TxParams) => {
    assert.assert(
      await (await this.featureRegistryContract()).getFeatureStatus.callAsync(Features.FreezeMintingAllowed),
      'FreezeMintingAllowed Feature Status not enabled',
    );
    assert.assert(!(await this.mintingFrozen()), 'Minting already frozen');
    assert.assert(
      (await this.owner()) === (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      'Msg sender must be owner',
    );
    return (await this.contract).freezeMinting.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public mint = async (params: MintParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    await this.checkOnlyOwner(params.txData);
    assert.assert(!(await this.mintingFrozen()), 'Minting is frozen');
    return (await this.contract).mint.sendTransactionAsync(
      params.investor,
      params.value,
      params.txData,
      params.safetyFactor,
    );
  };

  public mintWithData = async (params: MintWithDataParams) => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    await this.checkOnlyOwner(params.txData);
    assert.assert(!(await this.mintingFrozen()), 'Minting is frozen');
    return (await this.contract).mintWithData.sendTransactionAsync(
      params.investor,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public mintMulti = async (params: MintMultiParams) => {
    params.investors.forEach(address => assert.isNonZeroETHAddressHex('investors', address));
    assert.assert(!(await this.mintingFrozen()), 'Minting is frozen');
    await this.checkOnlyOwner(params.txData);
    assert.assert(
      params.investors.length === params.values.length,
      'Number of investors passed in must be equivalent to number of values',
    );
    return (await this.contract).mintMulti.sendTransactionAsync(
      params.investors,
      params.values,
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

  public burnWithData = async (params: BurnWithDataParams) => {
    await this.checkBalanceFromGreaterThanValue((await this.web3Wrapper.getAvailableAddressesAsync())[0], params.value);
    return (await this.contract).burnWithData.sendTransactionAsync(
      params.value,
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  public burnFromWithData = async (params: BurnFromWithDataParams) => {
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);
    assert.assert(
      (await this.allowance({
        owner: params.from,
        spender: (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      })).isGreaterThanOrEqualTo(params.value),
      'Insufficient allowance for inputted burn value',
    );
    assert.isETHAddressHex('from', params.from);
    return (await this.contract).burnFromWithData.sendTransactionAsync(
      params.from,
      params.value,
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
    return (await this.contract).getCheckpointTimes.callAsync();
  };

  public totalSupplyAt = async (params: CheckpointIdParams) => {
    return (await this.contract).totalSupplyAt.callAsync(numberToBigNumber(params.checkpointId));
  };

  public balanceOfAt = async (params: BalanceOfAtParams) => {
    assert.isETHAddressHex('investor', params.investor);
    return (await this.contract).balanceOfAt.callAsync(params.investor, numberToBigNumber(params.checkpointId));
  };

  public setController = async (params: SetControllerParams) => {
    await this.checkOnlyOwner(params.txData);
    await this.checkControllerEnabled();
    assert.isETHAddressHex('controller', params.controller);
    return (await this.contract).setController.sendTransactionAsync(
      params.controller,
      params.txData,
      params.safetyFactor,
    );
  };

  public disableController = async (params: TxParams) => {
    await this.checkOnlyOwner(params.txData);
    await this.checkControllerEnabled();
    return (await this.contract).disableController.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public forceTransfer = async (params: ForceTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isNonZeroETHAddressHex('to', params.to);
    await this.checkMsgSenderIsController(params.txData);
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);

    return (await this.contract).forceTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.value,
      params.data,
      params.log,
      params.txData,
      params.safetyFactor,
    );
  };

  public forceBurn = async (params: ForceBurnParams) => {
    assert.isETHAddressHex('from', params.from);
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);
    await this.checkMsgSenderIsController(params.txData);
    return (await this.contract).forceBurn.sendTransactionAsync(
      params.from,
      params.value,
      params.data,
      params.log,
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

  public addModule: AddModuleInterface = async (params: AddModuleParams) => {
    const maxCost = params.maxCost === undefined ? BIG_NUMBER_ZERO : params.maxCost;
    const budget = params.budget === undefined ? BIG_NUMBER_ZERO : params.budget;
    assert.isETHAddressHex('address', params.address);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleCostBelowMaxCost(params.address, params.txData, maxCost);
    await this.checkModuleStructAddressIsEmpty(params.address);
    await this.checkUseModuleVerified(params.address);
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
          (params.data as PercentageTransferManagerData).maxHolderPercentage,
          (params.data as PercentageTransferManagerData).allowPrimaryIssuance,
        ]);
        break;
      case ModuleName.CappedSTO:
        iface = new ethers.utils.Interface(CappedSTO.abi);
        data = iface.functions.configure.encode([
          dateToBigNumber((params.data as CappedSTOData).startTime),
          dateToBigNumber((params.data as CappedSTOData).endTime),
          (params.data as CappedSTOData).cap,
          (params.data as CappedSTOData).rate,
          (params.data as CappedSTOData).fundRaiseTypes,
          (params.data as CappedSTOData).fundsReceiver,
        ]);
        break;
      case ModuleName.USDTieredSTO:
        iface = new ethers.utils.Interface(USDTieredSTO.abi);
        data = iface.functions.configure.encode([
          dateToBigNumber((params.data as USDTieredSTOData).startTime),
          dateToBigNumber((params.data as USDTieredSTOData).endTime),
          (params.data as USDTieredSTOData).ratePerTier,
          (params.data as USDTieredSTOData).ratePerTierDiscountPoly,
          (params.data as USDTieredSTOData).tokensPerTierTotal,
          (params.data as USDTieredSTOData).tokensPerTierDiscountPoly,
          (params.data as USDTieredSTOData).nonAccreditedLimitUSD,
          (params.data as USDTieredSTOData).minimumInvestmentUSD,
          (params.data as USDTieredSTOData).fundRaiseTypes,
          (params.data as USDTieredSTOData).wallet,
          (params.data as USDTieredSTOData).reserveWallet,
          (params.data as USDTieredSTOData).usdTokens,
        ]);
        break;
      case ModuleName.ERC20DividendCheckpoint:
        iface = new ethers.utils.Interface(ERC20DividendCheckpoint.abi);
        data = iface.functions.configure.encode([(params.data as DividendCheckpointData).wallet]);
        break;
      case ModuleName.EtherDividendCheckpoint:
        iface = new ethers.utils.Interface(EtherDividendCheckpoint.abi);
        data = iface.functions.configure.encode([(params.data as DividendCheckpointData).wallet]);
        break;
      default:
        data = NO_MODULE_DATA;
        break;
    }

    return (await this.contract).addModule.sendTransactionAsync(
      params.address,
      data,
      maxCost,
      budget,
      params.txData,
      params.safetyFactor,
    );
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
      types: result[4].map(t => t.toNumber()),
    };
    return typedResult;
  };

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: VerifyTransferParams) => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    assert.isBigNumberZero(params.value.modulo(await this.granularity()), 'Invalid granularity');
    return (await this.contract).verifyTransfer.callAsync(params.from, params.to, params.value, params.data);
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
      SecurityToken.abi,
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
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      SecurityToken.abi,
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
      (await this.getModule({ moduleAddress })).address === '0x0000000000000000000000000000000000000000',
      'Module already exists at that address',
    );
  };

  private checkControllerEnabled = async () => {
    assert.assert(!(await this.controllerDisabled()), 'Controller currently disabled');
  };

  private checkBalanceFromGreaterThanValue = async (from: string, value: BigNumber) => {
    assert.assert(
      (await this.balanceOf({ owner: from })).isGreaterThanOrEqualTo(value),
      'Insufficient balance for inputted value',
    );
  };

  private checkModuleCostBelowMaxCost = async (
    moduleFactory: string,
    txData?: Partial<TxData>,
    maxCost?: BigNumber,
  ) => {
    const moduleCost = await (await this.moduleFactoryContract(moduleFactory)).getSetupCost.callAsync();
    if (maxCost) {
      assert.assert(
        maxCost.isGreaterThanOrEqualTo(moduleCost),
        'Insufficient max cost to cover module factory setup cost',
      );
    }
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(
      await this.getCallerAddress(txData),
    );
    assert.assert(polyTokenBalance.isGreaterThanOrEqualTo(moduleCost), 'Insufficient poly token balance for module cost');
  };

  private checkOnlyOwner = async (txData: Partial<TxData> | undefined) => {
    assert.assert((await this.owner()) === (await this.getCallerAddress(txData)), 'Msg sender must be owner');
  };

  private checkMsgSenderIsController = async (txData: Partial<TxData> | undefined) => {
    assert.assert((await this.controller()) === (await this.getCallerAddress(txData)), 'Msg sender must be controller');
  };

  private checkUseModuleVerified = async (address: string) => {
    if (await (await this.featureRegistryContract()).getFeatureStatus.callAsync(Features.CustomModulesAllowed)) {
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
    const allModulesTypes = [
      ModuleType.PermissionManager,
      ModuleType.STO,
      ModuleType.Burn,
      ModuleType.Dividends,
      ModuleType.TransferManager,
    ];
    const allModules = await Promise.all(
      allModulesTypes.map(async type => {
        return (await (await this.moduleRegistryContract()).getModulesByType.callAsync(type)).includes(moduleAddress);
      }),
    );
    return allModules.includes(true);
  };

  private isCompatibleModule = async (address: string) => {
    const versions = await this.getVersion();
    const upperSTVersionBounds = await (await this.moduleFactoryContract(address)).getUpperSTVersionBounds.callAsync();
    const lowerSTVersionBounds = await (await this.moduleFactoryContract(address)).getLowerSTVersionBounds.callAsync();
    let isCompatible = true;
    for (let i = 0; i < 3; i + 1) {
      isCompatible =
        isCompatible &&
        lowerSTVersionBounds[i].isLessThanOrEqualTo(versions[i]) &&
        upperSTVersionBounds[i].isGreaterThanOrEqualTo(versions[i]);
    }
    return isCompatible;
  };
}
