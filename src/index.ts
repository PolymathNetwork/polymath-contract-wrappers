/* istanbul ignore file */
import * as conversionUtils from './utils/convert';
import { FeatureRegistryTransactionParams } from './contract_wrappers/registries/feature_registry_wrapper';
import { ModuleRegistryTransactionParams } from './contract_wrappers/registries/module_registry_wrapper';
import { PolymathRegistryTransactionParams } from './contract_wrappers/registries/polymath_registry_wrapper';
import { SecurityTokenRegistryTransactionParams } from './contract_wrappers/registries/security_token_registry_wrapper';
import { DividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/dividend_checkpoint_wrapper';
import { ERC20DividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
import { EtherDividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
import { GeneralPermissionManagerTransactionParams } from './contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
import { CappedSTOTransactionParams } from './contract_wrappers/modules/sto/capped_sto_wrapper';
import { USDTieredSTOTransactionParams } from './contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
import { BlacklistTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/blacklist_transfer_manager_wrapper';
import { CountTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
import { GeneralTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
import { LockUpTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/lock_up_transfer_manager_wrapper';
import { ManualApprovalTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
import { PercentageTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
import { VolumeRestrictionTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
import { VestingEscrowWalletTransactionParams } from './contract_wrappers/modules/wallet/vesting_escrow_wallet_wrapper';
import { ERC20TransactionParams } from './contract_wrappers/tokens/erc20_wrapper';
import { PolyTokenFaucetTransactionParams } from './contract_wrappers/tokens/poly_token_faucet_wrapper';
import { PolyTokenTransactionParams } from './contract_wrappers/tokens/poly_token_wrapper';
import { SecurityTokenTransactionParams } from './contract_wrappers/tokens/security_token_wrapper';

export namespace TransactionParams {
  export import FeatureRegistry = FeatureRegistryTransactionParams;
  export import ModuleRegistry = ModuleRegistryTransactionParams;
  export import PolymathRegistry = PolymathRegistryTransactionParams;
  export import SecurityTokenRegistry = SecurityTokenRegistryTransactionParams;
  export import DividendCheckpoint = DividendCheckpointTransactionParams;
  export import ERC20DividendCheckpoint = ERC20DividendCheckpointTransactionParams;
  export import EtherDividendCheckpoint = EtherDividendCheckpointTransactionParams;
  export import GeneralPermissionManager = GeneralPermissionManagerTransactionParams;
  export import CappedSTO = CappedSTOTransactionParams;
  export import USDTieredSTO = USDTieredSTOTransactionParams;
  export import BlacklistTransferManager = BlacklistTransferManagerTransactionParams;
  export import CountTransferManager = CountTransferManagerTransactionParams;
  export import GeneralTransferManager = GeneralTransferManagerTransactionParams;
  export import LockUpTransferManager = LockUpTransferManagerTransactionParams;
  export import ManualApprovalTransferManager = ManualApprovalTransferManagerTransactionParams;
  export import PercentageTransferManager = PercentageTransferManagerTransactionParams;
  export import VolumeRestrictionTransferManager = VolumeRestrictionTransferManagerTransactionParams;
  export import VestingEscrowWallet = VestingEscrowWalletTransactionParams;
  export import ERC20 = ERC20TransactionParams;
  export import PolyTokenFaucet = PolyTokenFaucetTransactionParams;
  export import PolyToken = PolyTokenTransactionParams;
  export import SecurityToken = SecurityTokenTransactionParams;
}

export { conversionUtils };
export { default as ContractWrapper } from './contract_wrappers/contract_wrapper';
export { default as FeatureRegistry } from './contract_wrappers/registries/feature_registry_wrapper';
export { default as ModuleFactory } from './contract_wrappers/modules/module_factory_wrapper';
export { default as ModuleRegistry } from './contract_wrappers/registries/module_registry_wrapper';
export { default as PolyToken } from './contract_wrappers/tokens/poly_token_wrapper';
export { default as PolymathRegistry } from './contract_wrappers/registries/polymath_registry_wrapper';
export { default as SecurityTokenRegistry } from './contract_wrappers/registries/security_token_registry_wrapper';
export { default as SecurityToken } from './contract_wrappers/tokens/security_token_wrapper';
export { default as ERC20 } from './contract_wrappers/tokens/erc20_detailed_wrapper';
export {
  default as ERC20DividendCheckpoint,
} from './contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
export {
  default as EtherDividendCheckpoint,
} from './contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
export {
  default as GeneralPermissionManager,
} from './contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
export { default as CappedSTO } from './contract_wrappers/modules/sto/capped_sto_wrapper';
export { default as USDTieredSTO } from './contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
export {
  default as CountTransferManager,
} from './contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
export {
  default as GeneralTransferManager,
} from './contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
export {
  default as ManualApprovalTransferManager,
} from './contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
export {
  default as PercentageTransferManager,
} from './contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
export {
  default as LockUpTransferManager,
} from './contract_wrappers/modules/transfer_manager/lock_up_transfer_manager_wrapper';
export {
  default as BlacklistTransferManager,
} from './contract_wrappers/modules/transfer_manager/blacklist_transfer_manager_wrapper';
export {
  default as VolumeRestrictionTransferManager,
} from './contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
export * from './types';
export { PolymathAPI } from './PolymathAPI';
export {
  PolyResponse,
  PolyTokenContract,
  PolyTokenEventArgs,
  PolyTokenFaucetEventArgs,
  PolyTokenEvents,
  PolyTokenApprovalEventArgs,
  PolyTokenTransferEventArgs,
  PolyTokenFaucetContract,
  PolyTokenFaucetEvents,
  PolyTokenFaucetApprovalEventArgs,
  PolyTokenFaucetTransferEventArgs,
  PolymathRegistryContract,
  PolymathRegistryEventArgs,
  PolymathRegistryEvents,
  PolymathRegistryChangeAddressEventArgs,
  PolymathRegistryOwnershipTransferredEventArgs,
  SecurityTokenRegistryContract,
  SecurityTokenRegistryEventArgs,  
  SecurityTokenRegistryEvents,
  SecurityTokenRegistryPauseEventArgs,
  SecurityTokenRegistryUnpauseEventArgs,
  SecurityTokenRegistryTickerRemovedEventArgs,
  SecurityTokenRegistryChangeExpiryLimitEventArgs,
  SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs,
  SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs,
  SecurityTokenRegistryOwnershipTransferredEventArgs,
  SecurityTokenRegistryChangeTickerOwnershipEventArgs,
  SecurityTokenRegistryNewSecurityTokenEventArgs,
  SecurityTokenRegistryRegisterTickerEventArgs,
  SecurityTokenRegistryChangeFeeCurrencyEventArgs,
  SecurityTokenRegistryLatestVersionSetEventArgs,
  SecurityTokenRegistryProtocolFactoryRemovedEventArgs,
  SecurityTokenRegistryProtocolFactorySetEventArgs,
  SecurityTokenRegistrySecurityTokenRefreshedEventArgs,
  ModuleRegistryContract,
  ModuleRegistryEventArgs,
  ModuleRegistryEvents,
  ModuleRegistryModuleRegisteredEventArgs,
  ModuleRegistryModuleRemovedEventArgs,
  ModuleRegistryModuleUsedEventArgs,
  ModuleRegistryModuleVerifiedEventArgs,
  ModuleRegistryOwnershipTransferredEventArgs,
  ModuleRegistryPauseEventArgs,
  ModuleRegistryUnpauseEventArgs,
  ModuleRegistryModuleUnverifiedEventArgs,
  FeatureRegistryContract,
  FeatureRegistryEventArgs,
  FeatureRegistryEvents,
  FeatureRegistryChangeFeatureStatusEventArgs,
  FeatureRegistryOwnershipTransferredEventArgs,
  ISecurityTokenContract,
  SecurityTokenEventArgs,
  SecurityTokenEvents,
  SecurityTokenModuleAddedEventArgs,
  SecurityTokenModuleUpgradedEventArgs,
  SecurityTokenUpdateTokenDetailsEventArgs,
  SecurityTokenUpdateTokenNameEventArgs,
  SecurityTokenGranularityChangedEventArgs,
  SecurityTokenFreezeIssuanceEventArgs,
  SecurityTokenFreezeTransfersEventArgs,
  SecurityTokenCheckpointCreatedEventArgs,
  SecurityTokenSetControllerEventArgs,
  SecurityTokenTreasuryWalletChangedEventArgs,
  SecurityTokenDisableControllerEventArgs,
  SecurityTokenOwnershipTransferredEventArgs,
  SecurityTokenTokenUpgradedEventArgs,
  SecurityTokenModuleArchivedEventArgs,
  SecurityTokenModuleUnarchivedEventArgs,
  SecurityTokenModuleRemovedEventArgs,
  SecurityTokenModuleBudgetChangedEventArgs,
  SecurityTokenTransferByPartitionEventArgs,
  SecurityTokenAuthorizedOperatorEventArgs,
  SecurityTokenRevokedOperatorEventArgs,
  SecurityTokenAuthorizedOperatorByPartitionEventArgs,
  SecurityTokenRevokedOperatorByPartitionEventArgs,
  SecurityTokenIssuedByPartitionEventArgs,
  SecurityTokenRedeemedByPartitionEventArgs,
  SecurityTokenControllerTransferEventArgs,
  SecurityTokenControllerRedemptionEventArgs,
  SecurityTokenDocumentRemovedEventArgs,
  SecurityTokenDocumentUpdatedEventArgs,
  SecurityTokenIssuedEventArgs,
  SecurityTokenRedeemedEventArgs,
  SecurityTokenTransferEventArgs,
  SecurityTokenApprovalEventArgs,
  GeneralTransferManagerContract,
  GeneralTransferManagerEventArgs,
  GeneralTransferManagerEvents,
  GeneralTransferManagerChangeIssuanceAddressEventArgs,
  GeneralTransferManagerChangeDefaultsEventArgs,
  GeneralTransferManagerPauseEventArgs,
  GeneralTransferManagerUnpauseEventArgs,
  GeneralTransferManagerModifyKYCDataEventArgs,
  GeneralTransferManagerModifyInvestorFlagEventArgs,
  GeneralTransferManagerModifyTransferRequirementsEventArgs,
  GeneralPermissionManagerContract,
  GeneralPermissionManagerEventArgs,
  GeneralPermissionManagerEvents,
  GeneralPermissionManagerChangePermissionEventArgs,
  GeneralPermissionManagerAddDelegateEventArgs,
  GeneralPermissionManagerPauseEventArgs,
  GeneralPermissionManagerUnpauseEventArgs,
  ERC20DividendCheckpointContract,
  ERC20DividendCheckpointEventArgs,
  ERC20DividendCheckpointEvents,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs,
  ERC20DividendCheckpointSetWithholdingEventArgs,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs,
  ERC20DividendCheckpointPauseEventArgs,
  ERC20DividendCheckpointSetWalletEventArgs,
  ERC20DividendCheckpointUnpauseEventArgs,
  ERC20DividendCheckpointUpdateDividendDatesEventArgs,
  CappedSTOContract,
  CappedSTOEventArgs,
  CappedSTOEvents,
  CappedSTOPauseEventArgs,
  CappedSTOUnpauseEventArgs,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs,
  CappedSTOTokenPurchaseEventArgs,
  CappedSTOSetFundRaiseTypesEventArgs,
  USDTieredSTOContract,
  USDTieredSTOEventArgs,
  USDTieredSTOEvents,
  USDTieredSTOFundsReceivedEventArgs,
  USDTieredSTOPauseEventArgs,
  USDTieredSTOReserveTokenMintEventArgs,
  USDTieredSTOSetAddressesEventArgs,
  USDTieredSTOSetAllowBeneficialInvestmentsEventArgs,
  USDTieredSTOSetFundRaiseTypesEventArgs,
  USDTieredSTOSetLimitsEventArgs,
  USDTieredSTOSetNonAccreditedLimitEventArgs,
  USDTieredSTOSetTiersEventArgs,
  USDTieredSTOSetTimesEventArgs,
  USDTieredSTOSetTreasuryWalletEventArgs,
  USDTieredSTOTokenPurchaseEventArgs,
  USDTieredSTOUnpauseEventArgs,
  ManualApprovalTransferManagerContract,
  ManualApprovalTransferManagerEventArgs,
  ManualApprovalTransferManagerEvents,
  ManualApprovalTransferManagerAddManualApprovalEventArgs,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
  ManualApprovalTransferManagerPauseEventArgs,
  ManualApprovalTransferManagerUnpauseEventArgs,
  PercentageTransferManagerContract,
  PercentageTransferManagerEventArgs,
  PercentageTransferManagerEvents,
  PercentageTransferManagerModifyHolderPercentageEventArgs,
  PercentageTransferManagerModifyWhitelistEventArgs,
  PercentageTransferManagerPauseEventArgs,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs,
  PercentageTransferManagerUnpauseEventArgs,
  LockUpTransferManagerContract,
  LockUpTransferManagerEventArgs,
  LockUpTransferManagerEvents,
  LockUpTransferManagerAddLockUpToUserEventArgs,
  LockUpTransferManagerRemoveLockUpFromUserEventArgs,
  LockUpTransferManagerModifyLockUpTypeEventArgs,
  LockUpTransferManagerAddNewLockUpTypeEventArgs,
  LockUpTransferManagerRemoveLockUpTypeEventArgs,
  LockUpTransferManagerPauseEventArgs,
  LockUpTransferManagerUnpauseEventArgs,
  BlacklistTransferManagerContract,
  BlacklistTransferManagerEventArgs,
  BlacklistTransferManagerEvents,
  BlacklistTransferManagerAddBlacklistTypeEventArgs,
  BlacklistTransferManagerModifyBlacklistTypeEventArgs,
  BlacklistTransferManagerDeleteBlacklistTypeEventArgs,
  BlacklistTransferManagerAddInvestorToBlacklistEventArgs,
  BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs,
  BlacklistTransferManagerPauseEventArgs,
  BlacklistTransferManagerUnpauseEventArgs,
  CountTransferManagerContract,
  CountTransferManagerEventArgs,
  CountTransferManagerEvents,
  CountTransferManagerModifyHolderCountEventArgs,
  CountTransferManagerPauseEventArgs,
  CountTransferManagerUnpauseEventArgs,
  EtherDividendCheckpointContract,
  EtherDividendCheckpointEventArgs,
  EtherDividendCheckpointEvents,
  EtherDividendCheckpointEtherDividendDepositedEventArgs,
  EtherDividendCheckpointEtherDividendClaimedEventArgs,
  EtherDividendCheckpointEtherDividendReclaimedEventArgs,
  EtherDividendCheckpointEtherDividendClaimFailedEventArgs,
  EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs,
  EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs,
  EtherDividendCheckpointSetWithholdingEventArgs,
  EtherDividendCheckpointSetWithholdingFixedEventArgs,
  EtherDividendCheckpointSetWalletEventArgs,
  EtherDividendCheckpointUpdateDividendDatesEventArgs,
  EtherDividendCheckpointPauseEventArgs,
  EtherDividendCheckpointUnpauseEventArgs,
  VolumeRestrictionTMContract,
  VolumeRestrictionTMEventArgs,
  VolumeRestrictionTMEvents,
  VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs,
  VolumeRestrictionTMAddDefaultRestrictionEventArgs,
  VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs,
  VolumeRestrictionTMAddIndividualRestrictionEventArgs,
  VolumeRestrictionTMChangedExemptWalletListEventArgs,
  VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs,
  VolumeRestrictionTMDefaultRestrictionRemovedEventArgs,
  VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs,
  VolumeRestrictionTMIndividualRestrictionRemovedEventArgs,
  VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs,
  VolumeRestrictionTMModifyDefaultRestrictionEventArgs,
  VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs,
  VolumeRestrictionTMModifyIndividualRestrictionEventArgs,
  VolumeRestrictionTMPauseEventArgs,
  VolumeRestrictionTMUnpauseEventArgs,
  BlockParamLiteral,
  TransactionReceiptWithDecodedLogs,
  LogEntry,
  LogWithDecodedArgs,
  DecodedLogArgs,
  Provider,
  Web3Wrapper,
  BigNumber,
} from '@polymathnetwork/abi-wrappers';
