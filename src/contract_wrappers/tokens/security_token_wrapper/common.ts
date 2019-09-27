import {
  PolyResponse,
  FeatureRegistryContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  ModuleFactoryContract_3_0_0,
  ModuleRegistryContract_3_0_0,
  PolyTokenContract_3_0_0,
  EtherDividendCheckpointContract_3_0_0,
  CountTransferManagerContract_3_0_0,
  PercentageTransferManagerContract_3_0_0,
  ERC20DividendCheckpointContract_3_0_0,
  VestingEscrowWalletContract_3_0_0,
  RestrictedPartialSaleTMContract_3_1_0,
  TxData,
  Web3Wrapper,
  BigNumber,
  ethersUtils,
  CappedSTOContract_3_1_0,
  USDTieredSTOContract_3_1_0,
} from '@polymathnetwork/abi-wrappers';
import assert from '../../../utils/assert';
import ERC20TokenWrapper from '../erc20_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  Feature,
  FULL_DECIMALS,
  FundRaiseType,
  ModuleName,
  ModuleType,
  Partition,
  PERCENTAGE_DECIMALS,
  Perm,
  TxParams,
  CappedSTOFundRaiseType,
  TransferStatusCode,
  ErrorCode,
} from '../../../types';
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
} from '../../../utils/convert';
import functionsUtils from '../../../utils/functions_utils';

const NO_MODULE_DATA = '0x0000000000000000';
const MAX_CHECKPOINT_NUMBER = new BigNumber(2 ** 256 - 1);
const BIG_NUMBER_ZERO = new BigNumber(0);

export namespace SecurityTokenTransactionParams {
  export interface FreezeIssuance extends FreezeIssuanceParams {}
  export interface ArchiveModule extends ModuleAddressTxParams {}
  export interface UnarchiveModule extends ModuleAddressTxParams {}
  export interface RemoveModule extends ModuleAddressTxParams {}
  export interface UpgradeModule extends ModuleAddressTxParams {}
  export interface ChangeDataStore extends DataStoreAddressParams {}
  export interface SetDocument extends SetDocumentParams {}
  export interface GetDocument extends DocumentParams {}
  export interface RemoveDocument extends DocumentParams {}
  export interface ChangeTreasuryWallet extends ChangeTreasuryWalletParams {}
  export interface ChangeApproval extends ChangeApprovalParams {}
  export interface TransferOwnership extends TransferOwnershipParams {}
  export interface WithdrawERC20 extends WithdrawERC20Params {}
  export interface ChangeModuleBudget extends ChangeModuleBudgetParams {}
  export interface UpdateTokenDetails extends UpdateTokenDetailsParams {}
  export interface ChangeGranularity extends ChangeGranularityParams {}
  export interface ChangeName extends ChangeNameParams {}
  export interface TransferWithData extends TransferWithDataParams {}
  export interface TransferFromWithData extends TransferFromWithDataParams {}
  export interface Issue extends IssueParams {}
  export interface IssueByPartition extends IssueByPartitionParams {}
  export interface IssueMulti extends IssueMultiParams {}
  export interface Redeem extends RedeemParams {}
  export interface RedeemByPartition extends RedeemByPartitionParams {}
  export interface OperatorRedeemByPartition extends OperatorRedeemByPartitionParams {}
  export interface RedeemFrom extends RedeemFromParams {}
  export interface TransferByPartition extends TransferByPartitionParams {}
  export interface AuthorizeOperator extends AuthorizeOperatorParams {}
  export interface AuthorizeOperatorByPartition extends AuthorizeOperatorByPartitionParams {}
  export interface RevokeOperator extends RevokeOperatorParams {}
  export interface RevokeOperatorByPartition extends RevokeOperatorByPartitionParams {}
  export interface OperatorTransferByPartition extends OperatorTransferByPartitionParams {}
  export interface SetController extends SetControllerParams {}
  export interface DisableController extends DisableControllerParams {}
  export interface ControllerTransfer extends ControllerTransferParams {}
  export interface ControllerRedeem extends ControllerRedeemParams {}
  export interface AddModule extends AddModuleParams {}
  export interface AddNoDataModule extends AddNoDataModuleParams {}
  export interface AddVestingEscrowWallet extends AddVestingEscrowWalletParams {}
  export interface AddCountTransferManager extends AddCountTransferManagerParams {}
  export interface AddPercentageTransferManager extends AddPercentageTransferManagerParams {}
  export interface AddDividendCheckpoint extends AddDividendCheckpointParams {}
  export interface AddCappedSTO extends AddCappedSTOParams {}
  export interface AddUSDTieredSTO extends AddUSDTieredSTOParams {}
}

/**
 * @param operator The operator to check
 * @param tokenHolder The token holder to check
 */
interface IsOperatorParams {
  operator: string;
  tokenHolder: string;
}

/**
 * @param partition The partition to check
 */
interface IsOperatorForPartitionParams extends IsOperatorParams {
  partition: Partition;
}

/**
 * @param tokenHolder Whom balance need to queried
 */
interface PartitionsOfParams {
  tokenHolder: string;
}

/**
 * @param signature calldata
 */
interface FreezeIssuanceParams extends TxParams {
  signature: string;
}

/**
 * @param type type of the module
 */
interface ModuleTypeParams {
  type: ModuleType;
}

/**
 * @param moduleAddress Address
 */
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
 * @param dataStore Address of the token data store
 */
interface DataStoreAddressParams extends TxParams {
  dataStore: string;
}

/**

 * @param name Name of the document. It should be unique always
 * @param uri Off-chain uri of the document from where it is accessible to investors/advisors to read.
 * @param documentHash hash (of the contents) of the document.
 */
interface SetDocumentParams extends TxParams {
  name: string;
  uri: string;
  documentHash: string;
}

/**
 * @param name Name of the document. It should be unique always
 */
interface DocumentParams extends TxParams {
  name: string;
}

/**
 * @param treasuryWallet Ethereum address of the treasury wallet
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

/**
 * @param from Address
 */
interface CanTransferFromParams extends CanTransferParams {
  from: string;
}

/**
 * @param partition
 */
interface CanTransferByPartitionParams extends CanTransferFromParams {
  partition: Partition;
}

/**
 * @param spender Address spending tokens
 * @param value Value associated to approval
 */
interface ChangeApprovalParams extends TxParams {
  spender: string;
  value: BigNumber;
}

/**
 * @param newOwner Address to transfer ownership to
 */
interface TransferOwnershipParams extends TxParams {
  newOwner: string;
}

/**
 * @param moduleName name of module
 */
interface ModuleNameParams {
  moduleName: ModuleName;
}

/**
 * @param tokenContract Address of the ERC20Basic compliance token
 * @param value Amount of POLY to withdraw
 */
interface WithdrawERC20Params extends TxParams {
  tokenContract: string;
  value: BigNumber;
}

/**
 * @param module Module address
 * @param change Change in allowance
 * @param increase True if budget has to be increased, false if decrease
 */
interface ChangeModuleBudgetParams extends TxParams {
  module: string;
  change: BigNumber;
  increase: boolean;
}

/**
 * @param newTokenDetails New token details
 */
interface UpdateTokenDetailsParams extends TxParams {
  newTokenDetails: string;
}

/**
 * @param granularity Granularity level of the token
 */
interface ChangeGranularityParams extends TxParams {
  granularity: BigNumber;
}

/**
 * @param name new name of the token
 */
interface ChangeNameParams extends TxParams {
  name: string;
}
/**
 * @param checkpointId Checkpoint ID to query as of
 */
interface CheckpointIdParams {
  checkpointId: number;
}

/**
 * @param start Position of investor to start iteration from
 * @param end Position of investor to stop iteration at
 */
interface GetInvestorsSubsetAtParams extends CheckpointIdParams {
  start: number;
  end: number;
}

/**
 * @param start Position of investor to start iteration from
 * @param end Position of investor to stop iteration at
 */
interface IterateInvestorsParams {
  start: number;
  end: number;
}

/**
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface TransferWithDataParams extends TxParams {
  to: string;
  value: BigNumber;
  data: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface TransferFromWithDataParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

/**
 * @param investor The account that will receive the created tokens (account should be whitelisted or KYCed).
 * @param value The amount of tokens need to be issued
 * @param data The `bytes data` allows arbitrary data to be submitted alongside the transfer.
 */
interface IssueParams extends TxParams {
  investor: string;
  value: BigNumber;
  data?: string;
}

/**
 * @param partition The partition to allocate the increase in balance
 */
interface IssueByPartitionParams extends IssueParams {
  partition: Partition;
}

/**
 * @param investors A list of addresses to whom the minted tokens will be dilivered
 * @param values A list of number of tokens get minted and transfer to corresponding address of the investor from tokenHolders[] list
 */
interface IssueMultiParams extends TxParams {
  investors: string[];
  values: BigNumber[];
}

/**
 * @param delegateAddress address of delegate
 * @param moduleAddress address of PermissionManager module
 * @param permission the permissions
 */
interface CheckPermissionParams {
  delegateAddress: string;
  moduleAddress: string;
  permission: Perm;
}

/**
 * @param value The amount of tokens need to be redeemed
 * @param data The `bytes data` it can be used in the token contract to authenticate the redemption.
 */
interface RedeemParams extends TxParams {
  value: BigNumber;
  data: string;
}

/**
 * @param partition The partition to allocate the decrease in balance
 */
interface RedeemByPartitionParams extends RedeemParams {
  partition: Partition;
}

/**
 * @param tokenHolder The token holder whose balance should be decreased
 * @param operatorData Additional data attached to the transfer of tokens by the operator
 */
interface OperatorRedeemByPartitionParams extends RedeemByPartitionParams {
  tokenHolder: string;
  operatorData: string;
}

/**
 * @param from The account whose tokens gets redeemed.
 * @param value The amount of tokens need to be redeemed
 * @param data The `bytes data` it can be used in the token contract to authenticate the redemption.
 */
interface RedeemFromParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
}

/**
 * @param investor Investor to query balance for
 * @param checkpointId Checkpoint ID to query as of
 */
interface BalanceOfAtParams {
  investor: string;
  checkpointId: number;
}

/**
 * @param partition Partition which differentiate the tokens.
 * @param tokenHolder Whom balance need to queried
 */
interface BalanceOfByPartitionParams {
  partition: Partition;
  tokenHolder: string;
}

/**
 * @param partition The partition from which to transfer tokens
 * @param to The address to which to transfer tokens to
 * @param value The amount of tokens to transfer from `partition`
 * @param data Additional data attached to the transfer of tokens
 */
interface TransferByPartitionParams extends TxParams {
  partition: Partition;
  to: string;
  value: BigNumber;
  data: string;
}

/**
 * @param operator An address which is being authorised.
 */
interface AuthorizeOperatorParams extends TxParams {
  operator: string;
}

/**
 * @param partition The partition to which the operator is authorised
 */
interface AuthorizeOperatorByPartitionParams extends AuthorizeOperatorParams {
  partition: Partition;
}

/**
 * @param operator An address which is being de-authorised
 */
interface RevokeOperatorParams extends TxParams {
  operator: string;
}

/**
 * @param partition The partition to which the operator is de-authorised
 */
interface RevokeOperatorByPartitionParams extends RevokeOperatorParams {
  partition: Partition;
}

/**
 * @param from The address from which to transfer tokens from
 * @param operatorData Additional data attached to the transfer of tokens by the operator
 */
interface OperatorTransferByPartitionParams extends TransferByPartitionParams {
  from: string;
  operatorData: string;
}

/**
 * @param controller address of the controller
 */
interface SetControllerParams extends TxParams {
  controller: string;
}

/**
 * @param signature calldata
 */
interface DisableControllerParams extends TxParams {
  signature: string;
}

/**
 * @param from Address The address which you want to send tokens from
 * @param to Address The address which you want to transfer to
 * @param value the amount of tokens to be transferred
 * @param data data to validate the transfer. (It is not used in this reference implementation
 * because use of `data` parameter is implementation specific).
 * @param operatorData data attached to the transfer by controller to emit in event. (It is more like a reason string
 * for calling this function (aka force transfer) which provides the transparency on-chain).
 */
interface ControllerTransferParams extends TxParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
  operatorData: string;
}

/**
 * @param from The account whose tokens will be redeemed.
 * @param value uint256 the amount of tokens need to be redeemed.
 * @param data data to validate the transfer. (It is not used in this reference implementation
 * because use of `data` parameter is implementation specific).
 * @param operatorData data attached to the transfer by controller to emit in event. (It is more like a reason string
 * for calling this function (aka force transfer) which provides the transparency on-chain).
 */
interface ControllerRedeemParams extends TxParams {
  from: string;
  value: BigNumber;
  data: string;
  operatorData: string;
}

/**
 * @param moduleName is the address of the module factory to be added
 * @param address Address of the module
 * @param archived whether to add the module as an archived module
 * @param maxCost max amount of POLY willing to pay to module. (WIP)
 * @param budget max amount of ongoing POLY willing to assign to the module.
 * @param label is the label of the module
 * @param data is data packed into bytes used to further configure the module (See STO usage)
 */
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
    | RestrictedPartialSaleTransferManagerData
    | DividendCheckpointData
    | CappedSTOData
    | USDTieredSTOData
    | VestingEscrowWalletData;
}

/**
 * @param moduleName is the address of the module factory to be added
 * @param data is data packed into bytes used to further configure the module (here no data)
 */

interface AddNoDataModuleParams extends AddModuleParams {
  moduleName:
    | ModuleName.GeneralPermissionManager
    | ModuleName.GeneralTransferManager
    | ModuleName.ManualApprovalTransferManager
    | ModuleName.VolumeRestrictionTM
    | ModuleName.LockUpTransferManager
    | ModuleName.BlacklistTransferManager;
  data?: undefined;
}

interface AddVestingEscrowWalletParams extends AddModuleParams {
  moduleName: ModuleName.VestingEscrowWallet;
  data: VestingEscrowWalletData;
}

interface AddCountTransferManagerParams extends AddModuleParams {
  moduleName: ModuleName.CountTransferManager;
  data: CountTransferManagerData;
}

interface AddPercentageTransferManagerParams extends AddModuleParams {
  moduleName: ModuleName.PercentageTransferManager;
  data: PercentageTransferManagerData;
}

interface AddRestrictedPartialSaleTransferManagerParams extends AddModuleParams {
  moduleName: ModuleName.RestrictedPartialSaleTM;
  data: RestrictedPartialSaleTransferManagerData;
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

export interface CountTransferManagerData {
  maxHolderCount: number;
}

export interface VestingEscrowWalletData {
  treasuryWallet: string;
}

export interface PercentageTransferManagerData {
  maxHolderPercentage: BigNumber;
  allowPrimaryIssuance: boolean;
}

export interface RestrictedPartialSaleTransferManagerData {
  treasuryWallet: string;
}

export interface DividendCheckpointData {
  wallet: string;
}

export interface CappedSTOData {
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
  treasuryWallet: string;
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
  treasuryWallet: string;
  usdTokens: string[];
}

interface AddModuleInterface {
  (params: AddCountTransferManagerParams): Promise<PolyResponse>;
  (params: AddPercentageTransferManagerParams): Promise<PolyResponse>;
  (params: AddRestrictedPartialSaleTransferManagerParams): Promise<PolyResponse>;
  (params: AddDividendCheckpointParams): Promise<PolyResponse>;
  (params: AddCappedSTOParams): Promise<PolyResponse>;
  (params: AddUSDTieredSTOParams): Promise<PolyResponse>;
  (params: AddNoDataModuleParams): Promise<PolyResponse>;
  (params: AddVestingEscrowWalletParams): Promise<PolyResponse>;
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

interface ProduceAddModuleInformation {
  maxCost: BigNumber;
  budget: BigNumber;
  data: string;
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export default abstract class SecurityTokenCommon extends ERC20TokenWrapper {
  public contract: Promise<ISecurityTokenContract_3_0_0>;

  public contractFactory: ContractFactory;

  public featureRegistryContract = async (): Promise<FeatureRegistryContract_3_0_0> => {
    return this.contractFactory.getFeatureRegistryContract();
  };

  public moduleFactoryContract = async (address: string): Promise<ModuleFactoryContract_3_0_0> => {
    return this.contractFactory.getModuleFactoryContract(address);
  };

  public polyTokenContract = async (): Promise<PolyTokenContract_3_0_0> => {
    return this.contractFactory.getPolyTokenContract();
  };

  public moduleRegistryContract = async (): Promise<ModuleRegistryContract_3_0_0> => {
    return this.contractFactory.getModuleRegistryContract();
  };

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ISecurityTokenContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract);
    this.contract = contract;
    this.contractFactory = contractFactory;
  }

  /**
   * Value of current checkpoint
   * @return current checkpoint Id
   */
  public currentCheckpointId = async (): Promise<BigNumber> => {
    return (await this.contract).currentCheckpointId.callAsync();
  };

  /**
   * Determines whether `operator` is an operator for all partitions of `tokenHolder`
   * @return Whether the `operator` is an operator for all partitions of `tokenHolder`
   */
  public isOperator = async (params: IsOperatorParams): Promise<boolean> => {
    return (await this.contract).isOperator.callAsync(params.operator, params.tokenHolder);
  };

  /**
   * Determines whether `operator` is an operator for a specified partition of `tokenHolder`
   * @return Whether the `operator` is an operator for a specified partition of `tokenHolder`
   */
  public isOperatorForPartition = async (params: IsOperatorForPartitionParams): Promise<boolean> => {
    return (await this.contract).isOperatorForPartition.callAsync(
      stringToBytes32(params.partition),
      params.operator,
      params.tokenHolder,
    );
  };

  /**
   * Return all partitions
   * @return List of partitions
   */
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
   * @return granularity
   */
  public granularity = async (): Promise<BigNumber> => {
    return (await this.contract).granularity.callAsync();
  };

  /**
   * Controller
   * @return controller address
   */
  public controller = async (): Promise<string> => {
    return (await this.contract).controller.callAsync();
  };

  /**
   * Decrease Allowance
   */
  public decreaseAllowance = async (params: ChangeApprovalParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).decreaseAllowance.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get polyToken
   * @return address of polyToken
   */
  public polyToken = async (): Promise<string> => {
    return (await this.contract).polyToken.callAsync();
  };

  /**
   * Get polymathRegistry
   * @return address of registry
   */
  public polymathRegistry = async (): Promise<string> => {
    return (await this.contract).polymathRegistry.callAsync();
  };

  /**
   * Used to permanently halt controller actions
   * @return boolean
   */
  public controllerDisabled = async (): Promise<boolean> => {
    return (await this.contract).controllerDisabled.callAsync();
  };

  /**
   * Owner address
   * @return address
   */
  public owner = async (): Promise<string> => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * A security token issuer can specify that issuance has finished for the token
   * (i.e. no new tokens can be minted or issued).
   * If a token returns FALSE for `isIssuable()` then it MUST always return FALSE in the future.
   * If a token returns FALSE for `isIssuable()` then it MUST never allow additional tokens to be issued.
   * @return bool `true` signifies the minting is allowed. While `false` denotes the end of minting
   */
  public isIssuable = async (): Promise<boolean> => {
    return (await this.contract).isIssuable.callAsync();
  };

  /**
   * Check if msg sender is owner
   * @return true if `msg.sender` is the owner of the contract.
   */
  public isOwner = async (): Promise<boolean> => {
    return (await this.contract).isOwner.callAsync();
  };

  /**
   * In order to provide transparency over whether `controllerTransfer` / `controllerRedeem` are useable
   * or not `isControllable` function will be used.
   * If `isControllable` returns `false` then it always return `false` and
   * `controllerTransfer` / `controllerRedeem` will always revert.
   * @return bool `true` when controller address is non-zero otherwise return `false`.
   */
  public isControllable = async (): Promise<boolean> => {
    return (await this.contract).isControllable.callAsync();
  };

  /**
   * Get moduleRegistry
   * @return address of moduleRegistry
   */
  public moduleRegistry = async (): Promise<string> => {
    return (await this.contract).moduleRegistry.callAsync();
  };

  /**
   * Get securityTokenRegistry
   * @return address of securityTokenRegistry
   */
  public securityTokenRegistry = async (): Promise<string> => {
    return (await this.contract).securityTokenRegistry.callAsync();
  };

  /**
   * Get tokenDetails
   * @return off chain data details of token
   */
  public tokenDetails = async (): Promise<string> => {
    return (await this.contract).tokenDetails.callAsync();
  };

  /**
   * Increase Allowance
   */
  public increaseAllowance = async (params: ChangeApprovalParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('spender', params.spender);
    return (await this.contract).increaseAllowance.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Check variable used to temporarily halt all transactions
   * @return boolean
   */
  public transfersFrozen = async (): Promise<boolean> => {
    return (await this.contract).transfersFrozen.callAsync();
  };

  /**
   * Allows the current owner to transfer control of the contract to a newOwner.
   */
  public transferOwnership = async (params: TransferOwnershipParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('newOwner', params.newOwner);
    return (await this.contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Update ST from registry
   */
  public updateFromRegistry = async (params: TxParams): Promise<PolyResponse> => {
    return (await this.contract).updateFromRegistry.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Archives a module attached to the SecurityToken
   */
  public archiveModule = async (params: ModuleAddressTxParams): Promise<PolyResponse> => {
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

  /**
   * Unarchives a module attached to the SecurityToken
   */
  public unarchiveModule = async (params: ModuleAddressTxParams): Promise<PolyResponse> => {
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

  /**
   * Removes a module attached to the SecurityToken
   */
  public removeModule = async (params: ModuleAddressTxParams): Promise<PolyResponse> => {
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

  /**
   * Returns module list for a module name
   * @return address List of modules with this name
   */
  public getModulesByName = async (params: ModuleNameParams): Promise<string[]> => {
    const moduleNameHex = stringToBytes32(params.moduleName);
    return (await this.contract).getModulesByName.callAsync(moduleNameHex);
  };

  /**
   * Allows the owner to withdraw unspent POLY stored by them on the ST or any ERC20 token.
   * Owner can transfer POLY to the ST which will be used to pay for modules that require a POLY fee.
   */
  public withdrawERC20 = async (params: WithdrawERC20Params): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).withdrawERC20.sendTransactionAsync(
      params.tokenContract,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows owner to increase/decrease POLY approval of one of the modules
   */
  public changeModuleBudget = async (params: ChangeModuleBudgetParams): Promise<PolyResponse> => {
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

  /**
   * Changes the tokenDetails
   */
  public updateTokenDetails = async (params: UpdateTokenDetailsParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).updateTokenDetails.sendTransactionAsync(
      params.newTokenDetails,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows the owner to change token granularity
   */
  public changeGranularity = async (params: ChangeGranularityParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.isBigNumberGreaterThanZero(params.granularity, 'Granularity must not be 0');
    return (await this.contract).changeGranularity.sendTransactionAsync(
      params.granularity,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows owner to change token name
   */
  public changeName = async (params: ChangeNameParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.name.length > 0, ErrorCode.InvalidData, 'Name required');
    return (await this.contract).changeName.sendTransactionAsync(params.name, params.txData, params.safetyFactor);
  };

  /**
   * Allows to change the treasury wallet address
   */
  public changeTreasuryWallet = async (params: ChangeTreasuryWalletParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('treasuryWallet', params.treasuryWallet);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeTreasuryWallet.sendTransactionAsync(
      params.treasuryWallet,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Allows owner to change data store
   */
  public changeDataStore = async (params: DataStoreAddressParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('dataStore', params.dataStore);
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeDataStore.sendTransactionAsync(
      params.dataStore,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns an array of investors
   * @return list of addresses
   */
  public getInvestors = async (): Promise<string[]> => {
    return (await this.contract).getInvestors.callAsync();
  };

  /**
   * Returns an array of investors at a given checkpoint
   * @return list of investors
   */
  public getInvestorsAt = async (params: CheckpointIdParams): Promise<string[]> => {
    return (await this.contract).getInvestorsAt.callAsync(numberToBigNumber(params.checkpointId));
  };

  /**
   * Returns an array of investors with non zero balance at a given checkpoint
   * @return list of investors
   */
  public getInvestorsSubsetAt = async (params: GetInvestorsSubsetAtParams): Promise<string[]> => {
    return (await this.contract).getInvestorsSubsetAt.callAsync(
      numberToBigNumber(params.checkpointId),
      numberToBigNumber(params.start),
      numberToBigNumber(params.end),
    );
  };

  /**
   * Generates subset of investors
   * @return list of investors
   */
  public iterateInvestors = async (params: IterateInvestorsParams): Promise<string[]> => {
    return (await this.contract).iterateInvestors.callAsync(
      numberToBigNumber(params.start),
      numberToBigNumber(params.end),
    );
  };

  /**
   * Gets the investor count
   */
  public getInvestorCount = async (): Promise<number> => {
    return (await (await this.contract).getInvestorCount.callAsync()).toNumber();
  };

  /**
   * Number of investors with non-zero balance
   * @return number of holders
   */
  public holderCount = async (): Promise<number> => {
    return (await (await this.contract).holderCount.callAsync()).toNumber();
  };

  /**
   * Freezes all the transfers
   */
  public freezeTransfers = async (params: TxParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(!(await this.transfersFrozen()), ErrorCode.PreconditionRequired, 'Transfers already frozen');
    return (await this.contract).freezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Un-Freezes all the transfers
   */
  public unfreezeTransfers = async (params: TxParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(await this.transfersFrozen(), ErrorCode.PreconditionRequired, 'Transfers are not frozen');
    return (await this.contract).unfreezeTransfers.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Overloaded version of the transfer function
   * @return bool success
   */
  public transferWithData = async (params: TransferWithDataParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('to', params.to);
    return (await this.contract).transferWithData.sendTransactionAsync(
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.data,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Overloaded version of the transferFrom function
   * @return bool success
   */
  public transferFromWithData = async (params: TransferFromWithDataParams): Promise<PolyResponse> => {
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

  /**
   * Permanently freeze issuance of this security token.
   * It MUST NOT be possible to increase `totalSupply` after this function is called.
   */
  public freezeIssuance = async (params: FreezeIssuanceParams): Promise<PolyResponse> => {
    assert.assert(await this.isIssuable(), ErrorCode.PreconditionRequired, 'Issuance frozen');
    assert.assert(
      functionsUtils.checksumAddressComparision(
        await this.owner(),
        (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      ),
      ErrorCode.Unauthorized,
      'Msg sender must be owner',
    );
    return (await this.contract).freezeIssuance.sendTransactionAsync(
      params.signature,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * This function must be called to increase the total supply (Corresponds to mint function of ERC20).
   * It is only be called by the token issuer or the operator defined by the issuer. ERC1594 doesn't have
   * have the any logic related to operator but its superset ERC1400 have the operator logic and this function
   * is allowed to call by the operator.
   */
  public issue = async (params: IssueParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    await this.checkOnlyOwner(params.txData);
    assert.assert(await this.isIssuable(), ErrorCode.PreconditionRequired, 'Issuance frozen');
    const canTransfer = await this.canTransfer({
      to: params.investor,
      value: params.value,
      data: params.data || '0x00',
    });
    assert.assert(
      canTransfer.statusCode !== TransferStatusCode.TransferFailure,
      ErrorCode.InvalidTransfer,
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

  /**
   * Increases totalSupply and the corresponding amount of the specified owners partition
   */
  public issueByPartition = async (params: IssueByPartitionParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('investor', params.investor);
    await this.checkOnlyOwner(params.txData);
    assert.assert(await this.isIssuable(), ErrorCode.PreconditionRequired, 'Issuance frozen');
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

  /**
   * issue new tokens and assigns them to the target _tokenHolder.
   * @return success
   */
  public issueMulti = async (params: IssueMultiParams): Promise<PolyResponse> => {
    params.investors.forEach(address => assert.isNonZeroETHAddressHex('investors', address));
    assert.assert(
      params.investors.length === params.values.length,
      ErrorCode.MismatchedArrayLength,
      'Number of investors passed in must be equivalent to number of values',
    );
    assert.assert(await this.isIssuable(), ErrorCode.PreconditionRequired, 'Issuance frozen');
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).issueMulti.sendTransactionAsync(
      params.investors,
      valueArrayToWeiArray(params.values, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Validate permissions with PermissionManager if it exists, If no Permission return false
   * Note that IModule withPerm will allow ST owner all permissions anyway
   * this allows individual modules to override this logic if needed (to not allow ST owner all permissions)
   * @return success
   */
  public checkPermission = async (params: CheckPermissionParams): Promise<boolean> => {
    assert.isETHAddressHex('delegateAddress', params.delegateAddress);
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    return (await this.contract).checkPermission.callAsync(
      params.delegateAddress,
      params.moduleAddress,
      stringToBytes32(params.permission),
    );
  };

  /**
   * This function redeem an amount of the token of a msg.sender. For doing so msg.sender may incentivize
   * using different ways that could be implemented with in the `redeem` function definition. But those implementations
   * are out of the scope of the ERC1594.
   */
  public redeem = async (params: RedeemParams): Promise<PolyResponse> => {
    await this.checkBalanceFromGreaterThanValue((await this.web3Wrapper.getAvailableAddressesAsync())[0], params.value);
    return (await this.contract).redeem.sendTransactionAsync(
      valueToWei(params.value, await this.decimals()),
      stringToBytes32(params.data),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Decreases totalSupply and the corresponding amount of the specified partition of msg.sender
   */
  public redeemByPartition = async (params: RedeemByPartitionParams): Promise<PolyResponse> => {
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

  /**
   * Decreases totalSupply and the corresponding amount of the specified partition of tokenHolder
   * This function can only be called by the authorised operator.
   * @param partition The partition to allocate the decrease in balance.
   * @param tokenHolder The token holder whose balance should be decreased
   * @param value The amount by which to decrease the balance
   * @param data Additional data attached to the burning of tokens
   * @param operatorData Additional data attached to the transfer of tokens by the operator
   */
  public operatorRedeemByPartition = async (params: OperatorRedeemByPartitionParams): Promise<PolyResponse> => {
    await this.checkBalanceFromGreaterThanValue((await this.web3Wrapper.getAvailableAddressesAsync())[0], params.value);
    assert.isNonZeroETHAddressHex('TokenHolder', params.tokenHolder);
    assert.assert(params.operatorData.length > 0, ErrorCode.InvalidData, 'Operator data cannot be 0');
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

  /**
   * This function redeem an amount of the token of a msg.sender. For doing so msg.sender may incentivize
   * using different ways that could be implemented with in the `redeem` function definition. But those implementations
   * are out of the scope of the ERC1594.
   * It is analogy to `transferFrom`
   */
  public redeemFrom = async (params: RedeemFromParams): Promise<PolyResponse> => {
    await this.checkBalanceFromGreaterThanValue(params.from, params.value);
    assert.assert(
      (await this.allowance({
        owner: params.from,
        spender: (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      })).isGreaterThanOrEqualTo(params.value),
      ErrorCode.InsufficientAllowance,
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

  /**
   * Creates a checkpoint that can be used to query historical balances / totalSupply
   */
  public createCheckpoint = async (params: TxParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(
      (await this.currentCheckpointId()).isLessThan(MAX_CHECKPOINT_NUMBER),
      ErrorCode.PreconditionRequired,
      'Reached maximum checkpoint number',
    );
    return (await this.contract).createCheckpoint.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Gets list of times that checkpoints were created
   * @return List of checkpoint dates
   */
  public getCheckpointTimes = async (): Promise<Date[]> => {
    const timestamps = await (await this.contract).getCheckpointTimes.callAsync();

    return timestamps.map(bigNumberToDate);
  };

  /**
   * Queries totalSupply at a specified checkpoint
   */
  public totalSupplyAt = async (params: CheckpointIdParams): Promise<BigNumber> => {
    assert.assert(
      (await this.currentCheckpointId()).isGreaterThanOrEqualTo(params.checkpointId),
      ErrorCode.InvalidData,
      'Checkpoint id must be less than or equal to currentCheckpoint',
    );
    return weiToValue(
      await (await this.contract).totalSupplyAt.callAsync(numberToBigNumber(params.checkpointId)),
      await this.decimals(),
    );
  };

  /**
   * Queries balance at a specified checkpoint
   * @return balance amount
   */
  public balanceOfAt = async (params: BalanceOfAtParams): Promise<BigNumber> => {
    assert.isETHAddressHex('investor', params.investor);
    assert.assert(
      (await this.currentCheckpointId()).isGreaterThanOrEqualTo(params.checkpointId),
      ErrorCode.InvalidData,
      'Checkpoint id must be less than or equal to currentCheckpoint',
    );
    return weiToValue(
      await (await this.contract).balanceOfAt.callAsync(params.investor, numberToBigNumber(params.checkpointId)),
      await this.decimals(),
    );
  };

  /**
   * Get the balance according to the provided partitions
   * @return balance amount
   */
  public balanceOfByPartition = async (params: BalanceOfByPartitionParams): Promise<BigNumber> => {
    assert.isETHAddressHex('investor', params.tokenHolder);
    return weiToValue(
      await (await this.contract).balanceOfByPartition.callAsync(stringToBytes32(params.partition), params.tokenHolder),
      await this.decimals(),
    );
  };

  /**
   * Transfers the ownership of tokens from a specified partition from one address to another address
   * @return The partition to which the transferred tokens were allocated for the to address
   */
  public transferByPartition = async (params: TransferByPartitionParams): Promise<PolyResponse> => {
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

  /**
   * Authorises an operator for all partitions of `msg.sender`.
   * NB - Allowing investors to authorize an investor to be an operator of all partitions
   * but it doesn't mean we operator is allowed to transfer the LOCKED partition values.
   * Logic for this restriction is written in `operatorTransferByPartition()` function.
   */
  public authorizeOperator = async (params: AuthorizeOperatorParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('Operator', params.operator);
    return (await this.contract).authorizeOperator.sendTransactionAsync(
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Revokes authorisation of an operator previously given for all partitions of `msg.sender`.
   * NB - Allowing investors to authorize an investor to be an operator of all partitions
   * but it doesn't mean we operator is allowed to transfer the LOCKED partition values.
   * Logic for this restriction is written in `operatorTransferByPartition()` function.
   */
  public revokeOperator = async (params: AuthorizeOperatorParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('Operator', params.operator);
    return (await this.contract).revokeOperator.sendTransactionAsync(
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Authorises an operator for a given partition of `msg.sender`
   */
  public authorizeOperatorByPartition = async (params: AuthorizeOperatorByPartitionParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('Operator', params.operator);
    assert.isValidPartition(params.partition);
    return (await this.contract).authorizeOperatorByPartition.sendTransactionAsync(
      stringToBytes32(params.partition),
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Revokes authorisation of an operator previously given for a specified partition of `msg.sender`
   */
  public revokeOperatorByPartition = async (params: RevokeOperatorByPartitionParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('Operator', params.operator);
    assert.isValidPartition(params.partition);
    return (await this.contract).revokeOperatorByPartition.sendTransactionAsync(
      stringToBytes32(params.partition),
      params.operator,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Transfers the ownership of tokens from a specified partition from one address to another address
   * @return The partition to which the transferred tokens were allocated for the to address
   */
  public operatorTransferByPartition = async (params: OperatorTransferByPartitionParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('To', params.to);
    assert.isETHAddressHex('From', params.from);
    assert.assert(params.operatorData.length > 0, ErrorCode.InvalidData, 'Operator data cannot be 0');
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

  /**
   * Used by the issuer to set the controller addresses
   */
  public setController = async (params: SetControllerParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    await this.checkIsControllable();
    assert.isETHAddressHex('controller', params.controller);
    return (await this.contract).setController.sendTransactionAsync(
      params.controller,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used by the issuer to permanently disable controller functionality
   * enabled via feature switch "disableControllerAllowed"
   */
  public disableController = async (params: DisableControllerParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    await this.checkIsControllable();
    return (await this.contract).disableController.sendTransactionAsync(
      params.signature,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * This function allows an authorised address to transfer tokens between any two token holders.
   * The transfer must still respect the balances of the token holders (so the transfer must be for at most
   * `balanceOf(_from)` tokens) and potentially also need to respect other transfer restrictions.
   * This function can only be executed by the `controller` address.
   */
  public controllerTransfer = async (params: ControllerTransferParams): Promise<PolyResponse> => {
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

  /**
   * This function allows an authorised address to redeem tokens for any token holder.
   * The redemption must still respect the balances of the token holder (so the redemption must be for at most
   * `balanceOf(tokenHolder)` tokens) and potentially also need to respect other transfer restrictions.
   * This function can only be executed by the `controller` address.
   */
  public controllerRedeem = async (params: ControllerRedeemParams): Promise<PolyResponse> => {
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

  /**
   * Used to get the version of the securityToken
   */
  public getVersion = async (): Promise<BigNumber[]> => {
    return (await this.contract).getVersion.callAsync();
  };

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: ModuleTypeParams): Promise<string[]> => {
    return (await this.contract).getModulesByType.callAsync(params.type);
  };

  /**
   * Use to return the global treasury wallet
   */
  public getTreasuryWallet = async (): Promise<string> => {
    return (await this.contract).getTreasuryWallet.callAsync();
  };

  /**
   * Function used to attach a module to the security token
   *  E.G.: On deployment (through the STR) ST gets a TransferManager module attached to it
   * to control restrictions on transfers.
   * You are allowed to add a new moduleType if:
   * - there is no existing module of that type yet added
   * - the last member of the module list is replacable
   */
  public addModule: AddModuleInterface = async (params: AddModuleParams): Promise<PolyResponse> => {
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

  /**
   * Attaches a module to the SecurityToken
   * E.G.: On deployment (through the STR) ST gets a TransferManager module attached to it
   * to control restrictions on transfers.
   */
  public addModuleWithLabel: AddModuleInterface = async (params: AddModuleParams): Promise<PolyResponse> => {
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

  /**
   * Upgrades a module attached to the SecurityToken
   */
  public upgradeModule = async (params: ModuleAddressTxParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('moduleAddress', params.moduleAddress);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleExists(params.moduleAddress);
    return (await this.contract).upgradeModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Upgrades security token
   */
  public upgradeToken = async (params: TxParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).upgradeToken.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Get module
   * @return Returns the data associated to a module
   */
  public getModule = async (params: ModuleAddressParams): Promise<ModuleData> => {
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

  public getTransferStatusCode = (result: string) => {
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
  public canTransfer = async (params: CanTransferParams): Promise<CanTransferFromData> => {
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
  public canTransferFrom = async (params: CanTransferFromParams): Promise<CanTransferFromData> => {
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
  public canTransferByPartition = async (params: CanTransferByPartitionParams): Promise<CanTransferByPartitionData> => {
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

  /**
   * Used to attach a new document to the contract, or update the URI or hash of an existing attached document
   * Can only be executed by the owner of the contract.
   */
  public setDocument = async (params: SetDocumentParams): Promise<PolyResponse> => {
    assert.assert(params.name.length > 0, ErrorCode.InvalidData, 'Bad name, cannot be empty');
    assert.assert(params.uri.length > 0, ErrorCode.InvalidData, 'Bad uri, cannot be empty');
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).setDocument.sendTransactionAsync(
      stringToBytes32(params.name),
      params.uri,
      stringToBytes32(params.documentHash),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to remove an existing document from the contract by giving the name of the document.
   * Can only be executed by the owner of the contract.
   */
  public removeDocument = async (params: DocumentParams): Promise<PolyResponse> => {
    await this.checkOnlyOwner(params.txData);
    const document = await this.getDocument({ name: params.name });
    assert.assert(document.documentUri.length !== 0, ErrorCode.NotFound, 'Document does not exist');
    return (await this.contract).removeDocument.sendTransactionAsync(
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get the document
   * @return Returns the data associated to a module
   */
  public getDocument = async (params: DocumentParams): Promise<DocumentData> => {
    const result = await (await this.contract).getDocument.callAsync(stringToBytes32(params.name));
    const typedResult: DocumentData = {
      documentUri: result[0],
      documentHash: bytes32ToString(result[1]),
      documentTime: bigNumberToDate(result[2]),
    };
    return typedResult;
  };

  /**
   * Used to retrieve a full list of documents attached to the smart contract.
   * @return List of all documents names present in the contract.
   */
  public getAllDocuments = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllDocuments.callAsync());
  };

  public checkModuleExists = async (moduleAddress: string) => {
    assert.assert((await this.getModule({ moduleAddress })).name !== '', ErrorCode.NotFound, 'Module does not exist');
  };

  public checkIsArchived = async (moduleAddress: string) => {
    assert.assert(
      (await this.getModule({ moduleAddress })).archived,
      ErrorCode.PreconditionRequired,
      'Module is not yet archived',
    );
  };

  public checkIsNotArchived = async (moduleAddress: string) => {
    assert.assert(
      !(await this.getModule({ moduleAddress })).archived,
      ErrorCode.PreconditionRequired,
      'Module is archived',
    );
  };

  public checkModuleStructAddressIsNotZero = async (moduleAddress: string) => {
    assert.isNonZeroETHAddressHex('address', (await this.getModule({ moduleAddress })).address);
  };

  public checkModuleStructAddressIsEmpty = async (moduleAddress: string) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(
        (await this.getModule({ moduleAddress })).address,
        '0x0000000000000000000000000000000000000000',
      ),
      ErrorCode.AlreadyExists,
      'Module already exists at that address',
    );
  };

  public checkIsControllable = async () => {
    assert.assert(await this.isControllable(), ErrorCode.PreconditionRequired, 'Controller currently disabled');
  };

  public checkBalanceFromGreaterThanValue = async (from: string, value: BigNumber) => {
    assert.assert(
      (await this.balanceOf({ owner: from })).isGreaterThanOrEqualTo(value),
      ErrorCode.InsufficientBalance,
      'Insufficient balance for inputted value',
    );
  };

  public checkModuleCostBelowMaxCost = async (moduleFactory: string, maxCost: BigNumber) => {
    const moduleCost = await (await this.moduleFactoryContract(moduleFactory)).setupCostInPoly.callAsync();
    assert.assert(
      maxCost.isGreaterThanOrEqualTo(moduleCost),
      ErrorCode.InsufficientBalance,
      'Insufficient max cost to cover module factory setup cost',
    );
    const polyTokenBalance = await (await this.polyTokenContract()).balanceOf.callAsync(await this.address());
    assert.assert(
      polyTokenBalance.isGreaterThanOrEqualTo(moduleCost),
      ErrorCode.InsufficientBalance,
      'Insufficient poly token balance for module cost',
    );
  };

  public checkOnlyOwner = async (txData: Partial<TxData> | undefined) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(txData)),
      ErrorCode.Unauthorized,
      'Msg sender must be owner',
    );
  };

  public checkMsgSenderIsController = async (txData: Partial<TxData> | undefined) => {
    assert.assert(
      (await this.isControllable()) && (await this.controller()) === (await this.getCallerAddress(txData)),
      ErrorCode.Unauthorized,
      'Msg sender must be controller',
    );
  };

  public checkUseModuleVerified = async (address: string) => {
    if (await (await this.featureRegistryContract()).getFeatureStatus.callAsync(Feature.CustomModulesAllowed)) {
      const isOwner = (await (await this.moduleFactoryContract(address)).owner.callAsync()) === (await this.owner());
      assert.assert(
        (await this.checkForRegisteredModule(address)) || isOwner,
        ErrorCode.Unauthorized,
        'ModuleFactory must be verified or SecurityToken owner must be ModuleFactory owner',
      );
    } else {
      assert.assert(
        await this.checkForRegisteredModule(address),
        ErrorCode.Unauthorized,
        'ModuleFactory must be verified',
      );
    }
    assert.assert(
      await this.isCompatibleModule(address),
      ErrorCode.InvalidVersion,
      'Version should within the compatible range of ST',
    );
  };

  public checkForRegisteredModule = async (moduleAddress: string) => {
    const moduleRegistry = await this.moduleRegistryContract();
    const allModulesTypes = [
      await moduleRegistry.getModulesByType.callAsync(ModuleType.PermissionManager),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.STO),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.Burn),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.Dividends),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.TransferManager),
      await moduleRegistry.getModulesByType.callAsync(ModuleType.Wallet),
    ];
    const allModules = await Promise.all(
      allModulesTypes.map(myPromise => {
        return myPromise.includes(moduleAddress);
      }),
    );
    return allModules.includes(true);
  };

  public isCompatibleModule = async (address: string) => {
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

  public cappedSTOAssertions = async (data: CappedSTOData) => {
    assert.isBigNumberGreaterThanZero(data.rate, 'Rate of token should be greater than 0');
    assert.isNonZeroETHAddressHex('Funds Receiver', data.fundsReceiver);
    assert.isNonZeroETHAddressHex('Treasury Wallet', data.treasuryWallet);
    assert.isFutureDate(data.startTime, 'Start time date not valid');
    assert.assert(data.endTime > data.startTime, ErrorCode.TooEarly, 'End time not valid');
    assert.isBigNumberGreaterThanZero(data.cap, 'Cap should be greater than 0');
    assert.isNonZeroETHAddressHex('Treasury wallet', data.treasuryWallet);
  };

  public usdTieredSTOAssertions = async (data: USDTieredSTOData) => {
    assert.isFutureDate(data.startTime, 'Start time date not valid');
    assert.assert(data.endTime > data.startTime, ErrorCode.TooEarly, 'End time not valid');
    assert.assert(data.tokensPerTierTotal.length > 0, ErrorCode.InvalidData, 'No tiers provided');
    assert.areValidArrayLengths(
      [data.ratePerTier, data.tokensPerTierTotal, data.ratePerTierDiscountPoly, data.tokensPerTierDiscountPoly],
      'Tier data length mismatch',
    );
    for (let i = 0; i < data.ratePerTier.length; i += 1) {
      assert.isBigNumberGreaterThanZero(data.ratePerTier[i], 'Rate per tier should be greater than 0');
      assert.isBigNumberGreaterThanZero(data.tokensPerTierTotal[i], 'Invalid token amount');
      assert.assert(
        data.tokensPerTierDiscountPoly[i].isLessThanOrEqualTo(data.tokensPerTierTotal[i]),
        ErrorCode.InvalidData,
        'Too many discounted tokens',
      );
      assert.assert(
        data.ratePerTierDiscountPoly[i].isLessThanOrEqualTo(data.ratePerTier[i]),
        ErrorCode.InvalidData,
        'Invalid discount',
      );
    }
    assert.assert(
      data.fundRaiseTypes.length > 0 && data.fundRaiseTypes.length <= 3,
      ErrorCode.InvalidData,
      'Raise type is not specified',
    );
    assert.isNonZeroETHAddressHex('Wallet', data.wallet);
    assert.isNonZeroETHAddressHex('ReserveWallet', data.treasuryWallet);
  };

  public async addModuleRequirementsAndGetData(params: AddModuleParams): Promise<ProduceAddModuleInformation> {
    const maxCost = params.maxCost === undefined ? BIG_NUMBER_ZERO : valueToWei(params.maxCost, FULL_DECIMALS);
    const budget = params.budget === undefined ? BIG_NUMBER_ZERO : valueToWei(params.budget, FULL_DECIMALS);
    assert.isETHAddressHex('address', params.address);
    await this.checkOnlyOwner(params.txData);
    await this.checkModuleCostBelowMaxCost(params.address, maxCost);
    await this.checkModuleStructAddressIsEmpty(params.address);
    await this.checkUseModuleVerified(params.address);
    const decimals = await this.decimals();
    let iface: ethersUtils.Interface;
    let data: string;
    switch (params.moduleName) {
      case ModuleName.VestingEscrowWallet:
        iface = new ethersUtils.Interface(VestingEscrowWalletContract_3_0_0.ABI());
        data = iface.functions.configure.encode([(params.data as VestingEscrowWalletData).treasuryWallet]);
        break;
      case ModuleName.CountTransferManager:
        iface = new ethersUtils.Interface(CountTransferManagerContract_3_0_0.ABI());
        data = iface.functions.configure.encode([(params.data as CountTransferManagerData).maxHolderCount]);
        break;
      case ModuleName.PercentageTransferManager:
        iface = new ethersUtils.Interface(PercentageTransferManagerContract_3_0_0.ABI());
        data = iface.functions.configure.encode([
          valueToWei(
            (params.data as PercentageTransferManagerData).maxHolderPercentage,
            PERCENTAGE_DECIMALS,
          ).toString(),
          (params.data as PercentageTransferManagerData).allowPrimaryIssuance,
        ]);
        break;
      case ModuleName.RestrictedPartialSaleTM:
        iface = new ethersUtils.Interface(RestrictedPartialSaleTMContract_3_1_0.ABI());
        data = iface.functions.configure.encode([
          (params.data as RestrictedPartialSaleTransferManagerData).treasuryWallet,
        ]);
        break;
      case ModuleName.CappedSTO:
        await this.cappedSTOAssertions(params.data as CappedSTOData);
        iface = new ethersUtils.Interface(CappedSTOContract_3_1_0.ABI());
        data = iface.functions.configure.encode([
          dateToBigNumber((params.data as CappedSTOData).startTime).toNumber(),
          dateToBigNumber((params.data as CappedSTOData).endTime).toNumber(),
          valueToWei((params.data as CappedSTOData).cap, decimals).toString(),
          valueToWei((params.data as CappedSTOData).rate, FULL_DECIMALS).toString(),
          [(params.data as CappedSTOData).fundRaiseType], // the module's configure function expects an array
          (params.data as CappedSTOData).fundsReceiver,
          (params.data as CappedSTOData).treasuryWallet,
        ]);
        break;
      case ModuleName.UsdTieredSTO:
        await this.usdTieredSTOAssertions(params.data as USDTieredSTOData);
        iface = new ethersUtils.Interface(USDTieredSTOContract_3_1_0.ABI());
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
        iface = new ethersUtils.Interface(ERC20DividendCheckpointContract_3_0_0.ABI());
        data = iface.functions.configure.encode([(params.data as DividendCheckpointData).wallet]);
        break;
      case ModuleName.EtherDividendCheckpoint:
        assert.isNonZeroETHAddressHex('Wallet', (params.data as DividendCheckpointData).wallet);
        iface = new ethersUtils.Interface(EtherDividendCheckpointContract_3_0_0.ABI());
        data = iface.functions.configure.encode([(params.data as DividendCheckpointData).wallet]);
        break;
      default:
        data = NO_MODULE_DATA;
        break;
    }
    return { maxCost, budget, data };
  }
}
