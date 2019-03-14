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
