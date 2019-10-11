/* istanbul ignore file */
import { ISecurityTokenEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { SecurityToken_3_0_0, isSecurityToken_3_0_0 } from './3.0.0';

import Common, {
  isSecurityToken,
  FreezeIssuanceParams,
  ModuleAddressTxParams,
  DataStoreAddressParams,
  SetDocumentParams,
  DocumentParams,
  ChangeTreasuryWalletParams,
  ChangeApprovalParams,
  TransferOwnershipParams,
  WithdrawERC20Params,
  ChangeModuleBudgetParams,
  UpdateTokenDetailsParams,
  ChangeGranularityParams,
  ChangeNameParams,
  TransferWithDataParams,
  TransferFromWithDataParams,
  IssueParams,
  IssueByPartitionParams,
  IssueMultiParams,
  RedeemParams,
  RedeemFromParams,
  TransferByPartitionParams,
  AuthorizeOperatorParams,
  AuthorizeOperatorByPartitionParams,
  RevokeOperatorParams,
  RevokeOperatorByPartitionParams,
  OperatorTransferByPartitionParams,
  SetControllerParams,
  DisableControllerParams,
  ControllerTransferParams,
  ControllerRedeemParams,
  AddModuleParams,
  AddNoDataModuleParams,
  AddVestingEscrowWalletParams,
  AddCountTransferManagerParams,
  AddPercentageTransferManagerParams,
  AddDividendCheckpointParams,
  AddCappedSTOParams,
  AddUSDTieredSTOParams,
  RedeemByPartitionParams,
  OperatorRedeemByPartitionParams,
} from './common';
import { ContractVersion } from '../../../types';

export type SecurityTokenEventArgs = ISecurityTokenEventArgs_3_0_0;

export {
  ISecurityTokenEvents_3_0_0 as SecurityTokenEvents,
  ISecurityTokenApprovalEventArgs_3_0_0 as SecurityTokenApprovalEventArgs,
  ISecurityTokenAuthorizedOperatorByPartitionEventArgs_3_0_0 as SecurityTokenAuthorizedOperatorByPartitionEventArgs,
  ISecurityTokenAuthorizedOperatorEventArgs_3_0_0 as SecurityTokenAuthorizedOperatorEventArgs,
  ISecurityTokenCheckpointCreatedEventArgs_3_0_0 as SecurityTokenCheckpointCreatedEventArgs,
  ISecurityTokenControllerRedemptionEventArgs_3_0_0 as SecurityTokenControllerRedemptionEventArgs,
  ISecurityTokenControllerTransferEventArgs_3_0_0 as SecurityTokenControllerTransferEventArgs,
  ISecurityTokenDisableControllerEventArgs_3_0_0 as SecurityTokenDisableControllerEventArgs,
  ISecurityTokenDocumentRemovedEventArgs_3_0_0 as SecurityTokenDocumentRemovedEventArgs,
  ISecurityTokenDocumentUpdatedEventArgs_3_0_0 as SecurityTokenDocumentUpdatedEventArgs,
  ISecurityTokenFreezeIssuanceEventArgs_3_0_0 as SecurityTokenFreezeIssuanceEventArgs,
  ISecurityTokenFreezeTransfersEventArgs_3_0_0 as SecurityTokenFreezeTransfersEventArgs,
  ISecurityTokenGranularityChangedEventArgs_3_0_0 as SecurityTokenGranularityChangedEventArgs,
  ISecurityTokenIssuedByPartitionEventArgs_3_0_0 as SecurityTokenIssuedByPartitionEventArgs,
  ISecurityTokenIssuedEventArgs_3_0_0 as SecurityTokenIssuedEventArgs,
  ISecurityTokenModuleAddedEventArgs_3_0_0 as SecurityTokenModuleAddedEventArgs,
  ISecurityTokenModuleArchivedEventArgs_3_0_0 as SecurityTokenModuleArchivedEventArgs,
  ISecurityTokenModuleBudgetChangedEventArgs_3_0_0 as SecurityTokenModuleBudgetChangedEventArgs,
  ISecurityTokenModuleRemovedEventArgs_3_0_0 as SecurityTokenModuleRemovedEventArgs,
  ISecurityTokenModuleUnarchivedEventArgs_3_0_0 as SecurityTokenModuleUnarchivedEventArgs,
  ISecurityTokenOwnershipTransferredEventArgs_3_0_0 as SecurityTokenOwnershipTransferredEventArgs,
  ISecurityTokenRedeemedByPartitionEventArgs_3_0_0 as SecurityTokenRedeemedByPartitionEventArgs,
  ISecurityTokenRedeemedEventArgs_3_0_0 as SecurityTokenRedeemedEventArgs,
  ISecurityTokenRevokedOperatorByPartitionEventArgs_3_0_0 as SecurityTokenRevokedOperatorByPartitionEventArgs,
  ISecurityTokenRevokedOperatorEventArgs_3_0_0 as SecurityTokenRevokedOperatorEventArgs,
  ISecurityTokenSetControllerEventArgs_3_0_0 as SecurityTokenSetControllerEventArgs,
  ISecurityTokenTokenUpgradedEventArgs_3_0_0 as SecurityTokenTokenUpgradedEventArgs,
  ISecurityTokenTransferByPartitionEventArgs_3_0_0 as SecurityTokenTransferByPartitionEventArgs,
  ISecurityTokenTransferEventArgs_3_0_0 as SecurityTokenTransferEventArgs,
  ISecurityTokenTreasuryWalletChangedEventArgs_3_0_0 as SecurityTokenTreasuryWalletChangedEventArgs,
  ISecurityTokenUpdateTokenDetailsEventArgs_3_0_0 as SecurityTokenUpdateTokenDetailsEventArgs,
  ISecurityTokenUpdateTokenNameEventArgs_3_0_0 as SecurityTokenUpdateTokenNameEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type SecurityToken = SecurityToken_3_0_0;

export { isSecurityToken, SecurityToken_3_0_0, isSecurityToken_3_0_0 };

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

// for internal use
export class SecurityTokenCommon extends Common {
  public contractVersion!: ContractVersion;
}
