import {
  BigNumber,
  ContractAbi,
  LockUpTransferManager,
  LockUpTransferManagerAddLockUpToUserEventArgs,
  LockUpTransferManagerAddNewLockUpTypeEventArgs,
  LockUpTransferManagerContract,
  LockUpTransferManagerEventArgs,
  LockUpTransferManagerEvents,
  LockUpTransferManagerModifyLockUpTypeEventArgs,
  LockUpTransferManagerPauseEventArgs,
  LockUpTransferManagerRemoveLockUpFromUserEventArgs,
  LockUpTransferManagerRemoveLockUpTypeEventArgs,
  LockUpTransferManagerUnpauseEventArgs,
  LogWithDecodedArgs,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../../utils/assert';
import ModuleWrapper from '../module_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  EventCallback,
  GetLogs,
  GetLogsAsyncParams,
  Partition,
  Perm,
  Subscribe,
  SubscribeAsyncParams,
  TransferResult,
  TxParams,
} from '../../../types';
import {
  bigNumberToDate,
  bytes32ArrayToStringArray,
  bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  parsePermBytes32Value,
  parseTransferResult,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueArrayToWeiArray,
  valueToWei,
  weiToValue,
} from '../../../utils/convert';

interface AddLockUpToUserSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.AddLockUpToUser;
  callback: EventCallback<LockUpTransferManagerAddLockUpToUserEventArgs>;
}

interface GetAddLockUpToUserLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.AddLockUpToUser;
}

interface RemoveLockUpFromUserSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.RemoveLockUpFromUser;
  callback: EventCallback<LockUpTransferManagerRemoveLockUpFromUserEventArgs>;
}

interface GetRemoveLockUpFromUserLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.RemoveLockUpFromUser;
}

interface ModifyLockUpTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.ModifyLockUpType;
  callback: EventCallback<LockUpTransferManagerModifyLockUpTypeEventArgs>;
}

interface GetModifyLockUpTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.ModifyLockUpType;
}

interface AddNewLockUpTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.AddNewLockUpType;
  callback: EventCallback<LockUpTransferManagerAddNewLockUpTypeEventArgs>;
}

interface GetAddNewLockUpTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.AddNewLockUpType;
}

interface RemoveLockUpTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.RemoveLockUpType;
  callback: EventCallback<LockUpTransferManagerRemoveLockUpTypeEventArgs>;
}

interface GetRemoveLockUpTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.RemoveLockUpType;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.Pause;
  callback: EventCallback<LockUpTransferManagerPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: LockUpTransferManagerEvents.Unpause;
  callback: EventCallback<LockUpTransferManagerUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: LockUpTransferManagerEvents.Unpause;
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
    LogWithDecodedArgs<LockUpTransferManagerAddLockUpToUserEventArgs>[]
  >;
  (params: GetRemoveLockUpFromUserLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerRemoveLockUpFromUserEventArgs>[]
  >;
  (params: GetModifyLockUpTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerModifyLockUpTypeEventArgs>[]
  >;
  (params: GetAddNewLockUpTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerAddNewLockUpTypeEventArgs>[]
  >;
  (params: GetRemoveLockUpTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<LockUpTransferManagerRemoveLockUpTypeEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<LockUpTransferManagerPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<LockUpTransferManagerUnpauseEventArgs>[]>;
}

interface LockupsParams extends TxParams {
  lockupName: string;
}

interface UserAddressParams {
  user: string;
}

interface GetTokensByPartitionParams {
  partition: Partition;
  tokenHolder: string;
  additionalBalance: BigNumber;
}

interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

interface AddNewLockUpTypeParams extends TxParams {
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: BigNumber;
  releaseFrequenciesSeconds: BigNumber;
  lockupName: string;
}

interface AddNewLockUpTypeMultiParams extends TxParams {
  lockupAmounts: BigNumber[];
  startTimes: Date[];
  lockUpPeriodSeconds: BigNumber[];
  releaseFrequenciesSeconds: BigNumber[];
  lockupNames: string[];
}

interface AddLockUpByNameParams extends TxParams {
  userAddress: string;
  lockupName: string;
}

interface AddLockUpByNameMultiParams extends TxParams {
  userAddresses: string[];
  lockupNames: string[];
}

// // Return types ////
interface LockUp {
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: BigNumber;
  releaseFrequencySeconds: BigNumber;
}

interface GetLockUp extends LockUp {
  unlockedAmount: BigNumber;
}

interface GetLockupData extends GetLockUp {
  lockupName: string;
}

interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}

/**
 * This class includes the functionality related to interacting with the LockUp Transfer Manager contract.
 */
export default class LockUpTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = LockUpTransferManager.abi;

  protected contract: Promise<LockUpTransferManagerContract>;

  /**
   * Instantiate LockUpTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<LockUpTransferManagerContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   * Return the lockups
   */
  public lockups = async (params: LockupsParams): Promise<LockUp> => {
    assert.assert(params.lockupName.length > 0, 'LockUp Details must not be an empty string');
    const result = await (await this.contract).lockups.callAsync(stringToBytes32(params.lockupName));
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      lockupAmount: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      lockUpPeriodSeconds: result[2],
      releaseFrequencySeconds: result[3],
    };
  };

  /**
   * getLockups
   */
  public getLockUp = async (params: LockupsParams): Promise<GetLockUp> => {
    assert.assert(params.lockupName.length > 0, 'LockUp Details must not be an empty string');
    const result = await (await this.contract).getLockUp.callAsync(stringToBytes32(params.lockupName));
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      lockupAmount: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      lockUpPeriodSeconds: result[2],
      releaseFrequencySeconds: result[3],
      unlockedAmount: weiToValue(result[4], decimals),
    };
  };

  /**
   * getAllLockupData
   */
  public getAllLockupData = async (): Promise<GetLockupData[]> => {
    const result = await (await this.contract).getAllLockupData.callAsync();
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: GetLockupData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push({
        lockupName: bytes32ToString(result[0][i]),
        lockupAmount: weiToValue(result[1][i], decimals),
        startTime: bigNumberToDate(result[2][i]),
        lockUpPeriodSeconds: result[3][i],
        releaseFrequencySeconds: result[4][i],
        unlockedAmount: weiToValue(result[5][i], decimals),
      });
    }
    return typedResult;
  };

  /**
   * getListOfAddresses
   */
  public getListOfAddresses = async (params: LockupsParams): Promise<string[]> => {
    assert.assert(params.lockupName.length > 0, 'LockUp Details must not be an empty string');
    return (await this.contract).getListOfAddresses.callAsync(stringToBytes32(params.lockupName));
  };

  /**
   * getAllLockups
   */
  public getAllLockups = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllLockups.callAsync());
  };

  /**
   * getLockupsNamesToUser
   */
  public getLockupsNamesToUser = async (params: UserAddressParams): Promise<string[]> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    return bytes32ArrayToStringArray(await (await this.contract).getLockupsNamesToUser.callAsync(params.user));
  };

  /**
   * getLockedTokenToUser
   */
  public getLockedTokenToUser = async (params: UserAddressParams): Promise<BigNumber> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(await (await this.contract).getLockedTokenToUser.callAsync(params.user), decimals);
  };

  /**
   * getTokensByPartition
   */
  public getTokensByPartition = async (params: GetTokensByPartitionParams): Promise<BigNumber> => {
    assert.isNonZeroETHAddressHex('Token Holder', params.tokenHolder);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(
      await (await this.contract).getTokensByPartition.callAsync(
        params.partition,
        params.tokenHolder,
        valueToWei(params.additionalBalance, decimals),
      ),
      decimals,
    );
  };

  /**
   * getPermissions
   */
  public getPermissions = async (): Promise<Perm[]> => {
    const permissions = await (await this.contract).getPermissions.callAsync();
    return permissions.map(parsePermBytes32Value);
  };

  /*
   * verifyTransfer
   */
  public verifyTransfer = async (params: VerifyTransferParams): Promise<VerifyTransfer> => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
    );
    const transferResult = parseTransferResult(result[0]);
    return {
      transferResult,
      address: result[1],
    };
  };

  /*
   * addNewLockUpType
   */
  public addNewLockUpType = async (params: AddNewLockUpTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddNewLockUpType(params);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addNewLockUpType.sendTransactionAsync(
      valueToWei(params.lockupAmount, decimals),
      dateToBigNumber(params.startTime),
      params.lockUpPeriodSeconds,
      params.releaseFrequenciesSeconds,
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /*
   * addNewLockUpTypeMulti
   */
  public addNewLockUpTypeMulti = async (params: AddNewLockUpTypeMultiParams) => {
    assert.assert(params.lockupAmounts.length > 0, 'Empty lockup information');
    assert.areValidArrayLengths(
      [
        params.lockupAmounts,
        params.lockupNames,
        params.releaseFrequenciesSeconds,
        params.lockUpPeriodSeconds,
        params.startTimes,
      ],
      'Argument arrays length mismatch',
    );
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.lockupNames.length; i += 1) {
      results.push(
        this.checkAddNewLockUpType({
          lockupAmount: params.lockupAmounts[i],
          startTime: params.startTimes[i],
          lockUpPeriodSeconds: params.lockUpPeriodSeconds[i],
          releaseFrequenciesSeconds: params.releaseFrequenciesSeconds[i],
          lockupName: params.lockupNames[i],
        }),
      );
    }
    await Promise.all(results);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addNewLockUpTypeMulti.sendTransactionAsync(
      valueArrayToWeiArray(params.lockupAmounts, decimals),
      dateArrayToBigNumberArray(params.startTimes),
      params.lockUpPeriodSeconds,
      params.releaseFrequenciesSeconds,
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /*
   * addLockUpByName
   */
  public addLockUpByName = async (params: AddLockUpByNameParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddLockUpByName(params);
    return (await this.contract).addLockUpByName.sendTransactionAsync(
      params.userAddress,
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /*
   * addLockUpByNameMulti
   */
  public addLockUpByNameMulti = async (params: AddLockUpByNameMultiParams) => {
    assert.assert(params.lockupNames.length > 0, 'Empty lockup information');
    assert.areValidArrayLengths([params.userAddresses, params.lockupNames], 'Argument arrays length mismatch');
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.lockupNames.length; i += 1) {
      results.push(
        this.checkAddLockUpByName({
          lockupName: params.lockupNames[i],
          userAddress: params.userAddresses[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).addLockUpByNameMulti.sendTransactionAsync(
      params.userAddresses,
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: LockUpTransferManagerSubscribeAsyncParams = async <
    ArgsType extends LockUpTransferManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, LockUpTransferManagerEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      LockUpTransferManager.abi,
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
    ArgsType extends LockUpTransferManagerEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, LockUpTransferManagerEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      LockUpTransferManager.abi,
    );
    return logs;
  };

  private checkAddNewLockUpType = async (params: AddNewLockUpTypeParams) => {
    assert.assert(params.lockupName.length > 0, 'Lockup Name cannot be empty string');
    const lockup = await this.getLockUp({ lockupName: params.lockupName });
    assert.isBigNumberZero(lockup.lockupAmount, 'LockUp already exists');
    assert.isFutureDate(params.startTime, 'Start time must be in the future');
    assert.isBigNumberGreaterThanZero(params.lockUpPeriodSeconds, 'Lockup period in seconds should be greater than 0');
    assert.isBigNumberGreaterThanZero(
      params.releaseFrequenciesSeconds,
      'Release frequency in seconds should be greater than 0',
    );
    assert.isBigNumberGreaterThanZero(params.lockupAmount, 'Lockup amount should be greater than 0');
  };

  private checkAddLockUpByName = async (params: AddLockUpByNameParams) => {
    assert.assert(params.lockupName.length > 0, 'Lockup Name cannot be empty string');
    assert.isNonZeroETHAddressHex('User Address', params.userAddress);
    const lockup = await this.getLockUp({ lockupName: params.lockupName });
    assert.isFutureDate(lockup.startTime, 'Start time must be in the future');
    const lockupNames = await this.getLockupsNamesToUser({ user: params.userAddress });
    console.log(lockupNames);
    console.log(params.lockupName);
    assert.assert(!lockupNames.includes(params.lockupName), 'User already added to this lockup name');
  };
}
