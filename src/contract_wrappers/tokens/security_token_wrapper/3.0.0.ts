import {
  ISecurityTokenContract_3_0_0,
  ISecurityTokenApprovalEventArgs_3_0_0,
  ISecurityTokenAuthorizedOperatorByPartitionEventArgs_3_0_0,
  ISecurityTokenAuthorizedOperatorEventArgs_3_0_0,
  ISecurityTokenCheckpointCreatedEventArgs_3_0_0,
  ISecurityTokenControllerRedemptionEventArgs_3_0_0,
  ISecurityTokenControllerTransferEventArgs_3_0_0,
  ISecurityTokenDisableControllerEventArgs_3_0_0,
  ISecurityTokenDocumentRemovedEventArgs_3_0_0,
  ISecurityTokenDocumentUpdatedEventArgs_3_0_0,
  ISecurityTokenEventArgs_3_0_0,
  SecurityTokenEvents_3_0_0,
  ISecurityTokenFreezeIssuanceEventArgs_3_0_0,
  ISecurityTokenFreezeTransfersEventArgs_3_0_0,
  ISecurityTokenGranularityChangedEventArgs_3_0_0,
  ISecurityTokenIssuedByPartitionEventArgs_3_0_0,
  ISecurityTokenIssuedEventArgs_3_0_0,
  ISecurityTokenModuleAddedEventArgs_3_0_0,
  ISecurityTokenModuleArchivedEventArgs_3_0_0,
  ISecurityTokenModuleBudgetChangedEventArgs_3_0_0,
  ISecurityTokenModuleRemovedEventArgs_3_0_0,
  ISecurityTokenModuleUnarchivedEventArgs_3_0_0,
  SecurityTokenModuleUpgradedEventArgs_3_0_0, // this event isn't being exported from the interface contracts, so we need to use the non-interface version
  ISecurityTokenOwnershipTransferredEventArgs_3_0_0,
  ISecurityTokenRedeemedByPartitionEventArgs_3_0_0,
  ISecurityTokenRedeemedEventArgs_3_0_0,
  ISecurityTokenRevokedOperatorByPartitionEventArgs_3_0_0,
  ISecurityTokenRevokedOperatorEventArgs_3_0_0,
  ISecurityTokenSetControllerEventArgs_3_0_0,
  ISecurityTokenTokenUpgradedEventArgs_3_0_0,
  ISecurityTokenTransferByPartitionEventArgs_3_0_0,
  ISecurityTokenTransferEventArgs_3_0_0,
  ISecurityTokenTreasuryWalletChangedEventArgs_3_0_0,
  ISecurityTokenUpdateTokenDetailsEventArgs_3_0_0,
  ISecurityTokenUpdateTokenNameEventArgs_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import SecurityTokenCommon from './common';
import ContractFactory from '../../../factories/contractFactory';
import {
  EventCallback,
  GetLogs,
  GetLogsAsyncParams,
  Subscribe,
  SubscribeAsyncParams,
  ContractVersion,
} from '../../../types';

interface ApprovalSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Approval;
  callback: EventCallback<ISecurityTokenApprovalEventArgs_3_0_0>;
}

interface GetApprovalLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Approval;
}

interface TransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Transfer;
  callback: EventCallback<ISecurityTokenTransferEventArgs_3_0_0>;
}

interface GetTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Transfer;
}

interface ModuleAddedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleAdded;
  callback: EventCallback<ISecurityTokenModuleAddedEventArgs_3_0_0>;
}

interface GetModuleAddedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleAdded;
}

interface ModuleUpgradedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleUpgraded;
  callback: EventCallback<SecurityTokenModuleUpgradedEventArgs_3_0_0>;
}

interface GetModuleUpgradedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleUpgraded;
}

interface UpdateTokenDetailsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.UpdateTokenDetails;
  callback: EventCallback<ISecurityTokenUpdateTokenDetailsEventArgs_3_0_0>;
}

interface GetUpdateTokenDetailsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.UpdateTokenDetails;
}

interface UpdateTokenNameSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.UpdateTokenName;
  callback: EventCallback<ISecurityTokenUpdateTokenNameEventArgs_3_0_0>;
}

interface GetUpdateTokenNameLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.UpdateTokenName;
}

interface GranularityChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.GranularityChanged;
  callback: EventCallback<ISecurityTokenGranularityChangedEventArgs_3_0_0>;
}

interface GetGranularityChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.GranularityChanged;
}

interface ModuleArchivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleArchived;
  callback: EventCallback<ISecurityTokenModuleArchivedEventArgs_3_0_0>;
}

interface GetModuleArchivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleArchived;
}

interface ModuleUnarchivedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleUnarchived;
  callback: EventCallback<ISecurityTokenModuleUnarchivedEventArgs_3_0_0>;
}

interface GetModuleUnarchivedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleUnarchived;
}

interface ModuleRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleRemoved;
  callback: EventCallback<ISecurityTokenModuleRemovedEventArgs_3_0_0>;
}

interface GetModuleRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleRemoved;
}

interface ModuleBudgetChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleBudgetChanged;
  callback: EventCallback<ISecurityTokenModuleBudgetChangedEventArgs_3_0_0>;
}

interface GetModuleBudgetChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ModuleBudgetChanged;
}

interface TransferByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.TransferByPartition;
  callback: EventCallback<ISecurityTokenTransferByPartitionEventArgs_3_0_0>;
}

interface GetTransferByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.TransferByPartition;
}

interface AuthorizedOperatorSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.AuthorizedOperator;
  callback: EventCallback<ISecurityTokenAuthorizedOperatorEventArgs_3_0_0>;
}

interface GetAuthorizedOperatorLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.AuthorizedOperator;
}

interface RevokedOperatorSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.RevokedOperator;
  callback: EventCallback<ISecurityTokenRevokedOperatorEventArgs_3_0_0>;
}

interface GetRevokedOperatorLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.RevokedOperator;
}

interface AuthorizedOperatorByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.AuthorizedOperatorByPartition;
  callback: EventCallback<ISecurityTokenAuthorizedOperatorByPartitionEventArgs_3_0_0>;
}

interface GetAuthorizedOperatorByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.AuthorizedOperatorByPartition;
}

interface RevokedOperatorByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.RevokedOperatorByPartition;
  callback: EventCallback<ISecurityTokenRevokedOperatorByPartitionEventArgs_3_0_0>;
}

interface GetRevokedOperatorByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.RevokedOperatorByPartition;
}

interface IssuedByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.IssuedByPartition;
  callback: EventCallback<ISecurityTokenIssuedByPartitionEventArgs_3_0_0>;
}

interface GetIssuedByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.IssuedByPartition;
}

interface RedeemedByPartitionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.RedeemedByPartition;
  callback: EventCallback<ISecurityTokenRedeemedByPartitionEventArgs_3_0_0>;
}

interface GetRedeemedByPartitionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.RedeemedByPartition;
}

interface ControllerTransferSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ControllerTransfer;
  callback: EventCallback<ISecurityTokenControllerTransferEventArgs_3_0_0>;
}

interface GetControllerTransferLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ControllerTransfer;
}

interface ControllerRedemptionSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ControllerRedemption;
  callback: EventCallback<ISecurityTokenControllerRedemptionEventArgs_3_0_0>;
}

interface GetControllerRedemptionLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.ControllerRedemption;
}

interface DocumentRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.DocumentRemoved;
  callback: EventCallback<ISecurityTokenDocumentRemovedEventArgs_3_0_0>;
}

interface GetDocumentRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.DocumentRemoved;
}

interface DocumentUpdatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.DocumentUpdated;
  callback: EventCallback<ISecurityTokenDocumentUpdatedEventArgs_3_0_0>;
}

interface GetDocumentUpdatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.DocumentUpdated;
}

interface FreezeTransfersSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.FreezeTransfers;
  callback: EventCallback<ISecurityTokenFreezeTransfersEventArgs_3_0_0>;
}

interface GetFreezeTransfersLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.FreezeTransfers;
}

interface CheckpointCreatedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.CheckpointCreated;
  callback: EventCallback<ISecurityTokenCheckpointCreatedEventArgs_3_0_0>;
}

interface GetCheckpointCreatedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.CheckpointCreated;
}

interface FreezeIssuanceSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.FreezeIssuance;
  callback: EventCallback<ISecurityTokenFreezeIssuanceEventArgs_3_0_0>;
}

interface GetFreezeIssuanceLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.FreezeIssuance;
}

interface IssuedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Issued;
  callback: EventCallback<ISecurityTokenIssuedEventArgs_3_0_0>;
}

interface GetIssuedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Issued;
}

interface RedeemedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Redeemed;
  callback: EventCallback<ISecurityTokenRedeemedEventArgs_3_0_0>;
}

interface GetRedeemedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.Redeemed;
}

interface SetControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.SetController;
  callback: EventCallback<ISecurityTokenSetControllerEventArgs_3_0_0>;
}

interface GetSetControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.SetController;
}

interface TreasuryWalletChangedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.TreasuryWalletChanged;
  callback: EventCallback<ISecurityTokenTreasuryWalletChangedEventArgs_3_0_0>;
}

interface GetTreasuryWalletChangedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.TreasuryWalletChanged;
}

interface DisableControllerSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.DisableController;
  callback: EventCallback<ISecurityTokenDisableControllerEventArgs_3_0_0>;
}

interface GetDisableControllerLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.DisableController;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.OwnershipTransferred;
  callback: EventCallback<ISecurityTokenOwnershipTransferredEventArgs_3_0_0>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.OwnershipTransferred;
}

interface TokenUpgradedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.TokenUpgraded;
  callback: EventCallback<ISecurityTokenTokenUpgradedEventArgs_3_0_0>;
}

interface GetTokenUpgradedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: SecurityTokenEvents_3_0_0.TokenUpgraded;
}

interface SecurityTokenSubscribeAsyncParams extends Subscribe {
  (params: ApprovalSubscribeAsyncParams): Promise<string>;
  (params: TransferSubscribeAsyncParams): Promise<string>;
  (params: ModuleAddedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUpgradedSubscribeAsyncParams): Promise<string>;
  (params: UpdateTokenDetailsSubscribeAsyncParams): Promise<string>;
  (params: UpdateTokenNameSubscribeAsyncParams): Promise<string>;
  (params: GranularityChangedSubscribeAsyncParams): Promise<string>;
  (params: ModuleArchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUnarchivedSubscribeAsyncParams): Promise<string>;
  (params: ModuleRemovedSubscribeAsyncParams): Promise<string>;
  (params: ModuleBudgetChangedSubscribeAsyncParams): Promise<string>;
  (params: TransferByPartitionSubscribeAsyncParams): Promise<string>;
  (params: AuthorizedOperatorSubscribeAsyncParams): Promise<string>;
  (params: RevokedOperatorSubscribeAsyncParams): Promise<string>;
  (params: AuthorizedOperatorByPartitionSubscribeAsyncParams): Promise<string>;
  (params: RevokedOperatorByPartitionSubscribeAsyncParams): Promise<string>;
  (params: IssuedByPartitionSubscribeAsyncParams): Promise<string>;
  (params: RedeemedByPartitionSubscribeAsyncParams): Promise<string>;
  (params: ControllerTransferSubscribeAsyncParams): Promise<string>;
  (params: ControllerRedemptionSubscribeAsyncParams): Promise<string>;
  (params: DocumentRemovedSubscribeAsyncParams): Promise<string>;
  (params: DocumentUpdatedSubscribeAsyncParams): Promise<string>;
  (params: FreezeTransfersSubscribeAsyncParams): Promise<string>;
  (params: CheckpointCreatedSubscribeAsyncParams): Promise<string>;
  (params: FreezeIssuanceSubscribeAsyncParams): Promise<string>;
  (params: IssuedSubscribeAsyncParams): Promise<string>;
  (params: RedeemedSubscribeAsyncParams): Promise<string>;
  (params: SetControllerSubscribeAsyncParams): Promise<string>;
  (params: TreasuryWalletChangedSubscribeAsyncParams): Promise<string>;
  (params: DisableControllerSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: TokenUpgradedSubscribeAsyncParams): Promise<string>;
}

interface GetSecurityTokenLogsAsyncParams extends GetLogs {
  (params: GetApprovalLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenApprovalEventArgs_3_0_0>[]>;
  (params: GetTransferLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenTransferEventArgs_3_0_0>[]>;
  (params: GetModuleAddedLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenModuleAddedEventArgs_3_0_0>[]>;
  (params: GetModuleUpgradedLogsAsyncParams): Promise<LogWithDecodedArgs<SecurityTokenModuleUpgradedEventArgs_3_0_0>[]>;
  (params: GetUpdateTokenDetailsLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenUpdateTokenDetailsEventArgs_3_0_0>[]
  >;
  (params: GetUpdateTokenNameLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenUpdateTokenNameEventArgs_3_0_0>[]
  >;
  (params: GetGranularityChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenGranularityChangedEventArgs_3_0_0>[]
  >;
  (params: GetModuleArchivedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenModuleArchivedEventArgs_3_0_0>[]
  >;
  (params: GetModuleUnarchivedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenModuleUnarchivedEventArgs_3_0_0>[]
  >;
  (params: GetModuleRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenModuleRemovedEventArgs_3_0_0>[]>;
  (params: GetModuleBudgetChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenModuleBudgetChangedEventArgs_3_0_0>[]
  >;
  (params: GetTransferByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenModuleBudgetChangedEventArgs_3_0_0>[]
  >;
  (params: GetAuthorizedOperatorLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetRevokedOperatorLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetAuthorizedOperatorByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetRevokedOperatorByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetIssuedByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetRedeemedByPartitionLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetControllerTransferLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetControllerRedemptionLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetDocumentRemovedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetDocumentUpdatedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetFreezeTransfersLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeTransfersEventArgs_3_0_0>[]
  >;
  (params: GetCheckpointCreatedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenCheckpointCreatedEventArgs_3_0_0>[]
  >;
  (params: GetFreezeIssuanceLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenFreezeIssuanceEventArgs_3_0_0>[]
  >;
  (params: GetIssuedLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenIssuedEventArgs_3_0_0>[]>;
  (params: GetRedeemedLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenRedeemedEventArgs_3_0_0>[]>;
  (params: GetSetControllerLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenSetControllerEventArgs_3_0_0>[]>;
  (params: GetTreasuryWalletChangedLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenTreasuryWalletChangedEventArgs_3_0_0>[]
  >;
  (params: GetDisableControllerLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenDisableControllerEventArgs_3_0_0>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ISecurityTokenOwnershipTransferredEventArgs_3_0_0>[]
  >;
  (params: GetTokenUpgradedLogsAsyncParams): Promise<LogWithDecodedArgs<ISecurityTokenTokenUpgradedEventArgs_3_0_0>[]>;
}

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityToken_3_0_0 extends SecurityTokenCommon {
  public contract: Promise<ISecurityTokenContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

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
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: SecurityTokenSubscribeAsyncParams = async <ArgsType extends ISecurityTokenEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetSecurityTokenLogsAsyncParams = async <ArgsType extends ISecurityTokenEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents_3_0_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isSecurityToken_3_0_0(wrapper: SecurityTokenCommon): wrapper is SecurityToken_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
