/* istanbul ignore file */
import * as conversionUtils from './utils/convert';
import { FeatureRegistryTransactionParams} from './contract_wrappers/registries/feature_registry_wrapper';

export namespace TransactionParams {
  export import FeatureRegistry = FeatureRegistryTransactionParams;
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
