import { LockUpTransferManagerContract_3_0_0, LockUpTransferManagerEvents_3_0_0, LockUpTransferManagerAddLockUpToUserEventArgs_3_0_0, LockUpTransferManagerRemoveLockUpFromUserEventArgs_3_0_0, LockUpTransferManagerModifyLockUpTypeEventArgs_3_0_0, LockUpTransferManagerAddNewLockUpTypeEventArgs_3_0_0, LockUpTransferManagerRemoveLockUpTypeEventArgs_3_0_0, LockUpTransferManagerPauseEventArgs_3_0_0, LockUpTransferManagerUnpauseEventArgs_3_0_0, LogWithDecodedArgs, LockUpTransferManagerEventArgs_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import LockUpTransferManagerCommon from './common';
import { ContractVersion, SubscribeAsyncParams, GetLogsAsyncParams, Subscribe, GetLogs, Constructor, EventCallback } from '../../../../types';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';
import { WithModule_3_0_0 } from '../../module_wrapper';

interface AddLockUpToUserSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.AddLockUpToUser;
  callback: EventCallback<LockUpTransferManagerAddLockUpToUserEventArgs_3_0_0>;
}

interface GetAddLockUpToUserLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.AddLockUpToUser;
}

interface RemoveLockUpFromUserSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.RemoveLockUpFromUser;
  callback: EventCallback<LockUpTransferManagerRemoveLockUpFromUserEventArgs_3_0_0>;
}

interface GetRemoveLockUpFromUserLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.RemoveLockUpFromUser;
}

interface ModifyLockUpTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.ModifyLockUpType;
  callback: EventCallback<LockUpTransferManagerModifyLockUpTypeEventArgs_3_0_0>;
}

interface GetModifyLockUpTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.ModifyLockUpType;
}

interface AddNewLockUpTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.AddNewLockUpType;
  callback: EventCallback<LockUpTransferManagerAddNewLockUpTypeEventArgs_3_0_0>;
}

interface GetAddNewLockUpTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.AddNewLockUpType;
}

interface RemoveLockUpTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.RemoveLockUpType;
  callback: EventCallback<LockUpTransferManagerRemoveLockUpTypeEventArgs_3_0_0>;
}

interface GetRemoveLockUpTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.RemoveLockUpType;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.Pause;
  callback: EventCallback<LockUpTransferManagerPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.Unpause;
  callback: EventCallback<LockUpTransferManagerUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents_3_0_0.Unpause;
}

interface LockUpTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: AddLockUpToUserSubscribeAsyncParams): Promise<string>;
  (params: RemoveLockUpFromUserSubscribeAsyncParams): Promise<string>;
  (params: ModifyLockUpTypeSubscribeAsyncParams): Promise<string>;
  (params: AddNewLockUpTypeSubscribeAsyncParams): Promise<string>;
  (params: RemoveLockUpTypeSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetLockUpTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetAddLockUpToUserLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerAddLockUpToUserEventArgs_3_0_0>[]
  >;
  (params: GetRemoveLockUpFromUserLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerRemoveLockUpFromUserEventArgs_3_0_0>[]
  >;
  (params: GetModifyLockUpTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerModifyLockUpTypeEventArgs_3_0_0>[]
  >;
  (params: GetAddNewLockUpTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerAddNewLockUpTypeEventArgs_3_0_0>[]
  >;
  (params: GetRemoveLockUpTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerRemoveLockUpTypeEventArgs_3_0_0>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<LockUpTransferManagerPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<LockUpTransferManagerUnpauseEventArgs_3_0_0>[]>;
}

const LockUpTransferManagerBase_3_0_0 = WithModule_3_0_0(LockUpTransferManagerCommon as unknown as Constructor<LockUpTransferManagerCommon>);

export class LockUpTransferManager_3_0_0 extends LockUpTransferManagerBase_3_0_0 {
  public contract: Promise<LockUpTransferManagerContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
     * Instantiate LockUpTransferManagerWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param contract
     * @param contractFactory
     */
    public constructor(
      web3Wrapper: Web3Wrapper,
      contract: Promise<LockUpTransferManagerContract_3_0_0>,
      contractFactory: ContractFactory,
    ) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: LockUpTransferManagerSubscribeAsyncParams = async <
    ArgsType extends LockUpTransferManagerEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, LockUpTransferManagerEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContract_3_0_0Address = (await this.contract).address.toLowerCase();
    const subscriptionToken = await this.subscribeInternal<ArgsType>(
      normalizedContract_3_0_0Address,
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
  public getLogsAsync: GetLockUpTransferManagerLogsAsyncParams = async <
    ArgsType extends LockUpTransferManagerEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, LockUpTransferManagerEvents_3_0_0);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContract_3_0_0Address = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContract_3_0_0Address,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isLockUpTransferManager_3_0_0(
  wrapper: LockUpTransferManagerCommon,
): wrapper is LockUpTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
