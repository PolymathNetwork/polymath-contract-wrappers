import {
  SecurityTokenContract,
  SecurityTokenEventArgs,
  SecurityTokenEvents,
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
  SecurityTokenApprovalEventArgs,
  SecurityTokenTransferEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { SecurityToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import {
  ITxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
} from '../types';
import { assert } from '../utils/assert';
import { schemas } from '@0x/json-schemas';

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

interface ISecurityTokenSubscribeAsyncParams {
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
  (params: IOwnershipTransferredSubscribeAsyncParams): Promise<string>,
  (params: ITransferSubscribeAsyncParams): Promise<string>,
  (params: IApprovalSubscribeAsyncParams): Promise<string>,
}

interface IGetSecurityTokenLogsAsyncParams {
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
  (params: IGetOwnershipTransferredLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenOwnershipTransferredEventArgs>>>,
  (params: IGetTransferLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenTransferEventArgs>>>,
  (params: IGetApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<SecurityTokenApprovalEventArgs>>>,
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

/**
 * @param spender The address which will spend the funds
 * @param value The amount of tokens to be spent
 */
interface IApproveParams extends ITxParams {
  spender: string;
  value: BigNumber;
}

/**
 * @param from The address which will spend the funds
 * @param to The address who will receive the funds
 * @param value The amount of tokens to be spent
 */
interface ITransferFromParams extends ITxParams {
  from: string;
  to: string;
  value: BigNumber;
}

/**
 * @param owner The address to query the the balance of
 */
interface IGetBalanceOfParams {
  owner?: string;
}

/**
 * @param to The address who will receive the funds
 * @param value The amount of tokens to be spent
 */
interface ITransferParams extends ITxParams {
  to: string;
  value: BigNumber;
}

/**
 * @param owner address The address which owns the tokens
 * @param spender address The address which will spend the tokens
 */
interface IAllowanceParams {
  owner: string;
  spender: string;
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
export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  private address: string;
  private securityTokenContract: Promise<SecurityTokenContract>;
  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param address The address contract
   */
  constructor(web3Wrapper: Web3Wrapper, address: string) {
    super(web3Wrapper);
    this.address = address;
    this.securityTokenContract = this._getSecurityTokenContract();
  }

  /**
   * Value of current checkpoint
   */
  public currentCheckpointId = async (): Promise<BigNumber> => {
    return await (await this.securityTokenContract).currentCheckpointId.callAsync();
  }

  /**
   * Granular level of the token
   */
  public granularity = async (): Promise<BigNumber> => {
    return await (await this.securityTokenContract).granularity.callAsync();
  }

  public decreaseApproval = async (params: IDecreaseApprovalParams) => {
    return async () => {
      return (await this.securityTokenContract).decreaseApproval.sendTransactionAsync(
        params.spender,
        params.subtractedValue,
      );
    }
  }

  public polyToken = async (): Promise<string> => {
    return await (await this.securityTokenContract).polyToken.callAsync();
  }

  public renounceOwnership = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenContract).renounceOwnership.sendTransactionAsync();
    }
  }

  public polymathRegistry = async (): Promise<string> => {
    return await (await this.securityTokenContract).polymathRegistry.callAsync();
  }

  public controllerDisabled = async (): Promise<boolean> => {
    return await (await this.securityTokenContract).controllerDisabled.callAsync();
  }

  public owner = async (): Promise<string> => {
    return await (await this.securityTokenContract).owner.callAsync();
  }

  public mintingFrozen = async (): Promise<boolean> => {
    return await (await this.securityTokenContract).mintingFrozen.callAsync();
  }

  public moduleRegistry = async (): Promise<string> => {
    return await (await this.securityTokenContract).moduleRegistry.callAsync();
  }

  public featureRegistry = async (): Promise<string> => {
    return await (await this.securityTokenContract).featureRegistry.callAsync();
  }

  public securityTokenRegistry = async (): Promise<string> => {
    return await (await this.securityTokenContract).securityTokenRegistry.callAsync();
  }

  public tokenDetails = async (): Promise<string> => {
    return (await this.securityTokenContract).tokenDetails.callAsync();
  }

  public increaseApproval = async (params: IIncreaseApprovalParams) => {
    return async () => {
      return (await this.securityTokenContract).increaseApproval.sendTransactionAsync(
        params.spender,
        params.addedValue,
      );
    }
  }

  public transfersFrozen = async (): Promise<boolean> => {
    return await (await this.securityTokenContract).transfersFrozen.callAsync();
  }

  public transferOwnership = async (params: ITransferOwnershipParams) => {
    return async () => {
      return (await this.securityTokenContract).transferOwnership.sendTransactionAsync(
        params.newOwner,
      );
    }
  }

  public updateFromRegistry = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenContract).updateFromRegistry.sendTransactionAsync();
    }
  }

  public archiveModule = async (params: IArchiveModuleParams) => {
    return async () => {
      return (await this.securityTokenContract).archiveModule.sendTransactionAsync(
        params.module,
      );
    }
  }

  public unarchiveModule = async (params: IUnarchiveModuleParams) => {
    return async () => {
      return (await this.securityTokenContract).unarchiveModule.sendTransactionAsync(
        params.module,
      );
    }
  }

  public removeModule = async (params: IRemoveModuleParams) => {
    return async () => {
      return (await this.securityTokenContract).removeModule.sendTransactionAsync(
        params.module,
      );
    }
  }

  public getModulesByName = async (params: IGetModulesByNameParams): Promise<string[]> => {
    return await (await this.securityTokenContract).getModulesByName.callAsync(
      params.name,
    );
  }

  public withdrawERC20 = async (params: IWithdrawERC20Params) => {
    return async () => {
      return (await this.securityTokenContract).withdrawERC20.sendTransactionAsync(
        params.tokenContract,
        params.value,
      );
    }
  }

  public changeModuleBudget = async (params: IChangeModuleBudgetParams) => {
    return async () => {
      return (await this.securityTokenContract).changeModuleBudget.sendTransactionAsync(
        params.module,
        params.change,
        params.increase,
      );
    }
  }

  public updateTokenDetails = async (params: IUpdateTokenDetailsParams) => {
    return async () => {
      return (await this.securityTokenContract).updateTokenDetails.sendTransactionAsync(
        params.newTokenDetails,
      );
    }
  }

  public changeGranularity = async (params: IChangeGranularityParams) => {
    return async () => {
      return (await this.securityTokenContract).changeGranularity.sendTransactionAsync(
        params.granularity,
      );
    }
  }

  public getInvestors = async (): Promise<string[]> => {
    return await (await this.securityTokenContract).getInvestors.callAsync();
  }

  public getInvestorsAt = async (params: IGetInvestorsAtParams): Promise<string[]> => {
    return await (await this.securityTokenContract).getInvestorsAt.callAsync(
      params.checkpointId,
    );
  }

  public iterateInvestors = async (params: IIterateInvestorsParams): Promise<string[]> => {
    return await (await this.securityTokenContract).iterateInvestors.callAsync(
      params.start,
      params.end,
    );
  }

  public getInvestorCount = async (): Promise<BigNumber> => {
    return await (await this.securityTokenContract).getInvestorCount.callAsync();
  }

  public freezeTransfers = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenContract).freezeTransfers.sendTransactionAsync();
    }
  }

  public unfreezeTransfers = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenContract).unfreezeTransfers.sendTransactionAsync();
    }
  }

  public transferWithData = async (params: ITransferWithDataParams) => {
    return async () => {
      return (await this.securityTokenContract).transferWithData.sendTransactionAsync(
        params.to,
        params.value,
        params.data,
      );
    }
  }

  public transferFromWithData = async (params: ITransferFromWithDataParams) => {
    return async () => {
      return (await this.securityTokenContract).transferFromWithData.sendTransactionAsync(
        params.from,
        params.to,
        params.value,
        params.data,
      );
    }
  }

  public freezeMinting = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenContract).freezeMinting.sendTransactionAsync();
    }
  }

  public mint = async (params: IMintParams) => {
    return async () => {
      return (await this.securityTokenContract).mint.sendTransactionAsync(
        params.investor,
        params.value,
      );
    }
  }

  public mintWithData = async (params: IMintWithDataParams) => {
    return async () => {
      return (await this.securityTokenContract).mintWithData.sendTransactionAsync(
        params.investor,
        params.value,
        params.data,
      );
    }
  }

  public mintMulti = async (params: IMintMultiParams) => {
    return async () => {
      return (await this.securityTokenContract).mintMulti.sendTransactionAsync(
        params.investors,
        params.values,
      );
    }
  }

  public checkPermission = async (params: ICheckPermissionParams): Promise<boolean> => {
    return await (await this.securityTokenContract).checkPermission.callAsync(
      params.delegate,
      params.module,
      params.perm,
    );
  }

  public burnWithData = async (params: IBurnWithDataParams) => {
    return async () => {
      return (await this.securityTokenContract).burnWithData.sendTransactionAsync(
        params.value,
        params.data,
      );
    }
  }

  public burnFromWithData = async (params: IBurnFromWithDataParams) => {
    return async () => {
      return (await this.securityTokenContract).burnFromWithData.sendTransactionAsync(
        params.from,
        params.value,
        params.data,
      );
    }
  }

  public createCheckpoint = async (params: ITxParams) => {
    return async () => {
      return (await this.securityTokenContract).createCheckpoint.sendTransactionAsync();
    }
  }

  public getCheckpointTimes = async (): Promise<BigNumber[]> => {
    return await (await this.securityTokenContract).getCheckpointTimes.callAsync();
  }

  public totalSupplyAt = async (params: ITotalSupplyAtParams): Promise<BigNumber> => {
    return await (await this.securityTokenContract).totalSupplyAt.callAsync(
      params.checkpointId,
    );
  }

  public balanceOfAt = async (params: IBalanceOfAtParams): Promise<BigNumber> => {
    return await (await this.securityTokenContract).balanceOfAt.callAsync(
      params.investor,
      params.checkpointId,
    );
  }

  public setController = async (params: ISetControllerParams) => {
    return async () => {
      return (await this.securityTokenContract).setController.sendTransactionAsync(
        params.controller,
      );
    }
  }

  public disableController = async (params: ITxParams) => {
    return async () => {
    return (await this.securityTokenContract).disableController.sendTransactionAsync();
    }
  }

  public forceTransfer = async (params: IForceTransferParams) => {
    return async () => {
      return (await this.securityTokenContract).forceTransfer.sendTransactionAsync(
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
      return (await this.securityTokenContract).forceBurn.sendTransactionAsync(
        params.from,
        params.value,
        params.data,
        params.log
      );
    }
  }

  public getVersion = async (): Promise<BigNumber> => {
    return await (await this.securityTokenContract).totalSupply.callAsync();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.securityTokenContract).address;
  }

  /**
   * Returns the token name
   */
  public getName = async (): Promise<string> => {
    return await (await this.securityTokenContract).name.callAsync();
  }

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: IApproveParams) => {
    return async () => {
      return (await this.securityTokenContract).approve.sendTransactionAsync(
        params.spender,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Returns the token total supply
   */
  public getTotalSupply = async (): Promise<BigNumber> => {
    return await (await this.securityTokenContract).totalSupply.callAsync();
  }

  /**
   * Send tokens amount of tokens from address from to address to
   */
  public transferFrom = async (params: ITransferFromParams) => {
    return async () => {
      return (await this.securityTokenContract).transferFrom.sendTransactionAsync(
        params.from,
        params.to,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Returns the setted decimals
   */
  public getDecimals = async (): Promise<BigNumber> => {
    return await (await this.securityTokenContract).decimals.callAsync();
  }

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public getBalanceOf = async (params: IGetBalanceOfParams): Promise<BigNumber> => {
    const address = !_.isUndefined(params.owner) ? params.owner : await this._getDefaultFromAddress();
    return await (await this.securityTokenContract).balanceOf.callAsync(
      address
    );
  }

  /**
   * Returns the token symbol
   */
  public getSymbol = async (): Promise<string> => {
    return await (await this.securityTokenContract).symbol.callAsync();
  }

  /**
   * Transfer the balance from token owner's account to 'to' account
   */
  public transfer = async (params: ITransferParams) => {
    return async () => {
      return (await this.securityTokenContract).transfer.sendTransactionAsync(
        params.to,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  /**
   * Function to check the amount of tokens a spender is allowed to spend
   * @return A BigNumber specifying the amount of tokens left available for the spender
   */
  public allowance = async (params: IAllowanceParams): Promise<BigNumber> => {
    return await (await this.securityTokenContract).allowance.callAsync(
      params.owner,
      params.spender
    );
  }

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: IGetModulesByTypeParams): Promise<string[]> => {
    return (await this.securityTokenContract).getModulesByType.callAsync(
      params.type,
    );
  }

  /**
   * Attachs a module to the SecurityToken
   */
  public addModule = async (params: IAddModuleParams) => {
    return async () => {
      return (await this.securityTokenContract).addModule.sendTransactionAsync(
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
    return (await this.securityTokenContract).getModule.callAsync(params.module);
  }

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: IVerifyTransferParams): Promise<boolean> => {
    return await (await this.securityTokenContract).verifyTransfer.callAsync(
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
    const normalizedContractAddress = (await this.securityTokenContract).address.toLowerCase();
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
    const normalizedContractAddress = (await this.securityTokenContract).address.toLowerCase();
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
      this.address,
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
