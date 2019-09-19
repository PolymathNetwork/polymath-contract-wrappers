/* istanbul ignore file */
import * as conversionUtils from './utils/convert';
// import { FeatureRegistryTransactionParams } from './contract_wrappers/registries/feature_registry_wrapper';
// import { ModuleRegistryTransactionParams } from './contract_wrappers/registries/module_registry_wrapper';
// import { PolymathRegistryTransactionParams } from './contract_wrappers/registries/polymath_registry_wrapper';
// import { SecurityTokenRegistryTransactionParams } from './contract_wrappers/registries/security_token_registry_wrapper';
// import { DividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/dividend_checkpoint_wrapper';
// import { ERC20DividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
// import { EtherDividendCheckpointTransactionParams } from './contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
// import { GeneralPermissionManagerTransactionParams } from './contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
// import { CappedSTOTransactionParams } from './contract_wrappers/modules/sto/capped_sto_wrapper';
// import { USDTieredSTOTransactionParams } from './contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
// import { BlacklistTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/blacklist_transfer_manager_wrapper';
// import { CountTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
// import { GeneralTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
// import { LockUpTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/lock_up_transfer_manager_wrapper';
// import { ManualApprovalTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/manual_approval_transfer_manager_wrapper';
// import { PercentageTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/percentage_transfer_manager_wrapper';
// import { VolumeRestrictionTransferManagerTransactionParams } from './contract_wrappers/modules/transfer_manager/volume_restriction_transfer_manager_wrapper';
// import { VestingEscrowWalletTransactionParams } from './contract_wrappers/modules/wallet/vesting_escrow_wallet_wrapper';
// import { ERC20TransactionParams } from './contract_wrappers/tokens/erc20_wrapper';
// import { PolyTokenFaucetTransactionParams } from './contract_wrappers/tokens/poly_token_faucet_wrapper';
// import { PolyTokenTransactionParams } from './contract_wrappers/tokens/poly_token_wrapper';
// import { SecurityTokenTransactionParams } from './contract_wrappers/tokens/security_token_wrapper';

// export namespace TransactionParams {
//   export import FeatureRegistry = FeatureRegistryTransactionParams;
//   export import ModuleRegistry = ModuleRegistryTransactionParams;
//   export import PolymathRegistry = PolymathRegistryTransactionParams;
//   export import SecurityTokenRegistry = SecurityTokenRegistryTransactionParams;
//   export import DividendCheckpoint = DividendCheckpointTransactionParams;
//   export import ERC20DividendCheckpoint = ERC20DividendCheckpointTransactionParams;
//   export import EtherDividendCheckpoint = EtherDividendCheckpointTransactionParams;
//   export import GeneralPermissionManager = GeneralPermissionManagerTransactionParams;
//   export import CappedSTO = CappedSTOTransactionParams;
//   export import USDTieredSTO = USDTieredSTOTransactionParams;
//   export import BlacklistTransferManager = BlacklistTransferManagerTransactionParams;
//   export import CountTransferManager = CountTransferManagerTransactionParams;
//   export import GeneralTransferManager = GeneralTransferManagerTransactionParams;
//   export import LockUpTransferManager = LockUpTransferManagerTransactionParams;
//   export import ManualApprovalTransferManager = ManualApprovalTransferManagerTransactionParams;
//   export import PercentageTransferManager = PercentageTransferManagerTransactionParams;
//   export import VolumeRestrictionTransferManager = VolumeRestrictionTransferManagerTransactionParams;
//   export import VestingEscrowWallet = VestingEscrowWalletTransactionParams;
//   export import ERC20 = ERC20TransactionParams;
//   export import PolyTokenFaucet = PolyTokenFaucetTransactionParams;
//   export import PolyToken = PolyTokenTransactionParams;
//   export import SecurityToken = SecurityTokenTransactionParams;
// }

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
  ERC20DividendCheckpoint,
  ERC20DividendCheckpoint_3_0_0,
  isERC20DividendCheckpoint_3_0_0,
} from './contract_wrappers/modules/checkpoint/erc20_dividend_checkpoint_wrapper';
export {
  EtherDividendCheckpoint,
  EtherDividendCheckpoint_3_0_0,
  isEtherDividendCheckpoint_3_0_0,
} from './contract_wrappers/modules/checkpoint/ether_dividend_checkpoint_wrapper';
export {
  GeneralPermissionManager,
  GeneralPermissionManager_3_0_0,
  isGeneralPermissionManager_3_0_0,
  GeneralPermissionManager_3_1_0,
  isGeneralPermissionManager_3_1_0,
} from './contract_wrappers/modules/permission_manager/general_permission_manager_wrapper';
export {
  CappedSTO,
  CappedSTO_3_0_0,
  isCappedSTO_3_0_0,
  CappedSTO_3_1_0,
  isCappedSTO_3_1_0,
} from './contract_wrappers/modules/sto/capped_sto_wrapper';
export {
  USDTieredSTO,
  USDTieredSTO_3_0_0,
  isUSDTieredSTO_3_0_0,
  USDTieredSTO_3_1_0,
  isUSDTieredSTO_3_1_0,
} from './contract_wrappers/modules/sto/usd_tiered_sto_wrapper';
export {
  GeneralTransferManager,
  GeneralTransferManager_3_0_0,
  isGeneralTransferManager_3_0_0,
  GeneralTransferManager_3_1_0,
  isGeneralTransferManager_3_1_0,
} from './contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper';
export {
  default as CountTransferManager,
} from './contract_wrappers/modules/transfer_manager/count_transfer_manager_wrapper';
export {
  ManualApprovalTransferManager,
  ManualApprovalTransferManager_3_0_0,
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
export {
  VestingEscrowWallet,
  VestingEscrowWallet_3_0_0,
  isVestingEscrowWallet_3_0_0,
  VestingEscrowWallet_3_1_0,
  isVestingEscrowWallet_3_1_0,
} from './contract_wrappers/modules/wallet/vesting_escrow_wallet_wrapper';
export * from './types';
export { PolymathAPI } from './PolymathAPI';
export {
  PolyResponse,
  PolyTokenContract_3_0_0,
  PolyTokenEventArgs_3_0_0,
  PolyTokenFaucetEventArgs_3_0_0,
  PolyTokenEvents_3_0_0,
  PolyTokenApprovalEventArgs_3_0_0,
  PolyTokenTransferEventArgs_3_0_0,
  PolyTokenFaucetContract_3_0_0,
  PolyTokenFaucetEvents_3_0_0,
  PolyTokenFaucetApprovalEventArgs_3_0_0,
  PolyTokenFaucetTransferEventArgs_3_0_0,
  PolymathRegistryContract_3_0_0,
  PolymathRegistryEventArgs_3_0_0,
  PolymathRegistryEvents_3_0_0,
  PolymathRegistryChangeAddressEventArgs_3_0_0,
  PolymathRegistryOwnershipTransferredEventArgs_3_0_0,
  ModuleRegistryContract_3_0_0,
  ModuleRegistryEventArgs_3_0_0,
  ModuleRegistryEvents_3_0_0,
  ModuleRegistryModuleRegisteredEventArgs_3_0_0,
  ModuleRegistryModuleRemovedEventArgs_3_0_0,
  ModuleRegistryModuleUsedEventArgs_3_0_0,
  ModuleRegistryModuleVerifiedEventArgs_3_0_0,
  ModuleRegistryOwnershipTransferredEventArgs_3_0_0,
  ModuleRegistryPauseEventArgs_3_0_0,
  ModuleRegistryUnpauseEventArgs_3_0_0,
  ModuleRegistryModuleUnverifiedEventArgs_3_0_0,
  FeatureRegistryContract_3_0_0,
  FeatureRegistryEventArgs_3_0_0,
  FeatureRegistryEvents_3_0_0,
  FeatureRegistryChangeFeatureStatusEventArgs_3_0_0,
  FeatureRegistryOwnershipTransferredEventArgs_3_0_0,
  ISecurityTokenContract_3_0_0,
  GeneralTransferManagerContract_3_0_0,
  GeneralTransferManagerEventArgs_3_0_0,
  GeneralTransferManagerEvents_3_0_0,
  GeneralTransferManagerChangeIssuanceAddressEventArgs_3_0_0,
  GeneralTransferManagerChangeDefaultsEventArgs_3_0_0,
  GeneralTransferManagerPauseEventArgs_3_0_0,
  GeneralTransferManagerUnpauseEventArgs_3_0_0,
  GeneralTransferManagerModifyKYCDataEventArgs_3_0_0,
  GeneralTransferManagerModifyInvestorFlagEventArgs_3_0_0,
  GeneralTransferManagerModifyTransferRequirementsEventArgs_3_0_0,
  GeneralPermissionManagerContract_3_0_0,
  GeneralPermissionManagerEventArgs_3_0_0,
  GeneralPermissionManagerEvents_3_0_0,
  GeneralPermissionManagerChangePermissionEventArgs_3_0_0,
  GeneralPermissionManagerAddDelegateEventArgs_3_0_0,
  GeneralPermissionManagerPauseEventArgs_3_0_0,
  GeneralPermissionManagerUnpauseEventArgs_3_0_0,
  ERC20DividendCheckpointContract_3_0_0,
  ERC20DividendCheckpointEventArgs_3_0_0,
  ERC20DividendCheckpointEvents_3_0_0,
  ERC20DividendCheckpointERC20DividendDepositedEventArgs_3_0_0,
  ERC20DividendCheckpointERC20DividendClaimedEventArgs_3_0_0,
  ERC20DividendCheckpointERC20DividendReclaimedEventArgs_3_0_0,
  ERC20DividendCheckpointERC20DividendWithholdingWithdrawnEventArgs_3_0_0,
  ERC20DividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0,
  ERC20DividendCheckpointSetWithholdingEventArgs_3_0_0,
  ERC20DividendCheckpointSetWithholdingFixedEventArgs_3_0_0,
  ERC20DividendCheckpointPauseEventArgs_3_0_0,
  ERC20DividendCheckpointSetWalletEventArgs_3_0_0,
  ERC20DividendCheckpointUnpauseEventArgs_3_0_0,
  ERC20DividendCheckpointUpdateDividendDatesEventArgs_3_0_0,
  CappedSTOContract_3_0_0,
  CappedSTOEventArgs_3_0_0,
  CappedSTOEvents_3_0_0,
  CappedSTOPauseEventArgs_3_0_0,
  CappedSTOUnpauseEventArgs_3_0_0,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0,
  CappedSTOTokenPurchaseEventArgs_3_0_0,
  CappedSTOSetFundRaiseTypesEventArgs_3_0_0,
  USDTieredSTOContract_3_0_0,
  USDTieredSTOEventArgs_3_0_0,
  USDTieredSTOEvents_3_0_0,
  USDTieredSTOFundsReceivedEventArgs_3_0_0,
  USDTieredSTOPauseEventArgs_3_0_0,
  USDTieredSTOReserveTokenMintEventArgs_3_0_0,
  USDTieredSTOSetAddressesEventArgs_3_0_0,
  USDTieredSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0,
  USDTieredSTOSetFundRaiseTypesEventArgs_3_0_0,
  USDTieredSTOSetLimitsEventArgs_3_0_0,
  USDTieredSTOSetNonAccreditedLimitEventArgs_3_0_0,
  USDTieredSTOSetTiersEventArgs_3_0_0,
  USDTieredSTOSetTimesEventArgs_3_0_0,
  USDTieredSTOSetTreasuryWalletEventArgs_3_0_0,
  USDTieredSTOTokenPurchaseEventArgs_3_0_0,
  USDTieredSTOUnpauseEventArgs_3_0_0,
  ManualApprovalTransferManagerContract_3_0_0,
  ManualApprovalTransferManagerEventArgs_3_0_0,
  ManualApprovalTransferManagerEvents_3_0_0,
  ManualApprovalTransferManagerAddManualApprovalEventArgs_3_0_0,
  ManualApprovalTransferManagerModifyManualApprovalEventArgs_3_0_0,
  ManualApprovalTransferManagerRevokeManualApprovalEventArgs_3_0_0,
  ManualApprovalTransferManagerPauseEventArgs_3_0_0,
  ManualApprovalTransferManagerUnpauseEventArgs_3_0_0,
  PercentageTransferManagerContract_3_0_0,
  PercentageTransferManagerEventArgs_3_0_0,
  PercentageTransferManagerEvents_3_0_0,
  PercentageTransferManagerModifyHolderPercentageEventArgs_3_0_0,
  PercentageTransferManagerModifyWhitelistEventArgs_3_0_0,
  PercentageTransferManagerPauseEventArgs_3_0_0,
  PercentageTransferManagerSetAllowPrimaryIssuanceEventArgs_3_0_0,
  PercentageTransferManagerUnpauseEventArgs_3_0_0,
  LockUpTransferManagerContract_3_0_0,
  LockUpTransferManagerEventArgs_3_0_0,
  LockUpTransferManagerEvents_3_0_0,
  LockUpTransferManagerAddLockUpToUserEventArgs_3_0_0,
  LockUpTransferManagerRemoveLockUpFromUserEventArgs_3_0_0,
  LockUpTransferManagerModifyLockUpTypeEventArgs_3_0_0,
  LockUpTransferManagerAddNewLockUpTypeEventArgs_3_0_0,
  LockUpTransferManagerRemoveLockUpTypeEventArgs_3_0_0,
  LockUpTransferManagerPauseEventArgs_3_0_0,
  LockUpTransferManagerUnpauseEventArgs_3_0_0,
  BlacklistTransferManagerContract_3_0_0,
  BlacklistTransferManagerEventArgs_3_0_0,
  BlacklistTransferManagerEvents_3_0_0,
  BlacklistTransferManagerAddBlacklistTypeEventArgs_3_0_0,
  BlacklistTransferManagerModifyBlacklistTypeEventArgs_3_0_0,
  BlacklistTransferManagerDeleteBlacklistTypeEventArgs_3_0_0,
  BlacklistTransferManagerAddInvestorToBlacklistEventArgs_3_0_0,
  BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs_3_0_0,
  BlacklistTransferManagerPauseEventArgs_3_0_0,
  BlacklistTransferManagerUnpauseEventArgs_3_0_0,
  CountTransferManagerContract_3_0_0,
  CountTransferManagerEventArgs_3_0_0,
  CountTransferManagerEvents_3_0_0,
  CountTransferManagerModifyHolderCountEventArgs_3_0_0,
  CountTransferManagerPauseEventArgs_3_0_0,
  CountTransferManagerUnpauseEventArgs_3_0_0,
  EtherDividendCheckpointContract_3_0_0,
  EtherDividendCheckpointEventArgs_3_0_0,
  EtherDividendCheckpointEvents_3_0_0,
  EtherDividendCheckpointEtherDividendDepositedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendClaimedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendReclaimedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendClaimFailedEventArgs_3_0_0,
  EtherDividendCheckpointEtherDividendWithholdingWithdrawnEventArgs_3_0_0,
  EtherDividendCheckpointSetDefaultExcludedAddressesEventArgs_3_0_0,
  EtherDividendCheckpointSetWithholdingEventArgs_3_0_0,
  EtherDividendCheckpointSetWithholdingFixedEventArgs_3_0_0,
  EtherDividendCheckpointSetWalletEventArgs_3_0_0,
  EtherDividendCheckpointUpdateDividendDatesEventArgs_3_0_0,
  EtherDividendCheckpointPauseEventArgs_3_0_0,
  EtherDividendCheckpointUnpauseEventArgs_3_0_0,
  VolumeRestrictionTMContract_3_0_0,
  VolumeRestrictionTMEventArgs_3_0_0,
  VolumeRestrictionTMEvents_3_0_0,
  VolumeRestrictionTMAddDefaultDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMAddDefaultRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMAddIndividualDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMAddIndividualRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMChangedExemptWalletListEventArgs_3_0_0,
  VolumeRestrictionTMDefaultDailyRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMDefaultRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMIndividualDailyRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMIndividualRestrictionRemovedEventArgs_3_0_0,
  VolumeRestrictionTMModifyDefaultDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyDefaultRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyIndividualDailyRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMModifyIndividualRestrictionEventArgs_3_0_0,
  VolumeRestrictionTMPauseEventArgs_3_0_0,
  VolumeRestrictionTMUnpauseEventArgs_3_0_0,
  CappedSTOContract_3_1_0,
  CappedSTOEventArgs_3_1_0,
  CappedSTOEvents_3_1_0,
  CappedSTOPauseEventArgs_3_1_0,
  CappedSTOUnpauseEventArgs_3_1_0,
  CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_1_0,
  CappedSTOTokenPurchaseEventArgs_3_1_0,
  CappedSTOSetFundRaiseTypesEventArgs_3_1_0,
  CappedSTOAllowPreMintFlagEventArgs_3_1_0,
  CappedSTOReserveTokenMintEventArgs_3_1_0,
  CappedSTORevokePreMintFlagEventArgs_3_1_0,
  CappedSTOReserveTokenTransferEventArgs_3_1_0,
  USDTieredSTOContract_3_1_0,
  USDTieredSTOEventArgs_3_1_0,
  USDTieredSTOEvents_3_1_0,
  USDTieredSTOFundsReceivedEventArgs_3_1_0,
  USDTieredSTOPauseEventArgs_3_1_0,
  USDTieredSTOReserveTokenMintEventArgs_3_1_0,
  USDTieredSTOSetAddressesEventArgs_3_1_0,
  USDTieredSTOSetAllowBeneficialInvestmentsEventArgs_3_1_0,
  USDTieredSTOSetFundRaiseTypesEventArgs_3_1_0,
  USDTieredSTOSetLimitsEventArgs_3_1_0,
  USDTieredSTOSetNonAccreditedLimitEventArgs_3_1_0,
  USDTieredSTOSetTiersEventArgs_3_1_0,
  USDTieredSTOSetTimesEventArgs_3_1_0,
  USDTieredSTOSetTreasuryWalletEventArgs_3_1_0,
  USDTieredSTOTokenPurchaseEventArgs_3_1_0,
  USDTieredSTOUnpauseEventArgs_3_1_0,
  USDTieredSTOAllowPreMintFlagEventArgs_3_1_0,
  USDTieredSTORevokePreMintFlagEventArgs_3_1_0,
  USDTieredSTOReserveTokenTransferEventArgs_3_1_0,
  GeneralTransferManagerContract_3_1_0,
  GeneralTransferManagerEventArgs_3_1_0,
  GeneralTransferManagerEvents_3_1_0,
  GeneralTransferManagerChangeIssuanceAddressEventArgs_3_1_0,
  GeneralTransferManagerChangeDefaultsEventArgs_3_1_0,
  GeneralTransferManagerPauseEventArgs_3_1_0,
  GeneralTransferManagerUnpauseEventArgs_3_1_0,
  GeneralTransferManagerModifyKYCDataEventArgs_3_1_0,
  GeneralTransferManagerModifyInvestorFlagEventArgs_3_1_0,
  GeneralTransferManagerModifyTransferRequirementsEventArgs_3_1_0,
  GeneralPermissionManagerContract_3_1_0,
  GeneralPermissionManagerEventArgs_3_1_0,
  GeneralPermissionManagerEvents_3_1_0,
  GeneralPermissionManagerChangePermissionEventArgs_3_1_0,
  GeneralPermissionManagerAddDelegateEventArgs_3_1_0,
  GeneralPermissionManagerPauseEventArgs_3_1_0,
  GeneralPermissionManagerUnpauseEventArgs_3_1_0,
  BlockParamLiteral,
  TransactionReceiptWithDecodedLogs,
  LogEntry,
  LogWithDecodedArgs,
  DecodedLogArgs,
  Provider,
  Web3Wrapper,
  BigNumber,
  VestingEscrowWalletContract_3_0_0,
  VestingEscrowWalletEventArgs_3_0_0,
  VestingEscrowWalletEvents_3_0_0,
  VestingEscrowWalletPauseEventArgs_3_0_0,
  VestingEscrowWalletUnpauseEventArgs_3_0_0,
  VestingEscrowWalletAddScheduleEventArgs_3_0_0,
  VestingEscrowWalletModifyScheduleEventArgs_3_0_0,
  VestingEscrowWalletRevokeAllSchedulesEventArgs_3_0_0,
  VestingEscrowWalletRevokeScheduleEventArgs_3_0_0,
  VestingEscrowWalletDepositTokensEventArgs_3_0_0,
  VestingEscrowWalletSendToTreasuryEventArgs_3_0_0,
  VestingEscrowWalletSendTokensEventArgs_3_0_0,
  VestingEscrowWalletAddTemplateEventArgs_3_0_0,
  VestingEscrowWalletRemoveTemplateEventArgs_3_0_0,
  VestingEscrowWalletTreasuryWalletChangedEventArgs_3_0_0,
  VestingEscrowWalletContract_3_1_0,
  VestingEscrowWalletEventArgs_3_1_0,
  VestingEscrowWalletEvents_3_1_0,
  VestingEscrowWalletPauseEventArgs_3_1_0,
  VestingEscrowWalletUnpauseEventArgs_3_1_0,
  VestingEscrowWalletAddScheduleEventArgs_3_1_0,
  VestingEscrowWalletModifyScheduleEventArgs_3_1_0,
  VestingEscrowWalletRevokeAllSchedulesEventArgs_3_1_0,
  VestingEscrowWalletRevokeScheduleEventArgs_3_1_0,
  VestingEscrowWalletDepositTokensEventArgs_3_1_0,
  VestingEscrowWalletSendToTreasuryEventArgs_3_1_0,
  VestingEscrowWalletSendTokensEventArgs_3_1_0,
  VestingEscrowWalletAddTemplateEventArgs_3_1_0,
  VestingEscrowWalletRemoveTemplateEventArgs_3_1_0,
  VestingEscrowWalletTreasuryWalletChangedEventArgs_3_1_0,
} from '@polymathnetwork/abi-wrappers';
