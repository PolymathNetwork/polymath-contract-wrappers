import {
  BigNumber,
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
  numberArrayToBigNumberArray,
  numberToBigNumber,
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

export namespace LockUpTransferManagerTransactionParams {
  export interface AddNewLockUpType extends LockUpTypeParams {}
  export interface ModifyLockUpType extends LockUpTypeParams {}
  export interface AddNewLockUpTypeMulti extends LockUpTypeMultiParams {}
  export interface ModifyLockUpTypeMulti extends LockUpTypeMultiParams {}
  export interface AddLockUpByName extends LockUpByNameParams {}
  export interface AddLockUpByNameMulti extends LockUpByNameMultiParams {}
  export interface AddNewLockUpToUser extends AddNewLockUpToUserParams {}
  export interface AddNewLockUpToUserMulti extends AddNewLockUpToUserMultiParams {}
  export interface RemoveLockUpFromUser extends RemoveLockUpFromUserParams {}
  export interface RemoveLockUpFromUserMulti extends RemoveLockUpFromUserMultiParams {}
  export interface RemoveLockUpType extends RemoveLockUpTypeParams {}
  export interface RemoveLockUpTypeMulti extends RemoveLockUpTypeMultiParams {}
}

/**
 * @param lockupName The name of the lockup
 */
interface LockupsParams {
  lockupName: string;
}

/**
 * @param user Address of the user
 */
interface UserAddressParams {
  user: string;
}

/**
 * @param partition Identifier
 * @param tokenHolder Whom token amount need to query
 * @param additionalBalance It is the `value` that transfers during transfer/transferFrom function call
 */
interface GetTokensByPartitionParams {
  partition: Partition;
  tokenHolder: string;
  additionalBalance: BigNumber;
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount The amount of tokens to transfer
 * @param data
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

/**
 * @param lockupAmount Amount of tokens that need to be locked.
 * @param startTime When this lockup starts (seconds)
 * @param lockUpPeriodSeconds Total period of lockup (seconds)
 * @param releaseFrequencySeconds How often to release a tranche of tokens (seconds)
 * @param lockupName Name of the lockup
 */
interface LockUpTypeParams extends TxParams {
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: number;
  releaseFrequenciesSeconds: number;
  lockupName: string;
}

/**
 * @param lockupAmounts Array of amount of tokens that need to lock.
 * @param startTimes Array of startTimes when this lockup starts (seconds)
 * @param lockUpPeriodsSeconds Array of total period of lockup (seconds)
 * @param releaseFrequenciesSeconds Array of how often to release a tranche of tokens (seconds)
 * @param lockupNames Array of names of the lockup
 */
interface LockUpTypeMultiParams extends TxParams {
  lockupAmounts: BigNumber[];
  startTimes: Date[];
  lockUpPeriodSeconds: number[];
  releaseFrequenciesSeconds: number[];
  lockupNames: string[];
}

/**
 * @param userAddress Address of the user
 * @param lockupName Name of the lockup
 */
interface LockUpByNameParams extends TxParams {
  userAddress: string;
  lockupName: string;
}

/**
 * @param userAddresses Array of addresses of the users
 * @param lockupNames Array of names of the lockups
 */
interface LockUpByNameMultiParams extends TxParams {
  userAddresses: string[];
  lockupNames: string[];
}

/**
 * @param userAddress Address of the user whose tokens should be locked up
 * @param lockupAmount Amount of tokens that need to lock.
 * @param startTime When this lockup starts (seconds)
 * @param lockUpPeriodSeconds Total period of lockup (seconds)
 * @param releaseFrequencySeconds How often to release a tranche of tokens (seconds)
 * @param lockupName Name of the lockup
 */
interface AddNewLockUpToUserParams extends TxParams {
  userAddress: string;
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: number;
  releaseFrequenciesSeconds: number;
  lockupName: string;
}

/**
 * @param userAddresses Array of address of the user whose tokens should be locked up
 * @param lockupAmounts Array of the amounts that need to be locked for the different addresses.
 * @param startTimes Array of When this lockup starts (seconds)
 * @param lockUpPeriodsSeconds Array of total periods of lockup (seconds)
 * @param releaseFrequenciesSeconds Array of how often to release a tranche of tokens (seconds)
 * @param lockupNames Array of names of the lockup
 */
interface AddNewLockUpToUserMultiParams extends TxParams {
  userAddresses: string[];
  lockupAmounts: BigNumber[];
  startTimes: Date[];
  lockUpPeriodSeconds: number[];
  releaseFrequenciesSeconds: number[];
  lockupNames: string[];
}

/**
 * @param userAddress Address of the user whose tokens are locked up
 * @param lockupName Name of the lockup need to be removed.
 */
interface RemoveLockUpFromUserParams extends TxParams {
  userAddress: string;
  lockupName: string;
}

/**
 * @param userAddresses Array of addresses of the user whose tokens are locked up
 * @param lockupNames Array of the names of the lockup that needs to be removed.
 */
interface RemoveLockUpFromUserMultiParams extends TxParams {
  userAddresses: string[];
  lockupNames: string[];
}

/**
 * @param lockupName Name of the lockup
 */
interface RemoveLockUpTypeParams extends TxParams {
  lockupName: string;
}

/**
 * @param lockupNames Array of the lockup names.
 */
interface RemoveLockUpTypeMultiParams extends TxParams {
  lockupNames: string[];
}

// // Return types ////

/**
 * @param lockupAmount Amount of tokens locked up
 * @param startTime Date lockup will start
 * @param lockupPeriodSeconds Number of seconds tokens will be locked
 * @param releaseFrequencySeconds Number of seconds until tranche of tokens unlocked
 */
interface LockUp {
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: number;
  releaseFrequencySeconds: number;
}

/**
 * @param unlockedAmount Amount of tokens already unlocked
 */
interface LockUpWithAmount extends LockUp {
  unlockedAmount: BigNumber;
}

/**
 * @param lockupName The name of the lockup
 */
interface LockUpData extends LockUpWithAmount {
  lockupName: string;
}

/**
 * @param transferResult
 * @param address
 */
interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}

/**
 * This class includes the functionality related to interacting with the LockUp Transfer Manager contract.
 */
export default class LockUpTransferManagerWrapper extends ModuleWrapper {
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

  /**
   *  unpause the module
   */
  public unpause = async (params: TxParams) => {
    assert.assert(await this.paused(), 'Controller not currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  check if the module is paused
   */
  public paused = async () => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  pause the module
   */
  public pause = async (params: TxParams) => {
    assert.assert(!(await this.paused()), 'Controller currently paused');
    assert.assert(await this.isCallerTheSecurityTokenOwner(params.txData), 'Sender is not owner');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  mapping used to store the lockup details corresponds to lockup name
   */
  public lockups = async (params: LockupsParams): Promise<LockUp> => {
    assert.assert(params.lockupName.length > 0, 'LockUp Details must not be an empty string');
    const result = await (await this.contract).lockups.callAsync(stringToBytes32(params.lockupName));
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      lockupAmount: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      lockUpPeriodSeconds: result[2].toNumber(),
      releaseFrequencySeconds: result[3].toNumber(),
    };
  };

  /**
   * Get a specific element in a user's lockups array given the user's address and the element index
   */
  public getLockUp = async (params: LockupsParams): Promise<LockUpWithAmount> => {
    assert.assert(params.lockupName.length > 0, 'LockUp Details must not be an empty string');
    const result = await (await this.contract).getLockUp.callAsync(stringToBytes32(params.lockupName));
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return {
      lockupAmount: weiToValue(result[0], decimals),
      startTime: bigNumberToDate(result[1]),
      lockUpPeriodSeconds: result[2].toNumber(),
      releaseFrequencySeconds: result[3].toNumber(),
      unlockedAmount: weiToValue(result[4], decimals),
    };
  };

  /**
   * Return the data of all the lockups
   */
  public getAllLockupData = async (): Promise<LockUpData[]> => {
    const result = await (await this.contract).getAllLockupData.callAsync();
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const typedResult: LockUpData[] = [];
    for (let i = 0; i < result[0].length; i += 1) {
      typedResult.push({
        lockupName: bytes32ToString(result[0][i]),
        lockupAmount: weiToValue(result[1][i], decimals),
        startTime: bigNumberToDate(result[2][i]),
        lockUpPeriodSeconds: result[3][i].toNumber(),
        releaseFrequencySeconds: result[4][i].toNumber(),
        unlockedAmount: weiToValue(result[5][i], decimals),
      });
    }
    return typedResult;
  };

  /**
   * Get the list of user addresses of a specific lockup type by name
   * @return address List of users associated with the given lockup name
   */
  public getListOfAddresses = async (params: LockupsParams): Promise<string[]> => {
    assert.assert(params.lockupName.length > 0, 'LockUp name must not be an empty string');
    return (await this.contract).getListOfAddresses.callAsync(stringToBytes32(params.lockupName));
  };

  /**
   * Get the list of all lockups names
   * @return bytes32 Array of lockups names
   */
  public getAllLockups = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllLockups.callAsync());
  };

  /**
   * Get the list of the lockups for a given user
   * @return bytes32 List of lockups names associated with the given address
   */
  public getLockupsNamesToUser = async (params: UserAddressParams): Promise<string[]> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    return bytes32ArrayToStringArray(await (await this.contract).getLockupsNamesToUser.callAsync(params.user));
  };

  /**
   * Use to get the total locked tokens for a given user
   * @return uint256 Total locked tokens amount
   */
  public getLockedTokenToUser = async (params: UserAddressParams): Promise<BigNumber> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(await (await this.contract).getLockedTokenToUser.callAsync(params.user), decimals);
  };

  /**
   * Return the amount of tokens for a given user as per the partition
   * @return Amount of tokens
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
   * Returns the permissions flags that are associated with Percentage transfer Manager
   */
  public getPermissions = async (): Promise<Perm[]> => {
    const permissions = await (await this.contract).getPermissions.callAsync();
    return permissions.map(parsePermBytes32Value);
  };

  /**
   * Used to verify the transfer transaction and prevent locked up tokens from being transferred
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

  /**
   * Use to add the new lockup type
   */
  public addNewLockUpType = async (params: LockUpTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddNewLockUpType(params);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addNewLockUpType.sendTransactionAsync(
      valueToWei(params.lockupAmount, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.lockUpPeriodSeconds),
      numberToBigNumber(params.releaseFrequenciesSeconds),
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to add multiple new lockup types
   */
  public addNewLockUpTypeMulti = async (params: LockUpTypeMultiParams) => {
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
      numberArrayToBigNumberArray(params.lockUpPeriodSeconds),
      numberArrayToBigNumberArray(params.releaseFrequenciesSeconds),
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Add a lockup to a specific user
   */
  public addLockUpByName = async (params: LockUpByNameParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddLockUpByName(params);
    return (await this.contract).addLockUpByName.sendTransactionAsync(
      params.userAddress,
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Add multiple lockups to multiple users
   */
  public addLockUpByNameMulti = async (params: LockUpByNameMultiParams) => {
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
   * Lets the admin create a volume restriction lockup for a given address.
   */
  public addNewLockUpToUser = async (params: AddNewLockUpToUserParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.isNonZeroETHAddressHex('User Address', params.userAddress);
    // CheckAddNewLockUpType only because no point checking a user that can't be added to lockup
    await this.checkAddNewLockUpType(params);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).addNewLockUpToUser.sendTransactionAsync(
      params.userAddress,
      valueToWei(params.lockupAmount, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.lockUpPeriodSeconds),
      numberToBigNumber(params.releaseFrequenciesSeconds),
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Lets the admin create multiple volume restriction lockups for multiple given addresses.
   */
  public addNewLockUpToUserMulti = async (params: AddNewLockUpToUserMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    params.userAddresses.map(address => {
      return assert.isNonZeroETHAddressHex('User Address', address);
    });
    assert.assert(params.lockupAmounts.length > 0, 'Empty lockup information');
    assert.areValidArrayLengths(
      [
        params.userAddresses,
        params.lockupAmounts,
        params.lockupNames,
        params.releaseFrequenciesSeconds,
        params.lockUpPeriodSeconds,
        params.startTimes,
      ],
      'Argument arrays length mismatch',
    );
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
    return (await this.contract).addNewLockUpToUserMulti.sendTransactionAsync(
      params.userAddresses,
      valueArrayToWeiArray(params.lockupAmounts, decimals),
      dateArrayToBigNumberArray(params.startTimes),
      numberArrayToBigNumberArray(params.lockUpPeriodSeconds),
      numberArrayToBigNumberArray(params.releaseFrequenciesSeconds),
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Lets the admin remove a user from a lock up
   */
  public removeLockUpFromUser = async (params: RemoveLockUpFromUserParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkRemoveLockUpFromUser(params);
    return (await this.contract).removeLockUpFromUser.sendTransactionAsync(
      params.userAddress,
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Use to remove the lockup for multiple users
   */
  public removeLockUpFromUserMulti = async (params: RemoveLockUpFromUserMultiParams) => {
    assert.assert(params.lockupNames.length > 0, 'Empty lockup information');
    assert.areValidArrayLengths([params.userAddresses, params.lockupNames], 'Argument arrays length mismatch');
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.lockupNames.length; i += 1) {
      results.push(
        this.checkRemoveLockUpFromUser({
          lockupName: params.lockupNames[i],
          userAddress: params.userAddresses[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).removeLockUpFromUserMulti.sendTransactionAsync(
      params.userAddresses,
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to remove the lockup type
   */
  public removeLockupType = async (params: RemoveLockUpTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkRemoveLockUpType(params.lockupName);
    return (await this.contract).removeLockupType.sendTransactionAsync(
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to remove the multiple lockup type
   */
  public removeLockupTypeMulti = async (params: RemoveLockUpTypeMultiParams) => {
    assert.assert(params.lockupNames.length > 0, 'Empty lockup information');
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.lockupNames.length; i += 1) {
      results.push(this.checkRemoveLockUpType(params.lockupNames[i]));
    }
    await Promise.all(results);
    return (await this.contract).removeLockupTypeMulti.sendTransactionAsync(
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Lets the admin modify a lockup.
   */
  public modifyLockUpType = async (params: LockUpTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkModifyLockUpType(params);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).modifyLockUpType.sendTransactionAsync(
      valueToWei(params.lockupAmount, decimals),
      dateToBigNumber(params.startTime),
      numberToBigNumber(params.lockUpPeriodSeconds),
      numberToBigNumber(params.releaseFrequenciesSeconds),
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Lets the admin modify a volume restriction lockup for multiple addresses.
   */
  public modifyLockUpTypeMulti = async (params: LockUpTypeMultiParams) => {
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
        this.checkModifyLockUpType({
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
    return (await this.contract).modifyLockUpTypeMulti.sendTransactionAsync(
      valueArrayToWeiArray(params.lockupAmounts, decimals),
      dateArrayToBigNumberArray(params.startTimes),
      numberArrayToBigNumberArray(params.lockUpPeriodSeconds),
      numberArrayToBigNumberArray(params.releaseFrequenciesSeconds),
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
    );
    return logs;
  };

  private checkAddNewLockUpType = async (params: LockUpTypeParams) => {
    await this.checkLockUpTypeInformation(params);
    const lockup = await this.getLockUp({ lockupName: params.lockupName });
    assert.isBigNumberZero(lockup.lockupAmount, 'LockUp already exists');
  };

  private checkModifyLockUpType = async (params: LockUpTypeParams) => {
    await this.checkLockUpTypeInformation(params);
    const lockup = await this.getLockUp({ lockupName: params.lockupName });
    assert.isNotDateZero(lockup.startTime, 'LockUp already exists');
  };

  private checkLockUpTypeInformation = async (params: LockUpTypeParams) => {
    assert.assert(params.lockupName.length > 0, 'Lockup Name cannot be empty string');
    assert.isFutureDate(params.startTime, 'Start time must be in the future');
    assert.assert(params.lockUpPeriodSeconds > 0, 'Lockup period in seconds should be greater than 0');
    assert.assert(params.releaseFrequenciesSeconds > 0, 'Release frequency in seconds should be greater than 0');
    assert.isBigNumberGreaterThanZero(params.lockupAmount, 'Lockup amount should be greater than 0');
  };

  private checkAddLockUpByName = async (params: LockUpByNameParams) => {
    assert.assert(params.lockupName.length > 0, 'Lockup Name cannot be empty string');
    assert.isNonZeroETHAddressHex('User Address', params.userAddress);
    const lockupNames = await this.getLockupsNamesToUser({ user: params.userAddress });
    assert.assert(!lockupNames.includes(params.lockupName), 'User already added to this lockup name');
    const lockup = await this.getLockUp({ lockupName: params.lockupName });
    assert.isFutureDate(lockup.startTime, 'Start time must be in the future');
  };

  private checkRemoveLockUpFromUser = async (params: LockUpByNameParams) => {
    assert.assert(params.lockupName.length > 0, 'Lockup Name cannot be empty string');
    assert.isNonZeroETHAddressHex('User Address', params.userAddress);
    const lockupNames = await this.getLockupsNamesToUser({ user: params.userAddress });
    assert.assert(
      lockupNames.includes(params.lockupName),
      'User not added to this lockup name, not included in lookup',
    );
  };

  private checkRemoveLockUpType = async (lockupName: string) => {
    assert.assert(lockupName.length > 0, 'Lockup Name cannot be empty string');
    const lockup = await this.getLockUp({ lockupName });
    assert.isNotDateZero(lockup.startTime, 'Lockup does not exist');
    const lockupListOfAddresses = await this.getListOfAddresses({ lockupName });
    assert.assert(
      lockupListOfAddresses.length === 0,
      'There are users attached to the lockup that must be removed before removing the lockup type',
    );
  };
}
