/* istanbul ignore file */
import * as conversionUtils from './utils/convert';
import { FeatureRegistryTransactionParams } from './contract_wrappers/registries/feature_registry_wrapper';
import { ModuleRegistryTransactionParams } from './contract_wrappers/registries/module_registry_wrapper';
import { PolymathRegistryTransactionParams } from './contract_wrappers/registries/polymath_registry_wrapper';
import { SecurityTokenRegistryTransactionParams } from './contract_wrappers/registries/security_token_registry_wrapper';
import { DividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/dividend_checkpoint_wrapper';
import { ERC20DividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
import { EtherDividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
import { CappedSTOTransactionParams } from './contract_wrappers/modules/sto/capped_sto_wrapper';
import { USDTieredSTOTransactionParams } from './contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
import { BlacklistTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/blacklist_transfer_manager_wrapper';
import { CountTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
import { GeneralTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
import { LockUpTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/lock_up_transfer_manager_wrapper';
import { ManualApprovalTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
import { PercentageTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
import { VolumeRestrictionTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
import { RestrictedPartialSaleTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/restricted_partial_sale_transfer_manager_wrapper';
import { VestingEscrowWalletTransactionParams } from './contract_wrappers/modules/wallet/vesting_escrow_wallet_wrapper';
import { ERC20TransactionParams } from './contract_wrappers/tokens/erc20_wrapper';
import { PolyTokenFaucetTransactionParams } from './contract_wrappers/tokens/poly_token_faucet_wrapper';
import { PolyTokenTransactionParams } from './contract_wrappers/tokens/poly_token_wrapper';
import { GeneralPermissionManagerTransactionParams } from './contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
import { SecurityTokenTransactionParams } from './contract_wrappers/tokens/security_token_wrapper';
import { AdvancedPLCRVotingCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/voting/advanced_p_l_c_r_voting_checkpoint_wrapper';

export namespace TransactionParams {
  /* eslint-disable @typescript-eslint/no-unused-vars */
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
  export import RestrictedPartialSaleTransferManager = RestrictedPartialSaleTransferManagerTransactionParams;
  export import VestingEscrowWallet = VestingEscrowWalletTransactionParams;
  export import ERC20 = ERC20TransactionParams;
  export import PolyTokenFaucet = PolyTokenFaucetTransactionParams;
  export import PolyToken = PolyTokenTransactionParams;
  export import SecurityToken = SecurityTokenTransactionParams;
  export import AdvancedPLCRVotingCheckpoint = AdvancedPLCRVotingCheckpointTransactionParams;
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export { conversionUtils };

export { default as ContractWrapper } from './contract_wrappers/contract_wrapper';
export { default as FeatureRegistry } from './contract_wrappers/registries/feature_registry_wrapper';
export { default as ModuleRegistry } from './contract_wrappers/registries/module_registry_wrapper';
export { default as PolyToken } from './contract_wrappers/tokens/poly_token_wrapper';
export { default as PolymathRegistry } from './contract_wrappers/registries/polymath_registry_wrapper';
export { default as SecurityTokenRegistry } from './contract_wrappers/registries/security_token_registry_wrapper';
export {
  ModuleFactory,
  isModuleFactory,
  ModuleFactory_3_0_0,
  isModuleFactory_3_0_0,
  ModuleFactoryEvents,
  ModuleFactoryEventArgs,
  ModuleFactoryGenerateModuleFromFactoryEventArgs,
  ModuleFactoryOwnershipTransferredEventArgs,
  ModuleFactoryChangeCostTypeEventArgs,
  ModuleFactoryChangeSTVersionBoundEventArgs,
  ModuleFactoryChangeSetupCostEventArgs,
} from './contract_wrappers/modules/module_factory_wrapper';
export {
  SecurityToken,
  isSecurityToken,
  SecurityToken_3_0_0,
  isSecurityToken_3_0_0,
  SecurityTokenEvents,
  SecurityTokenEventArgs,
  SecurityTokenApprovalEventArgs,
  SecurityTokenAuthorizedOperatorByPartitionEventArgs,
  SecurityTokenAuthorizedOperatorEventArgs,
  SecurityTokenCheckpointCreatedEventArgs,
  SecurityTokenControllerRedemptionEventArgs,
  SecurityTokenControllerTransferEventArgs,
  SecurityTokenDisableControllerEventArgs,
  SecurityTokenDocumentRemovedEventArgs,
  SecurityTokenDocumentUpdatedEventArgs,
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
} from './contract_wrappers/tokens/security_token_wrapper';
export { default as ERC20 } from './contract_wrappers/tokens/erc20_detailed_wrapper';
export {
  ERC20DividendCheckpoint,
  isERC20DividendCheckpoint,
  ERC20DividendCheckpoint_3_0_0,
  isERC20DividendCheckpoint_3_0_0,
  ERC20DividendCheckpointEvents,
  ERC20DividendCheckpointEventArgs,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs,
  ERC20DividendCheckpointPauseEventArgs,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs,
  ERC20DividendCheckpointSetWalletEventArgs,
  ERC20DividendCheckpointSetWithholdingEventArgs,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs,
  ERC20DividendCheckpointUnpauseEventArgs,
  ERC20DividendCheckpointUpdateDividendDatesEventArgs,
} from './contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
export {
  EtherDividendCheckpoint,
  isEtherDividendCheckpoint,
  EtherDividendCheckpoint_3_0_0,
  isEtherDividendCheckpoint_3_0_0,
  EtherDividendCheckpointEvents,
  EtherDividendCheckpointEventArgs,
  EtherDividendCheckpointEtherDividendClaimFailedEventArgs,
  EtherDividendCheckpointEtherDividendClaimedEventArgs,
  EtherDividendCheckpointEtherDividendDepositedEventArgs,
  EtherDividendCheckpointEtherDividendReclaimedEventArgs,
  EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs,
  EtherDividendCheckpointPauseEventArgs,
  EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs,
  EtherDividendCheckpointSetWalletEventArgs,
  EtherDividendCheckpointSetWithholdingEventArgs,
  EtherDividendCheckpointSetWithholdingFixedEventArgs,
  EtherDividendCheckpointUnpauseEventArgs,
  EtherDividendCheckpointUpdateDividendDatesEventArgs,
} from './contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
export {
  GeneralPermissionManager,
  isGeneralPermissionManager,
  GeneralPermissionManager_3_0_0,
  isGeneralPermissionManager_3_0_0,
  GeneralPermissionManager_3_1_0,
  isGeneralPermissionManager_3_1_0,
  GeneralPermissionManagerEvents,
  GeneralPermissionManagerEventArgs,
  GeneralPermissionManagerAddDelegateEventArgs,
  GeneralPermissionManagerChangePermissionEventArgs,
  GeneralPermissionManagerPauseEventArgs,
  GeneralPermissionManagerUnpauseEventArgs,
} from './contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
export {
  CappedSTO,
  isCappedSTO,
  CappedSTO_3_0_0,
  isCappedSTO_3_0_0,
  CappedSTO_3_1_0,
  isCappedSTO_3_1_0,
  CappedSTOEvents,
  CappedSTOEventArgs,
  CappedSTOAllowPreMintFlagEventArgs,
  CappedSTOPauseEventArgs,
  CappedSTOReserveTokenMintEventArgs,
  CappedSTOReserveTokenTransferEventArgs,
  CappedSTORevokePreMintFlagEventArgs,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs,
  CappedSTOTokenPurchaseEventArgs,
  CappedSTOSetFundRaiseTypesEventArgs,
  CappedSTOUnpauseEventArgs,
} from './contract_wrappers/modules/sto/capped_sto_wrapper';
export {
  USDTieredSTO,
  isUSDTieredSTO,
  USDTieredSTO_3_0_0,
  isUSDTieredSTO_3_0_0,
  USDTieredSTO_3_1_0,
  isUSDTieredSTO_3_1_0,
  USDTieredSTOEvents,
  USDTieredSTOEventArgs,
  USDTieredSTOAllowPreMintFlagEventArgs,
  USDTieredSTOPauseEventArgs,
  USDTieredSTOFundsReceivedEventArgs,
  USDTieredSTOReserveTokenMintEventArgs,
  USDTieredSTOReserveTokenTransferEventArgs,
  USDTieredSTORevokePreMintFlagEventArgs,
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
  USDTieredSTOSetOraclesEventArgs,
  USDTieredSTOUsageFeeDeductedEventArgs,
} from './contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
export {
  GeneralTransferManager,
  isGeneralTransferManager,
  GeneralTransferManager_3_0_0,
  isGeneralTransferManager_3_0_0,
  GeneralTransferManager_3_1_0,
  isGeneralTransferManager_3_1_0,
  GeneralTransferManagerEvents,
  GeneralTransferManagerEventArgs,
  GeneralTransferManagerChangeDefaultsEventArgs,
  GeneralTransferManagerChangeIssuanceAddressEventArgs,
  GeneralTransferManagerModifyInvestorFlagEventArgs,
  GeneralTransferManagerModifyKYCDataEventArgs,
  GeneralTransferManagerModifyTransferRequirementsEventArgs,
  GeneralTransferManagerPauseEventArgs,
  GeneralTransferManagerUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
export {
  CountTransferManager,
  isCountTransferManager,
  CountTransferManager_3_0_0,
  isCountTransferManager_3_0_0,
  CountTransferManagerEvents,
  CountTransferManagerEventArgs,
  CountTransferManagerModifyHolderCountEventArgs,
  CountTransferManagerPauseEventArgs,
  CountTransferManagerUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
export {
  ManualApprovalTransferManager,
  isManualApprovalTransferManager,
  ManualApprovalTransferManager_3_0_0,
  isManualApprovalTransferManager_3_0_0,
  ManualApprovalTransferManagerEvents,
  ManualApprovalTransferManagerEventArgs,
  ManualApprovalTransferManagerAddManualApprovalEventArgs,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs,
  ManualApprovalTransferManagerPauseEventArgs,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs,
  ManualApprovalTransferManagerUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
export {
  PercentageTransferManager,
  isPercentageTransferManager,
  PercentageTransferManager_3_0_0,
  isPercentageTransferManager_3_0_0,
  PercentageTransferManagerEvents,
  PercentageTransferManagerEventArgs,
  PercentageTransferManagerModifyHolderPercentageEventArgs,
  PercentageTransferManagerModifyWhitelistEventArgs,
  PercentageTransferManagerPauseEventArgs,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs,
  PercentageTransferManagerUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
export {
  LockUpTransferManager,
  isLockUpTransferManager,
  LockUpTransferManager_3_0_0,
  isLockUpTransferManager_3_0_0,
  LockUpTransferManagerEvents,
  LockUpTansferManagerEventArgs,
  LockUpTransferManagerAddLockUpToUserEventArgs,
  LockUpTransferManagerAddNewLockUpTypeEventArgs,
  LockUpTransferManagerModifyLockUpTypeEventArgs,
  LockUpTransferManagerPauseEventArgs,
  LockUpTransferManagerRemoveLockUpFromUserEventArgs,
  LockUpTransferManagerRemoveLockUpTypeEventArgs,
  LockUpTransferManagerUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/lock_up_transfer_manager_wrapper';
export {
  BlacklistTransferManager,
  isBlacklistTransferManager,
  BlacklistTransferManager_3_0_0,
  isBlacklistTransferManager_3_0_0,
  BlacklistTransferManagerEvents,
  BlacklistTransferManagerEventArgs,
  BlacklistTransferManagerAddBlacklistTypeEventArgs,
  BlacklistTransferManagerAddInvestorToBlacklistEventArgs,
  BlacklistTransferManagerDeleteBlacklistTypeEventArgs,
  BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs,
  BlacklistTransferManagerModifyBlacklistTypeEventArgs,
  BlacklistTransferManagerPauseEventArgs,
  BlacklistTransferManagerUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/blacklist_transfer_manager_wrapper';
export {
  VolumeRestrictionTransferManager,
  isVolumeRestrictionTransferManager,
  VolumeRestrictionTransferManager_3_0_0,
  isVolumeRestrictionTransferManager_3_0_0,
  VolumeRestrictionTMEvents,
  VolumeRestrictionTMEventArgs,
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
} from './contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
export {
  RestrictedPartialSaleTransferManager,
  isRestrictedPartialSaleTransferManager,
  RestrictedPartialSaleTransferManager_3_1_0,
  isRestrictedPartialSaleTransferManager_3_1_0,
  RestrictedPartialSaleTransferManagerEvents,
  RestrictedPartialSaleTransferManagerEventArgs,
  RestrictedPartialSaleTMChangedExemptWalletListEventArgs,
  RestrictedPartialSaleTMPauseEventArgs,
  RestrictedPartialSaleTMUnpauseEventArgs,
} from './contract_wrappers/modules/transfer_manager/restricted_partial_sale_transfer_manager_wrapper';
export {
  AdvancedPLCRVotingCheckpoint,
  isAdvancedPLCRVotingCheckpoint,
  AdvancedPLCRVotingCheckpoint_3_1_0,
  isAdvancedPLCRVotingCheckpoint_3_1_0,
  AdvancedPLCRVotingCheckpointEventArgs,
  AdvancedPLCRVotingCheckpointEvents,
  AdvancedPLCRVotingCheckpointStatutoryBallotCreatedEventArgs,
  AdvancedPLCRVotingCheckpointCumulativeBallotCreatedEventArgs,
  AdvancedPLCRVotingCheckpointVotersExemptedEventArgs,
  AdvancedPLCRVotingCheckpointVoteCommitEventArgs,
  AdvancedPLCRVotingCheckpointVoteRevealedEventArgs,
  AdvancedPLCRVotingCheckpointBallotCancelledEventArgs,
  AdvancedPLCRVotingCheckpointChangedBallotExemptedVotersListEventArgs,
  AdvancedPLCRVotingCheckpointChangedDefaultExemptedVotersListEventArgs,
  AdvancedPLCRVotingCheckpointPauseEventArgs,
  AdvancedPLCRVotingCheckpointUnpauseEventArgs,
} from './contract_wrappers/modules/checkpoint/voting/advanced_p_l_c_r_voting_checkpoint_wrapper';
export {
  VestingEscrowWallet,
  isVestingEscrowWallet,
  VestingEscrowWallet_3_0_0,
  isVestingEscrowWallet_3_0_0,
  VestingEscrowWallet_3_1_0,
  isVestingEscrowWallet_3_1_0,
  VestingEscrowWalletEvents,
  VestingEscrowWalletEventArgs,
  VestingEscrowWalletAddScheduleEventArgs,
  VestingEscrowWalletAddTemplateEventArgs,
  VestingEscrowWalletDepositTokensEventArgs,
  VestingEscrowWalletModifyScheduleEventArgs,
  VestingEscrowWalletPauseEventArgs,
  VestingEscrowWalletRemoveTemplateEventArgs,
  VestingEscrowWalletRevokeAllSchedulesEventArgs,
  VestingEscrowWalletRevokeScheduleEventArgs,
  VestingEscrowWalletSendToTreasuryEventArgs,
  VestingEscrowWalletSendTokensEventArgs,
  VestingEscrowWalletTreasuryWalletChangedEventArgs,
  VestingEscrowWalletUnpauseEventArgs,
} from './contract_wrappers/modules/wallet/vesting_escrow_wallet_wrapper';
export * from './types';
export { PolymathAPI } from './PolymathAPI';
export {
  PolyResponse,
  BlockParamLiteral,
  TransactionReceiptWithDecodedLogs,
  LogEntry,
  LogWithDecodedArgs,
  DecodedLogArgs,
  Provider,
  Web3Wrapper,
  BigNumber,
  PolyTokenContract_3_0_0 as PolyTokenContract,
  PolyTokenEventArgs_3_0_0 as PolyTokenEventArgs,
  PolyTokenFaucetEventArgs_3_0_0 as PolyTokenFaucetEventArgs,
  PolyTokenEvents_3_0_0 as PolyTokenEvents,
  PolyTokenApprovalEventArgs_3_0_0 as PolyTokenApprovalEventArgs,
  PolyTokenTransferEventArgs_3_0_0 as PolyTokenTransferEventArgs,
  PolyTokenFaucetContract_3_0_0 as PolyTokenFaucetContract,
  PolyTokenFaucetEvents_3_0_0 as PolyTokenFaucetEvents,
  PolyTokenFaucetApprovalEventArgs_3_0_0 as PolyTokenFaucetApprovalEventArgs,
  PolyTokenFaucetTransferEventArgs_3_0_0 as PolyTokenFaucetTransferEventArgs,
  PolymathRegistryContract_3_0_0 as PolymathRegistryContract,
  PolymathRegistryEventArgs_3_0_0 as PolymathRegistryEventArgs,
  PolymathRegistryEvents_3_0_0 as PolymathRegistryEvents,
  PolymathRegistryChangeAddressEventArgs_3_0_0 as PolymathRegistryChangeAddressEventArgs,
  PolymathRegistryOwnershipTransferredEventArgs_3_0_0 as PolymathRegistryOwnershipTransferredEventArgs,
  ModuleRegistryContract_3_0_0 as ModuleRegistryContract,
  ModuleRegistryEventArgs_3_0_0 as ModuleRegistryEventArgs,
  ModuleRegistryEvents_3_0_0 as ModuleRegistryEvents,
  ModuleRegistryModuleRegisteredEventArgs_3_0_0 as ModuleRegistryModuleRegisteredEventArgs,
  ModuleRegistryModuleRemovedEventArgs_3_0_0 as ModuleRegistryModuleRemovedEventArgs,
  ModuleRegistryModuleUsedEventArgs_3_0_0 as ModuleRegistryModuleUsedEventArgs,
  ModuleRegistryModuleVerifiedEventArgs_3_0_0 as ModuleRegistryModuleVerifiedEventArgs,
  ModuleRegistryOwnershipTransferredEventArgs_3_0_0 as ModuleRegistryOwnershipTransferredEventArgs,
  ModuleRegistryPauseEventArgs_3_0_0 as ModuleRegistryPauseEventArgs,
  ModuleRegistryUnpauseEventArgs_3_0_0 as ModuleRegistryUnpauseEventArgs,
  ModuleRegistryModuleUnverifiedEventArgs_3_0_0 as ModuleRegistryModuleUnverifiedEventArgs,
  FeatureRegistryContract_3_0_0 as FeatureRegistryContract,
  FeatureRegistryEventArgs_3_0_0 as FeatureRegistryEventArgs,
  FeatureRegistryEvents_3_0_0 as FeatureRegistryEvents,
  FeatureRegistryChangeFeatureStatusEventArgs_3_0_0 as FeatureRegistryChangeFeatureStatusEventArgs,
  FeatureRegistryOwnershipTransferredEventArgs_3_0_0 as FeatureRegistryOwnershipTransferredEventArgs,
  ISecurityTokenRegistryContract_3_0_0 as SecurityTokenRegistryContract,
  ISecurityTokenRegistryEvents_3_0_0 as SecurityTokenRegistryEvents,
  ISecurityTokenRegistryEventArgs_3_0_0 as SecurityTokenRegistryEventArgs,
  ISecurityTokenRegistryChangeExpiryLimitEventArgs_3_0_0 as SecurityTokenRegistryChangeExpiryLimitEventArgs,
  ISecurityTokenRegistryChangeSecurityLaunchFeeEventArgs_3_0_0 as SecurityTokenRegistryChangeSecurityLaunchFeeEventArgs,
  ISecurityTokenRegistryChangeTickerRegistrationFeeEventArgs_3_0_0 as SecurityTokenRegistryChangeTickerRegistrationFeeEventArgs,
  ISecurityTokenRegistryNewSecurityTokenEventArgs_3_0_0 as SecurityTokenRegistryNewSecurityTokenEventArgs,
  ISecurityTokenRegistryOwnershipTransferredEventArgs_3_0_0 as SecurityTokenRegistryOwnershipTransferredEventArgs,
  ISecurityTokenRegistryPauseEventArgs_3_0_0 as SecurityTokenRegistryPauseEventArgs,
  ISecurityTokenRegistryUnpauseEventArgs_3_0_0 as SecurityTokenRegistryUnpauseEventArgs,
  ISecurityTokenRegistryRegisterTickerEventArgs_3_0_0 as SecurityTokenRegistryRegisterTickerEventArgs,
  ISecurityTokenRegistryTickerRemovedEventArgs_3_0_0 as SecurityTokenRegistryTickerRemovedEventArgs,
  ISecurityTokenRegistryChangeTickerOwnershipEventArgs_3_0_0 as SecurityTokenRegistryChangeTickerOwnershipEventArgs,
  ISecurityTokenRegistryChangeFeeCurrencyEventArgs_3_0_0 as SecurityTokenRegistryChangeFeeCurrencyEventArgs,
  ISecurityTokenRegistrySecurityTokenRefreshedEventArgs_3_0_0 as SecurityTokenRegistrySecurityTokenRefreshedEventArgs,
  ISecurityTokenRegistryProtocolFactorySetEventArgs_3_0_0 as SecurityTokenRegistryProtocolFactorySetEventArgs,
  ISecurityTokenRegistryLatestVersionSetEventArgs_3_0_0 as SecurityTokenRegistryLatestVersionSetEventArgs,
  ISecurityTokenRegistryProtocolFactoryRemovedEventArgs_3_0_0 as SecurityTokenRegistryProtocolFactoryRemovedEventArgs,
  ISecurityTokenContract_3_0_0 as SecurityTokenContract_3_0_0,
  GeneralTransferManagerContract_3_0_0,
  GeneralTransferManagerContract_3_1_0,
  GeneralPermissionManagerContract_3_0_0,
  GeneralPermissionManagerContract_3_1_0,
  ERC20DividendCheckpointContract_3_0_0,
  EtherDividendCheckpointContract_3_0_0,
  CappedSTOContract_3_0_0,
  CappedSTOContract_3_1_0,
  USDTieredSTOContract_3_0_0,
  USDTieredSTOContract_3_1_0,
  ManualApprovalTransferManagerContract_3_0_0,
  PercentageTransferManagerContract_3_0_0,
  LockUpTransferManagerContract_3_0_0,
  BlacklistTransferManagerContract_3_0_0,
  CountTransferManagerContract_3_0_0,
  VolumeRestrictionTMContract_3_0_0,
  RestrictedPartialSaleTMContract_3_1_0,
  VestingEscrowWalletContract_3_0_0,
  VestingEscrowWalletContract_3_1_0,
} from '@polymathnetwork/abi-wrappers';
