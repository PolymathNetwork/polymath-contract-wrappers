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

interface LockUpTypeParams extends TxParams {
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: BigNumber;
  releaseFrequenciesSeconds: BigNumber;
  lockupName: string;
}

interface LockUpTypeMultiParams extends TxParams {
  lockupAmounts: BigNumber[];
  startTimes: Date[];
  lockUpPeriodSeconds: BigNumber[];
  releaseFrequenciesSeconds: BigNumber[];
  lockupNames: string[];
}

interface LockUpByNameParams extends TxParams {
  userAddress: string;
  lockupName: string;
}

interface LockUpByNameMultiParams extends TxParams {
  userAddresses: string[];
  lockupNames: string[];
}

interface AddNewLockUpToUserParams extends TxParams {
  userAddress: string;
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: BigNumber;
  releaseFrequenciesSeconds: BigNumber;
  lockupName: string;
}

interface AddNewLockUpToUserMultiParams extends TxParams {
  userAddresses: string[];
  lockupAmounts: BigNumber[];
  startTimes: Date[];
  lockUpPeriodSeconds: BigNumber[];
  releaseFrequenciesSeconds: BigNumber[];
  lockupNames: string[];
}

interface RemoveLockUpFromUserParams extends TxParams {
  userAddress: string;
  lockupName: string;
}

interface RemoveLockUpFromUserMultiParams extends TxParams {
  userAddresses: string[];
  lockupNames: string[];
}

interface RemoveLockUpTypeParams extends TxParams {
  lockupName: string;
}

interface RemoveLockUpTypeMultiParams extends TxParams {
  lockupNames: string[];
}

// // Return types ////
interface LockUp {
  lockupAmount: BigNumber;
  startTime: Date;
  lockUpPeriodSeconds: BigNumber;
  releaseFrequencySeconds: BigNumber;
}

interface LockUpWithAmount extends LockUp {
  unlockedAmount: BigNumber;
}

interface LockUpData extends LockUpWithAmount {
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
      lockUpPeriodSeconds: result[2],
      releaseFrequencySeconds: result[3],
    };
  };

  /**
   * @notice Get a specific element in a user's lockups array given the user's address and the element index
   * @param _lockupName The name of the lockup
   */
  public getLockUp = async (params: LockupsParams): Promise<LockUpWithAmount> => {
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
   * @notice Return the data of all the lockups
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
        lockUpPeriodSeconds: result[3][i],
        releaseFrequencySeconds: result[4][i],
        unlockedAmount: weiToValue(result[5][i], decimals),
      });
    }
    return typedResult;
  };

  /**
   * @notice get the list of user addresses of a specific lockup type by name
   * @param _lockupName Name of the lockup type
   * @return address List of users associated with the given lockup name
   */
  public getListOfAddresses = async (params: LockupsParams): Promise<string[]> => {
    assert.assert(params.lockupName.length > 0, 'LockUp name must not be an empty string');
    return (await this.contract).getListOfAddresses.callAsync(stringToBytes32(params.lockupName));
  };

  /**
   * @notice get the list of all lockups names
   * @return bytes32 Array of lockups names
   */
  public getAllLockups = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllLockups.callAsync());
  };

  /**
   * @notice get the list of the lockups for a given user
   * @param _user Address of the user
   * @return bytes32 List of lockups names associated with the given address
   */
  public getLockupsNamesToUser = async (params: UserAddressParams): Promise<string[]> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    return bytes32ArrayToStringArray(await (await this.contract).getLockupsNamesToUser.callAsync(params.user));
  };

  /**
   * @notice Use to get the total locked tokens for a given user
   * @param _userAddress Address of the user
   * @return uint256 Total locked tokens amount
   */
  public getLockedTokenToUser = async (params: UserAddressParams): Promise<BigNumber> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return weiToValue(await (await this.contract).getLockedTokenToUser.callAsync(params.user), decimals);
  };

  /**
   * @notice return the amount of tokens for a given user as per the partition
   * @param _partition Identifier
   * @param _tokenHolder Whom token amount need to query
   * @param _additionalBalance It is the `_value` that transfer during transfer/transferFrom function call
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
   * @notice Returns the permissions flags that are associated with Percentage transfer Manager
   */
  public getPermissions = async (): Promise<Perm[]> => {
    const permissions = await (await this.contract).getPermissions.callAsync();
    return permissions.map(parsePermBytes32Value);
  };

  /*
   * @notice Used to verify the transfer transaction and prevent locked up tokens from being transferred
   * @param _from Address of the sender
   * @param _amount The amount of tokens to transfer
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
   * @notice Use to add the new lockup type
   * @param _lockupAmount Amount of tokens that need to be locked.
   * @param _startTime When this lockup starts (seconds)
   * @param _lockUpPeriodSeconds Total period of lockup (seconds)
   * @param _releaseFrequencySeconds How often to release a tranche of tokens (seconds)
   * @param _lockupName Name of the lockup
   */
  public addNewLockUpType = async (params: LockUpTypeParams) => {
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
   * @notice Use to add multiple new lockup types
   * @param _lockupAmounts Array of amount of tokens that need to lock.
   * @param _startTimes Array of startTimes when this lockup starts (seconds)
   * @param _lockUpPeriodsSeconds Array of total period of lockup (seconds)
   * @param _releaseFrequenciesSeconds Array of how often to release a tranche of tokens (seconds)
   * @param _lockupNames Array of names of the lockup
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
      params.lockUpPeriodSeconds,
      params.releaseFrequenciesSeconds,
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /*
   * @notice Add a lockup to a specific user
   * @param _userAddress Address of the user
   * @param _lockupName Name of the lockup
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

  /*
   * @notice Add multiple lockups to multiple users
   * @param _userAddresses Array of addresses of the users
   * @param _lockupNames Array of names of the lockups
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

  /*
   * @notice Lets the admin create a volume restriction lockup for a given address.
   * @param _userAddress Address of the user whose tokens should be locked up
   * @param _lockupAmount Amount of tokens that need to lock.
   * @param _startTime When this lockup starts (seconds)
   * @param _lockUpPeriodSeconds Total period of lockup (seconds)
   * @param _releaseFrequencySeconds How often to release a tranche of tokens (seconds)
   * @param _lockupName Name of the lockup
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
      params.lockUpPeriodSeconds,
      params.releaseFrequenciesSeconds,
      stringToBytes32(params.lockupName),
      params.txData,
      params.safetyFactor,
    );
  };

  /*
   * @notice Lets the admin create multiple volume restriction lockups for multiple given addresses.
   * @param _userAddresses Array of address of the user whose tokens should be locked up
   * @param _lockupAmounts Array of the amounts that need to be locked for the different addresses.
   * @param _startTimes Array of When this lockup starts (seconds)
   * @param _lockUpPeriodsSeconds Array of total periods of lockup (seconds)
   * @param _releaseFrequenciesSeconds Array of how often to release a tranche of tokens (seconds)
   * @param _lockupNames Array of names of the lockup
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
      params.lockUpPeriodSeconds,
      params.releaseFrequenciesSeconds,
      stringArrayToBytes32Array(params.lockupNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /*
   * @notice Lets the admin remove a user from a lock up
   * @param _userAddress Address of the user whose tokens are locked up
   * @param _lockupName Name of the lockup need to be removed.
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

  /*
   * @notice Use to remove the lockup for multiple users
   * @param _userAddresses Array of addresses of the user whose tokens are locked up
   * @param _lockupNames Array of the names of the lockup that needs to be removed.
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

  /*
   * @notice Used to remove the lockup type
   * @param _lockupName Name of the lockup
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

  /*
   * @notice Used to remove the multiple lockup type
   * @param _lockupNames Array of the lockup names.
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

  /*
   * @notice Lets the admin modify a lockup.
   * @param _lockupAmount Amount of tokens that needs to be locked
   * @param _startTime When this lockup starts (seconds)
   * @param _lockUpPeriodSeconds Total period of lockup (seconds)
   * @param _releaseFrequencySeconds How often to release a tranche of tokens (seconds)
   * @param _lockupName name of the lockup that needs to be modified.
   */
  public modifyLockUpType = async (params: LockUpTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkModifyLockUpType(params);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    return (await this.contract).modifyLockUpType.sendTransactionAsync(
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
   * @notice Lets the admin modify a volume restriction lockup for multiple addresses.
   * @param _lockupAmounts Array of the amount of tokens that needs to be locked for the respective addresses.
   * @param _startTimes Array of the start time of the lockups (seconds)
   * @param _lockUpPeriodsSeconds Array of unix timestamp for the list of lockups (seconds).
   * @param _releaseFrequenciesSeconds How often to release a tranche of tokens (seconds)
   * @param _lockupNames Array of the lockup names that needs to be modified
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
      params.lockUpPeriodSeconds,
      params.releaseFrequenciesSeconds,
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
    assert.isBigNumberGreaterThanZero(params.lockUpPeriodSeconds, 'Lockup period in seconds should be greater than 0');
    assert.isBigNumberGreaterThanZero(
      params.releaseFrequenciesSeconds,
      'Release frequency in seconds should be greater than 0',
    );
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
