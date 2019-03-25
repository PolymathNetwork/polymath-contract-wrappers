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
} from '@polymathnetwork/abi-wrappers';
import { SecurityToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ERC20TokenWrapper } from './erc20_wrapper';

interface IApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.Approval,
  callback: EventCallback<SecurityTokenApprovalEventArgs>,
}

interface IGetApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.Approval,
}

interface ITransferSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.Transfer,
  callback: EventCallback<SecurityTokenTransferEventArgs>,
}

interface IGetTransferLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.Transfer,
}

interface IModuleAddedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleAdded,
  callback: EventCallback<SecurityTokenModuleAddedEventArgs>,
}

interface IGetModuleAddedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleAdded,
}

interface IUpdateTokenDetailsSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails,
  callback: EventCallback<SecurityTokenUpdateTokenDetailsEventArgs>,
}

interface IGetUpdateTokenDetailsLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.UpdateTokenDetails,
}

interface IGranularityChangedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.GranularityChanged,
  callback: EventCallback<SecurityTokenGranularityChangedEventArgs>,
}

interface IGetGranularityChangedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.GranularityChanged,
}

interface IModuleArchivedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleArchived,
  callback: EventCallback<SecurityTokenModuleArchivedEventArgs>,
}

interface IGetModuleArchivedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleArchived,
}

interface IModuleUnarchivedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleUnarchived,
  callback: EventCallback<SecurityTokenModuleUnarchivedEventArgs>,
}

interface IGetModuleUnarchivedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleUnarchived,
}

interface IModuleRemovedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleRemoved,
  callback: EventCallback<SecurityTokenModuleRemovedEventArgs>,
}

interface IGetModuleRemovedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleRemoved,
}

interface IModuleBudgetChangedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ModuleBudgetChanged,
  callback: EventCallback<SecurityTokenModuleBudgetChangedEventArgs>,
}

interface IGetModuleBudgetChangedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ModuleBudgetChanged,
}

interface IFreezeTransfersSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeTransfers,
  callback: EventCallback<SecurityTokenFreezeTransfersEventArgs>,
}

interface IGetFreezeTransfersLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeTransfers,
}

interface ICheckpointCreatedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.CheckpointCreated,
  callback: EventCallback<SecurityTokenCheckpointCreatedEventArgs>,
}

interface IGetCheckpointCreatedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.CheckpointCreated,
}

interface IFreezeMintingSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.FreezeMinting,
  callback: EventCallback<SecurityTokenFreezeMintingEventArgs>,
}

interface IGetFreezeMintingLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.FreezeMinting,
}

interface IMintedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.Minted,
  callback: EventCallback<SecurityTokenMintedEventArgs>,
}

interface IGetMintedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.Minted,
}

interface IBurntSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.Burnt,
  callback: EventCallback<SecurityTokenBurntEventArgs>,
}

interface IGetBurntLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.Burnt,
}

interface ISetControllerSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.SetController,
  callback: EventCallback<SecurityTokenSetControllerEventArgs>,
}

interface IGetSetControllerLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.SetController,
}

interface IForceTransferSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ForceTransfer,
  callback: EventCallback<SecurityTokenForceTransferEventArgs>,
}

interface IGetForceTransferLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ForceTransfer,
}

interface IForceBurnSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.ForceBurn,
  callback: EventCallback<SecurityTokenForceBurnEventArgs>,
}

interface IGetForceBurnLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.ForceBurn,
}

interface IDisableControllerSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.DisableController,
  callback: EventCallback<SecurityTokenDisableControllerEventArgs>,
}

interface IGetDisableControllerLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.DisableController,
}

interface IOwnershipRenouncedSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipRenounced,
  callback: EventCallback<SecurityTokenOwnershipRenouncedEventArgs>,
}

interface IGetOwnershipRenouncedLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipRenounced,
}

interface IOwnershipTransferredSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred,
  callback: EventCallback<SecurityTokenOwnershipTransferredEventArgs>,
}

interface IGetOwnershipTransferredLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: SecurityTokenEvents.OwnershipTransferred,
}

interface ISecurityTokenSubscribeAsyncParams {
  (params: IApprovalSubscribeAsyncParams): Promise<string>,
  (params: ITransferSubscribeAsyncParams): Promise<string>,
  (params: IModuleAddedSubscribeAsyncParams): Promise<string>,
  (params: IUpdateTokenDetailsSubscribeAsyncParams): Promise<string>,
  (params: IGranularityChangedSubscribeAsyncParams): Promise<string>,
  (params: IModuleArchivedSubscribeAsyncParams): Promise<string>,
  (params: IModuleUnarchivedSubscribeAsyncParams): Promise<string>,
  (params: IModuleRemovedSubscribeAsyncParams): Promise<string>,
  (params: IModuleBudgetChangedSubscribeAsyncParams): Promise<string>,
  (params: IFreezeTransfersSubscribeAsyncParams): Promise<string>,
  (params: ICheckpointCreatedSubscribeAsyncParams): Promise<string>,
  (params: IFreezeMintingSubscribeAsyncParams): Promise<string>,
  (params: IMintedSubscribeAsyncParams): Promise<string>,
  (params: IBurntSubscribeAsyncParams): Promise<string>,
  (params: ISetControllerSubscribeAsyncParams): Promise<string>,
  (params: IForceTransferSubscribeAsyncParams): Promise<string>,
  (params: IForceBurnSubscribeAsyncParams): Promise<string>,
  (params: IDisableControllerSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipRenouncedSubscribeAsyncParams): Promise<string>,
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>
}

interface IGetSecurityTokenLogsAsyncParams {
  (params: IGetApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenApprovalEventArgs>>>,
  (params: IGetTransferLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenTransferEventArgs>>>,
  (params: IGetModuleAddedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenModuleAddedEventArgs>>>,
  (params: IGetUpdateTokenDetailsLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenUpdateTokenDetailsEventArgs>>>,
  (params: IGetGranularityChangedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenGranularityChangedEventArgs>>>,
  (params: IGetModuleArchivedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenModuleArchivedEventArgs>>>,
  (params: IGetModuleUnarchivedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenModuleUnarchivedEventArgs>>>,
  (params: IGetModuleRemovedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenModuleRemovedEventArgs>>>,
  (params: IGetModuleBudgetChangedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenModuleBudgetChangedEventArgs>>>,
  (params: IGetFreezeTransfersLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenFreezeTransfersEventArgs>>>,
  (params: IGetCheckpointCreatedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenCheckpointCreatedEventArgs>>>,
  (params: IGetFreezeMintingLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenFreezeMintingEventArgs>>>,
  (params: IGetMintedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenMintedEventArgs>>>,
  (params: IGetBurntLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenBurntEventArgs>>>,
  (params: IGetSetControllerLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenSetControllerEventArgs>>>,
  (params: IGetForceTransferLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenForceTransferEventArgs>>>,
  (params: IGetForceBurnLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenForceBurnEventArgs>>>,
  (params: IGetDisableControllerLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenDisableControllerEventArgs>>>,
  (params: IGetOwnershipRenouncedLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenOwnershipRenouncedEventArgs>>>,
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenOwnershipTransferredEventArgs>>>
}

/**
 * @param type type of the module
 */
interface IGetModulesByTypeParams {
  type: number;
}

interface IAddModuleParams extends ITxParams {
  moduleFactory: string;
  data: string;
  maxCost: BigNumber;
  budget: BigNumber;
}

/**
* @param module address of the module
*/
interface IGetModuleParams {
  module: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface IVerifyTransferParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

interface IDecreaseApprovalParams extends ITxParams {
  spender: string,
  subtractedValue: BigNumber,
}

interface IIncreaseApprovalParams extends ITxParams {
  spender: string,
  addedValue: BigNumber,
}

interface ITransferOwnershipParams extends ITxParams {
  newOwner: string,
}

interface IArchiveModuleParams extends ITxParams {
  module: string,
}

interface IUnarchiveModuleParams extends ITxParams {
  module: string,
}

interface IRemoveModuleParams extends ITxParams {
  module: string,
}

interface IGetModulesByNameParams {
  name: string,
}

interface IWithdrawERC20Params extends ITxParams {
  tokenContract: string,
  value: BigNumber,
}

interface IChangeModuleBudgetParams extends ITxParams {
  module: string,
  change: BigNumber,
  increase: boolean,
}

interface IUpdateTokenDetailsParams extends ITxParams {
  newTokenDetails: string,
}

interface IChangeGranularityParams extends ITxParams {
  granularity: BigNumber,
}

interface IGetInvestorsAtParams {
  checkpointId: BigNumber,
}

interface IIterateInvestorsParams {
  start: BigNumber,
  end: BigNumber,
}

interface ITransferWithDataParams extends ITxParams {
  to: string,
  value: BigNumber,
  data: string,
}

interface ITransferFromWithDataParams extends ITxParams {
  from: string,
  to: string,
  value: BigNumber,
  data: string,
}

interface IMintParams extends ITxParams {
  investor: string,
  value: BigNumber,
}

interface IMintWithDataParams extends ITxParams {
  investor: string,
  value: BigNumber,
  data: string,
}

interface IMintMultiParams extends ITxParams {
  investors: string[],
  values: BigNumber[],
}

interface ICheckPermissionParams {
  delegate: string,
  module: string,
  perm: string,
}

interface IBurnWithDataParams extends ITxParams {
  value: BigNumber,
  data: string,
}

interface IBurnFromWithDataParams extends ITxParams {
  from: string,
  value: BigNumber,
  data: string,
}

interface ITotalSupplyAtParams {
  checkpointId: BigNumber,
}

interface IBalanceOfAtParams {
  investor: string,
  checkpointId: BigNumber,
}

interface ISetControllerParams extends ITxParams {
  controller: string,
}

interface IForceTransferParams extends ITxParams {
  from: string,
  to: string,
  value: BigNumber,
  data: string,
  log: string,
}

interface IForceBurnParams extends ITxParams {
  from: string,
  value: BigNumber,
  data: string,
  log: string,
}

interface IForceBurnParams extends ITxParams {
  from: string,
  value: BigNumber,
  data: string,
  log: string,
}

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  protected _contract: Promise<SecurityTokenContract>;

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address contract
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper, address);
    this._contract = this._getSecurityTokenContract();
  }

  /**
   * Value of current checkpoint
   */
  public currentCheckpointId = async (): Promise<BigNumber> => {
    return await (await this._contract).currentCheckpointId.callAsync();
  }

  /**
   * Granular level of the token
   */
  public granularity = async (): Promise<BigNumber> => {
    return await (await this._contract).granularity.callAsync();
  }

  public decreaseApproval = async (params: IDecreaseApprovalParams) => {
    return async () => {
      return (await this._contract).decreaseApproval.sendTransactionAsync(
        params.spender,
        params.subtractedValue,
      );
    }
  }

  public polyToken = async (): Promise<string> => {
    return await (await this._contract).polyToken.callAsync();
  }

  public renounceOwnership = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).renounceOwnership.sendTransactionAsync();
    }
  }

  public polymathRegistry = async (): Promise<string> => {
    return await (await this._contract).polymathRegistry.callAsync();
  }

  public controllerDisabled = async (): Promise<boolean> => {
    return await (await this._contract).controllerDisabled.callAsync();
  }

  public owner = async (): Promise<string> => {
    return await (await this._contract).owner.callAsync();
  }

  public mintingFrozen = async (): Promise<boolean> => {
    return await (await this._contract).mintingFrozen.callAsync();
  }

  public moduleRegistry = async (): Promise<string> => {
    return await (await this._contract).moduleRegistry.callAsync();
  }

  public featureRegistry = async (): Promise<string> => {
    return await (await this._contract).featureRegistry.callAsync();
  }

  public securityTokenRegistry = async (): Promise<string> => {
    return await (await this._contract).securityTokenRegistry.callAsync();
  }

  public tokenDetails = async (): Promise<string> => {
    return (await this._contract).tokenDetails.callAsync();
  }

  public increaseApproval = async (params: IIncreaseApprovalParams) => {
    return async () => {
      return (await this._contract).increaseApproval.sendTransactionAsync(
        params.spender,
        params.addedValue,
      );
    }
  }

  public transfersFrozen = async (): Promise<boolean> => {
    return await (await this._contract).transfersFrozen.callAsync();
  }

  public transferOwnership = async (params: ITransferOwnershipParams) => {
    return async () => {
      return (await this._contract).transferOwnership.sendTransactionAsync(
        params.newOwner,
      );
    }
  }

  public updateFromRegistry = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).updateFromRegistry.sendTransactionAsync();
    }
  }

  public archiveModule = async (params: IArchiveModuleParams) => {
    return async () => {
      return (await this._contract).archiveModule.sendTransactionAsync(
        params.module,
      );
    }
  }

  public unarchiveModule = async (params: IUnarchiveModuleParams) => {
    return async () => {
      return (await this._contract).unarchiveModule.sendTransactionAsync(
        params.module,
      );
    }
  }

  public removeModule = async (params: IRemoveModuleParams) => {
    return async () => {
      return (await this._contract).removeModule.sendTransactionAsync(
        params.module,
      );
    }
  }

  public getModulesByName = async (params: IGetModulesByNameParams): Promise<string[]> => {
    return await (await this._contract).getModulesByName.callAsync(
      params.name,
    );
  }

  public withdrawERC20 = async (params: IWithdrawERC20Params) => {
    return async () => {
      return (await this._contract).withdrawERC20.sendTransactionAsync(
        params.tokenContract,
        params.value,
      );
    }
  }

  public changeModuleBudget = async (params: IChangeModuleBudgetParams) => {
    return async () => {
      return (await this._contract).changeModuleBudget.sendTransactionAsync(
        params.module,
        params.change,
        params.increase,
      );
    }
  }

  public updateTokenDetails = async (params: IUpdateTokenDetailsParams) => {
    return async () => {
      return (await this._contract).updateTokenDetails.sendTransactionAsync(
        params.newTokenDetails,
      );
    }
  }

  public changeGranularity = async (params: IChangeGranularityParams) => {
    return async () => {
      return (await this._contract).changeGranularity.sendTransactionAsync(
        params.granularity,
      );
    }
  }

  public getInvestors = async (): Promise<string[]> => {
    return await (await this._contract).getInvestors.callAsync();
  }

  public getInvestorsAt = async (params: IGetInvestorsAtParams): Promise<string[]> => {
    return await (await this._contract).getInvestorsAt.callAsync(
      params.checkpointId,
    );
  }

  public iterateInvestors = async (params: IIterateInvestorsParams): Promise<string[]> => {
    return await (await this._contract).iterateInvestors.callAsync(
      params.start,
      params.end,
    );
  }

  public getInvestorCount = async (): Promise<BigNumber> => {
    return await (await this._contract).getInvestorCount.callAsync();
  }

  public freezeTransfers = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).freezeTransfers.sendTransactionAsync();
    }
  }

  public unfreezeTransfers = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).unfreezeTransfers.sendTransactionAsync();
    }
  }

  public transferWithData = async (params: ITransferWithDataParams) => {
    return async () => {
      return (await this._contract).transferWithData.sendTransactionAsync(
        params.to,
        params.value,
        params.data,
      );
    }
  }

  public transferFromWithData = async (params: ITransferFromWithDataParams) => {
    return async () => {
      return (await this._contract).transferFromWithData.sendTransactionAsync(
        params.from,
        params.to,
        params.value,
        params.data,
      );
    }
  }

  public freezeMinting = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).freezeMinting.sendTransactionAsync();
    }
  }

  public mint = async (params: IMintParams) => {
    return async () => {
      return (await this._contract).mint.sendTransactionAsync(
        params.investor,
        params.value,
      );
    }
  }

  public mintWithData = async (params: IMintWithDataParams) => {
    return async () => {
      return (await this._contract).mintWithData.sendTransactionAsync(
        params.investor,
        params.value,
        params.data,
      );
    }
  }

  public mintMulti = async (params: IMintMultiParams) => {
    return async () => {
      return (await this._contract).mintMulti.sendTransactionAsync(
        params.investors,
        params.values,
      );
    }
  }

  public checkPermission = async (params: ICheckPermissionParams): Promise<boolean> => {
    return await (await this._contract).checkPermission.callAsync(
      params.delegate,
      params.module,
      params.perm,
    );
  }

  public burnWithData = async (params: IBurnWithDataParams) => {
    return async () => {
      return (await this._contract).burnWithData.sendTransactionAsync(
        params.value,
        params.data,
      );
    }
  }

  public burnFromWithData = async (params: IBurnFromWithDataParams) => {
    return async () => {
      return (await this._contract).burnFromWithData.sendTransactionAsync(
        params.from,
        params.value,
        params.data,
      );
    }
  }

  public createCheckpoint = async (params: ITxParams) => {
    return async () => {
      return (await this._contract).createCheckpoint.sendTransactionAsync();
    }
  }

  public getCheckpointTimes = async (): Promise<BigNumber[]> => {
    return await (await this._contract).getCheckpointTimes.callAsync();
  }

  public totalSupplyAt = async (params: ITotalSupplyAtParams): Promise<BigNumber> => {
    return await (await this._contract).totalSupplyAt.callAsync(
      params.checkpointId,
    );
  }

  public balanceOfAt = async (params: IBalanceOfAtParams): Promise<BigNumber> => {
    return await (await this._contract).balanceOfAt.callAsync(
      params.investor,
      params.checkpointId,
    );
  }

  public setController = async (params: ISetControllerParams) => {
    return async () => {
      return (await this._contract).setController.sendTransactionAsync(
        params.controller,
      );
    }
  }

  public disableController = async (params: ITxParams) => {
    return async () => {
    return (await this._contract).disableController.sendTransactionAsync();
    }
  }

  public forceTransfer = async (params: IForceTransferParams) => {
    return async () => {
      return (await this._contract).forceTransfer.sendTransactionAsync(
        params.from,
        params.to,
        params.value,
        params.data,
        params.log
      );
    }
  }

  public forceBurn = async (params: IForceBurnParams) => {
    return async () => {
      return (await this._contract).forceBurn.sendTransactionAsync(
        params.from,
        params.value,
        params.data,
        params.log
      );
    }
  }

  public getVersion = async (): Promise<BigNumber> => {
    return await (await this._contract).totalSupply.callAsync();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this._contract).address;
  }

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: IGetModulesByTypeParams): Promise<string[]> => {
    return (await this._contract).getModulesByType.callAsync(
      params.type,
    );
  }

  /**
   * Attachs a module to the SecurityToken
   */
  public addModule = async (params: IAddModuleParams) => {
    return async () => {
      return (await this._contract).addModule.sendTransactionAsync(
        params.moduleFactory,
        params.data,
        params.maxCost,
        params.budget
      );
    }
  }

  /**
   * @return Returns the data associated to a module
   */
  public getModule = async (params: IGetModuleParams): Promise<[string, string, string, boolean, BigNumber[]]> => {
    return (await this._contract).getModule.callAsync(params.module);
  }

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: IVerifyTransferParams): Promise<boolean> => {
    return await (await this._contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      params.value,
      params.data,
    );
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ISecurityTokenSubscribeAsyncParams = async <ArgsType extends SecurityTokenEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        (SecurityToken as any).abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Cancel a subscription
   * @param subscriptionToken Subscription token returned by `subscribe()`
   */
  public unsubscribe = (subscriptionToken: string): void => {
    assert.isValidSubscriptionToken('subscriptionToken', subscriptionToken);
    this._unsubscribe(subscriptionToken);
  }

  /**
   * Cancels all existing subscriptions
   */
  public unsubscribeAll = (): void => {
    super._unsubscribeAll();
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetSecurityTokenLogsAsyncParams = async <ArgsType extends SecurityTokenEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, SecurityTokenEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        (SecurityToken as any).abi,
    );
    return logs;
  }

  private async _getSecurityTokenContract(): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(
      this.abi,
      this._address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
