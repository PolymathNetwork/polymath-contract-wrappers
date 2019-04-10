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
import {
  SecurityToken,
  CountTransferManager,
  ERC20DividendCheckpoint,
  CappedSTO,
  USDTieredSTO,
  PercentageTransferManager,
  EtherDividendCheckpoint,
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { ethers } from 'ethers';
import * as _ from 'lodash';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  IGetLogs,
  ISubscribe,
  ModuleType
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ERC20TokenWrapper } from './erc20_wrapper';
import { stringToBytes32, numberToBigNumber, dateToBigNumber } from '../../utils/convert';

const NO_MODULE_DATA = "0x0000000000000000";

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

interface ISecurityTokenSubscribeAsyncParams extends ISubscribe {
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

interface IGetSecurityTokenLogsAsyncParams extends IGetLogs {
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
interface ModuleTypeParams {
  type: ModuleType;
}

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
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

interface ChangeApprovalParams extends TxParams {
  spender: string,
  value: BigNumber,
}

interface ITransferOwnershipParams extends TxParams {
  newOwner: string,
}

interface ModuleNameParams {
  moduleName: string,
}

interface WithdrawERC20Params extends TxParams {
  tokenContract: string,
  value: BigNumber,
}

interface ChangeModuleBudgetParams extends TxParams {
  module: string,
  change: BigNumber,
  increase: boolean,
}

interface UpdateTokenDetailsParams extends TxParams {
  newTokenDetails: string,
}

interface ChangeGranularityParams extends TxParams {
  granularity: BigNumber,
}

interface CheckpointIdParams {
  checkpointId: number,
}

interface IterateInvestorsParams {
  start: Date,
  end: Date,
}

interface TransferWithDataParams extends TxParams {
  to: string,
  value: BigNumber,
  data: string,
}

interface TransferFromWithDataParams extends TxParams {
  from: string,
  to: string,
  value: BigNumber,
  data: string,
}

interface MintParams extends TxParams {
  investor: string,
  value: BigNumber,
}

interface MintWithDataParams extends MintParams {
  data: string,
}

interface MintMultiParams extends TxParams {
  investors: string[],
  values: BigNumber[],
}

interface CheckPermissionParams {
  delegateAddress: string,
  moduleAddress: string,
  permission: string,
}

interface BurnWithDataParams extends TxParams {
  value: BigNumber,
  data: string,
}

interface BurnFromWithDataParams extends TxParams {
  from: string,
  value: BigNumber,
  data: string,
}

interface BalanceOfAtParams {
  investor: string,
  checkpointId: number,
}

interface SetControllerParams extends TxParams {
  controller: string,
}

interface ForceTransferParams extends TxParams {
  from: string,
  to: string,
  value: BigNumber,
  data: string,
  log: string,
}

interface ForceBurnParams extends TxParams {
  from: string,
  value: BigNumber,
  data: string,
  log: string,
}

interface AddModuleParams extends TxParams {
  address: string,
  maxCost: BigNumber,
  budget: BigNumber,
}

interface AddCountTransferManagerParams extends AddModuleParams {
  maxHolderCount: number,
}

interface AddPercentageTransferManagerParams extends AddModuleParams {
  maxHolderPercentage: number,
  allowPrimaryIssuance: boolean,
}

interface AddErc20DividendCheckpointParams extends AddModuleParams {
  wallet: string,
}

interface AddCappedSTOParams extends AddModuleParams {
  startTime: number,
  endTime: number,
  cap: BigNumber,
  rate: BigNumber,
  fundRaiseTypes: BigNumber[],
  fundsReceiver: string
}

interface AddUSDTieredSTOParams extends AddModuleParams {
  startTime: number,
  endTime: number,
  ratePerTier: number[],
  ratePerTierDiscountPoly: number[],
  tokensPerTierTotal: number[],
  tokensPerTierDiscountPoly: number[],
  nonAccreditedLimitUSD: number,
  minimumInvestmentUSD: number,
  fundRaiseTypes: number[],
  wallet: string,
  reserveWallet: string,
  usdTokens: string[],
}

interface AddEtherDividendCheckpointParams extends AddModuleParams {
  wallet: string,
}

//// Return types ////
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
}
//// End of return types ////


/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  protected _contract: Promise<SecurityTokenContract>;

  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<SecurityTokenContract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  /**
   * Value of current checkpoint
   */
  public currentCheckpointId = async ()=> {
    return await (await this._contract).currentCheckpointId.callAsync();
  }

  /**
   * Granular level of the token
   */
  public granularity = async () => {
    return await (await this._contract).granularity.callAsync();
  }

  public decreaseApproval = async (params: ChangeApprovalParams) => {
    return (await this._contract).decreaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  public polyToken = async () => {
    return await (await this._contract).polyToken.callAsync();
  }

  public renounceOwnership = async (params: TxParams) => {
    return (await this._contract).renounceOwnership.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public polymathRegistry = async () => {
    return await (await this._contract).polymathRegistry.callAsync();
  }

  public controllerDisabled = async () => {
    return await (await this._contract).controllerDisabled.callAsync();
  }

  public owner = async () => {
    return await (await this._contract).owner.callAsync();
  }

  public mintingFrozen = async () => {
    return await (await this._contract).mintingFrozen.callAsync();
  }

  public moduleRegistry = async () => {
    return await (await this._contract).moduleRegistry.callAsync();
  }

  public featureRegistry = async () => {
    return await (await this._contract).featureRegistry.callAsync();
  }

  public securityTokenRegistry = async () => {
    return await (await this._contract).securityTokenRegistry.callAsync();
  }

  public tokenDetails = async () => {
    return (await this._contract).tokenDetails.callAsync();
  }

  public increaseApproval = async (params: ChangeApprovalParams) => {
    return (await this._contract).increaseApproval.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  public transfersFrozen = async () => {
    return await (await this._contract).transfersFrozen.callAsync();
  }

  public transferOwnership = async (params: ITransferOwnershipParams) => {
    return (await this._contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor
    );
  }

  public updateFromRegistry = async (params: TxParams) => {
    return (await this._contract).updateFromRegistry.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public archiveModule = async (params: ModuleAddressTxParams) => {
    return (await this._contract).archiveModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor
    );
  }

  public unarchiveModule = async (params: ModuleAddressTxParams) => {
    return (await this._contract).unarchiveModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor
    );
  }

  public removeModule = async (params: ModuleAddressTxParams) => {
    return (await this._contract).removeModule.sendTransactionAsync(
      params.moduleAddress,
      params.txData,
      params.safetyFactor
    );
  }

  public getModulesByName = async (params: ModuleNameParams) => {
    const moduleNameHex = stringToBytes32(params.moduleName);
    return await (await this._contract).getModulesByName.callAsync(
      moduleNameHex
    );
  }

  public withdrawERC20 = async (params: WithdrawERC20Params) => {
    return (await this._contract).withdrawERC20.sendTransactionAsync(
      params.tokenContract,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  public changeModuleBudget = async (params: ChangeModuleBudgetParams) => {
    return (await this._contract).changeModuleBudget.sendTransactionAsync(
      params.module,
      params.change,
      params.increase,
      params.txData,
      params.safetyFactor
    );
  }

  public updateTokenDetails = async (params: UpdateTokenDetailsParams) => {
    return (await this._contract).updateTokenDetails.sendTransactionAsync(
      params.newTokenDetails,
      params.txData,
      params.safetyFactor
    );
  }

  public changeGranularity = async (params: ChangeGranularityParams) => {
    return (await this._contract).changeGranularity.sendTransactionAsync(
      params.granularity,
      params.txData,
      params.safetyFactor
    );
  }

  public getInvestors = async () => {
    return await (await this._contract).getInvestors.callAsync();
  }

  public getInvestorsAt = async (params: CheckpointIdParams) => {
    return await (await this._contract).getInvestorsAt.callAsync(
      numberToBigNumber(params.checkpointId),
    );
  }

  public iterateInvestors = async (params: IterateInvestorsParams) => {
    return await (await this._contract).iterateInvestors.callAsync(
      dateToBigNumber(params.start),
      dateToBigNumber(params.end),
    );
  }

  public getInvestorCount = async () => {
    return await (await this._contract).getInvestorCount.callAsync();
  }

  public freezeTransfers = async (params: TxParams) => {
    return (await this._contract).freezeTransfers.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public unfreezeTransfers = async (params: TxParams) => {
    return (await this._contract).unfreezeTransfers.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public transferWithData = async (params: TransferWithDataParams) => {
    return (await this._contract).transferWithData.sendTransactionAsync(
      params.to,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor
    );
  }

  public transferFromWithData = async (params: TransferFromWithDataParams) => {
    return (await this._contract).transferFromWithData.sendTransactionAsync(
      params.from,
      params.to,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor
    );
  }

  public freezeMinting = async (params: TxParams) => {
    return (await this._contract).freezeMinting.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public mint = async (params: MintParams) => {
    return (await this._contract).mint.sendTransactionAsync(
      params.investor,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  public mintWithData = async (params: MintWithDataParams) => {
    return (await this._contract).mintWithData.sendTransactionAsync(
      params.investor,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor
    );
  }

  public mintMulti = async (params: MintMultiParams) => {
    return (await this._contract).mintMulti.sendTransactionAsync(
      params.investors,
      params.values,
      params.txData,
      params.safetyFactor
    );
  }

  public checkPermission = async (params: CheckPermissionParams): Promise<boolean> => {
    return await (await this._contract).checkPermission.callAsync(
      params.delegateAddress,
      params.moduleAddress,
      params.permission,
    );
  }

  public burnWithData = async (params: BurnWithDataParams) => {
    return (await this._contract).burnWithData.sendTransactionAsync(
      params.value,
      params.data,
      params.txData,
      params.safetyFactor
    );
  }

  public burnFromWithData = async (params: BurnFromWithDataParams) => {
    return (await this._contract).burnFromWithData.sendTransactionAsync(
      params.from,
      params.value,
      params.data,
      params.txData,
      params.safetyFactor
    );
  }

  public createCheckpoint = async (params: TxParams) => {
    return (await this._contract).createCheckpoint.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public getCheckpointTimes = async () => {
    return await (await this._contract).getCheckpointTimes.callAsync();
  }

  public totalSupplyAt = async (params: CheckpointIdParams) => {
    return await (await this._contract).totalSupplyAt.callAsync(
      numberToBigNumber(params.checkpointId),
    );
  }

  public balanceOfAt = async (params: BalanceOfAtParams)=> {
    return await (await this._contract).balanceOfAt.callAsync(
      params.investor,
      numberToBigNumber(params.checkpointId),
    );
  }

  public setController = async (params: SetControllerParams) => {
    return (await this._contract).setController.sendTransactionAsync(
      params.controller,
      params.txData,
      params.safetyFactor
    );
  }

  public disableController = async (params: TxParams) => {
    return (await this._contract).disableController.sendTransactionAsync(
      params.txData,
      params.safetyFactor
    );
  }

  public forceTransfer = async (params: ForceTransferParams) => {
    return (await this._contract).forceTransfer.sendTransactionAsync(
      params.from,
      params.to,
      params.value,
      params.data,
      params.log,
      params.txData,
      params.safetyFactor
    );
  }

  public forceBurn = async (params: ForceBurnParams) => {
    return (await this._contract).forceBurn.sendTransactionAsync(
      params.from,
      params.value,
      params.data,
      params.log,
      params.txData,
      params.safetyFactor
    );
  }

  public getVersion = async (): Promise<BigNumber> => {
    return await (await this._contract).totalSupply.callAsync();
  }

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: ModuleTypeParams) => {
    return (await this._contract).getModulesByType.callAsync(
      params.type,
    );
  }

  public addCountTransferManager = async (params: AddCountTransferManagerParams) => {
    const iface = new ethers.utils.Interface(CountTransferManager.abi);
    const data = iface.functions.configure.encode([params.maxHolderCount]);
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addPercentageTransferManager = async (params: AddPercentageTransferManagerParams) => {
    const iface = new ethers.utils.Interface(PercentageTransferManager.abi);
    const data = iface.functions.configure.encode([params.maxHolderPercentage, params.allowPrimaryIssuance]);
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addErc20DividendCheckpoint = async (params: AddErc20DividendCheckpointParams) => {
    const iface = new ethers.utils.Interface(ERC20DividendCheckpoint.abi);
    const data = iface.functions.configure.encode([params.wallet]);
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addGeneralPermissionManager = async (params: AddModuleParams) => {
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      NO_MODULE_DATA,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addCappedSTO = async (params: AddCappedSTOParams) => {
    const iface = new ethers.utils.Interface(CappedSTO.abi);
    const data = iface.functions.configure.encode([
      params.startTime,
      params.endTime,
      params.cap,
      params.rate,
      params.fundRaiseTypes,
      params.fundsReceiver
    ]);
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addUSDTieredSTO = async (params: AddUSDTieredSTOParams) => {
    const iface = new ethers.utils.Interface((USDTieredSTO as any).abi);
    const data = iface.functions.configure.encode([
      params.startTime,
      params.endTime,
      params.ratePerTier,
      params.ratePerTierDiscountPoly,
      params.tokensPerTierTotal,
      params.tokensPerTierDiscountPoly,
      params.nonAccreditedLimitUSD,
      params.minimumInvestmentUSD,
      params.fundRaiseTypes,
      params.wallet,
      params.reserveWallet,
      params.usdTokens,
    ]);
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addEtherDividendCheckpoint = async (params: AddEtherDividendCheckpointParams) => {
    const iface = new ethers.utils.Interface(EtherDividendCheckpoint.abi);
    const data = iface.functions.configure.encode([
      params.wallet
    ]);
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      data,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addManualApprovalTransferManager = async (params: AddModuleParams) => {
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      NO_MODULE_DATA,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  public addGeneralTransferManager = async (params: AddModuleParams) => {
    return (await this._contract).addModule.sendTransactionAsync(
      params.address,
      NO_MODULE_DATA,
      params.maxCost,
      params.budget,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * @return Returns the data associated to a module
   */
  public getModule = async (params: ModuleAddressParams) => {
    const result = await (await this._contract).getModule.callAsync(params.moduleAddress);
    const typedResult: ModuleData = {
      name: result[0],
      address: result[1],
      factoryAddress: result[2],
      archived: result[3],
      types: result[4].map(t => t.toNumber()),
    };
    return typedResult;
  }

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: VerifyTransferParams) => {
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
}
