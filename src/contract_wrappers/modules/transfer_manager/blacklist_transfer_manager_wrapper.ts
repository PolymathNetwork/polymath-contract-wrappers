import {
  BigNumber,
  BlacklistTransferManagerContract,
  BlacklistTransferManagerEventArgs,
  BlacklistTransferManagerEvents,
  BlacklistTransferManagerPauseEventArgs,
  BlacklistTransferManagerUnpauseEventArgs,
  BlacklistTransferManagerAddBlacklistTypeEventArgs,
  BlacklistTransferManagerModifyBlacklistTypeEventArgs,
  BlacklistTransferManagerDeleteBlacklistTypeEventArgs,
  BlacklistTransferManagerAddInvestorToBlacklistEventArgs,
  BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs,
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
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberArrayToBigNumberArray,
  numberToBigNumber,
  parsePermBytes32Value,
  parseTransferResult,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueToWei,
  weiToValue,
} from '../../../utils/convert';

interface DeleteInvestorFromBlacklistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.DeleteInvestorFromBlacklist;
  callback: EventCallback<BlacklistTransferManagerDeleteInvestorFromBlacklistEventArgs>;
}

interface GetDeleteInvestorFromBlacklistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.DeleteInvestorFromBlacklist;
}

interface AddInvestorToBlacklistSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.AddInvestorToBlacklist;
  callback: EventCallback<BlacklistTransferManagerAddInvestorToBlacklistEventArgs>;
}

interface GetAddInvestorToBlacklistLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.AddInvestorToBlacklist;
}

interface DeleteBlacklistTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.DeleteBlacklistType;
  callback: EventCallback<BlacklistTransferManagerDeleteBlacklistTypeEventArgs>;
}

interface GetDeleteBlacklistTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.DeleteBlacklistType;
}

interface ModifyBlacklistTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.ModifyBlacklistType;
  callback: EventCallback<BlacklistTransferManagerModifyBlacklistTypeEventArgs>;
}

interface GetModifyBlacklistTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.ModifyBlacklistType;
}

interface AddBlacklistTypeSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.AddBlacklistType;
  callback: EventCallback<BlacklistTransferManagerAddBlacklistTypeEventArgs>;
}

interface GetAddBlacklistTypeLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.AddBlacklistType;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.Pause;
  callback: EventCallback<BlacklistTransferManagerPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: BlacklistTransferManagerEvents.Unpause;
  callback: EventCallback<BlacklistTransferManagerUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: BlacklistTransferManagerEvents.Unpause;
}

interface BlacklistTransferManagerSubscribeAsyncParams extends Subscribe {
  (params: AddBlacklistTypeSubscribeAsyncParams): Promise<string>;
  (params: ModifyBlacklistTypeSubscribeAsyncParams): Promise<string>;
  (params: DeleteBlacklistTypeSubscribeAsyncParams): Promise<string>;
  (params: AddInvestorToBlacklistSubscribeAsyncParams): Promise<string>;
  (params: DeleteInvestorFromBlacklistSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetBlacklistTransferManagerLogsAsyncParams extends GetLogs {
  (params: GetAddBlacklistTypeLogsAsyncParams): Promise<LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs>[]>;
  (params: GetModifyBlacklistTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs>[]
  >;
  (params: GetDeleteBlacklistTypeLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs>[]
  >;
  (params: GetAddInvestorToBlacklistLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs>[]
  >;
  (params: GetDeleteInvestorFromBlacklistLogsAsyncParams): Promise<
    LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs>[]
  >;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<BlacklistTransferManagerPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<BlacklistTransferManagerUnpauseEventArgs>[]>;
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount
 * @param data
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
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
 * @param blacklistName Name of the blacklist type
 */
interface BlacklistParams extends TxParams {
  blacklistName: string;
}

/**
 * @param user Address of the user
 */
interface UserAddressParams {
  user: string;
}

/**
 * @param startTime Start date of the blacklist type
 * @param endTime End date of the blacklist type
 * @param blacklistName Name of the blacklist type
 * @param repeatPeriodTime Repeat period of the blacklist type (measured in days)
 */
interface BlacklistTypeParams extends TxParams {
  startTime: Date;
  endTime: Date;
  blacklistName: string;
  repeatPeriodTime: number;
}

/**
 * @param startTime Start date of the blacklist type
 * @param endTime End date of the blacklist type
 * @param blacklistName Name of the blacklist type
 * @param repeatPeriodTime Repeat period of the blacklist type (measured in days)
 * @param investor Address of the investor
 */
interface AddNewInvestorToNewBlacklistParams extends BlacklistTypeParams {
  investor: string;
}

/**
 * @param startTimes Start dates of the blacklist types
 * @param endTimes End dates of the blacklist types
 * @param blacklistNames Names of the blacklist types
 * @param repeatPeriodTimes Repeat periods of the blacklist type (measured in days)
 */
interface BlacklistTypeMultiParams extends TxParams {
  startTimes: Date[];
  endTimes: Date[];
  blacklistNames: string[];
  repeatPeriodTimes: number[];
}

/**
 * @param blacklistName Name of the blacklist type
 */
interface DeleteBlacklistTypeParams extends TxParams {
  blacklistName: string;
}

/**
 * @param blacklistNames Names of the blacklist types
 */
interface DeleteBlacklistTypeMultiParams extends TxParams {
  blacklistNames: string[];
}

/**
 * @param investor Address of the investor
 * @param blacklistName Name of the blacklist
 */
interface InvestorAndBlacklistParams extends TxParams {
  userAddress: string;
  blacklistName: string;
}

/**
 * @param investor Address of the investor
 */
interface DeleteInvestorFromAllBlacklistParams extends TxParams {
  investor: string;
}

/**
 * @param investor Addresses of the investors
 */
interface DeleteInvestorFromAllBlacklistMultiParams extends TxParams {
  investors: string[];
}

/**
 * @param investors Address of the investor
 * @param blacklistName Name of the blacklist
 */
interface InvestorMultiAndBlacklistParams extends TxParams {
  userAddresses: string[];
  blacklistName: string;
}

/**
 * @param investors Address of the investor
 * @param blacklistNames Name of the blacklist
 */
interface InvestorMultiAndBlacklistMultiParams extends TxParams {
  userAddresses: string[];
  blacklistNames: string[];
}

// Return Types

/**
 * @param transferResult
 * @param address
 */
interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}

/**
 * @param startTime Date of start for blacklist
 * @param endTime Date of end for blacklist
 * @param repeatPeriodTime Time until it is repeated (Measured in days) (0 if it is not repeated)
 */
interface BlacklistsDetails {
  startTime: Date;
  endTime: Date;
  repeatPeriodTime: number;
}
/**
 * This class includes the functionality related to interacting with the Blacklist Transfer Manager contract.
 */
export default class BlacklistTransferManagerWrapper extends ModuleWrapper {
  protected contract: Promise<BlacklistTransferManagerContract>;

  /**
   * Instantiate BlacklistTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<BlacklistTransferManagerContract>,
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
   * Return the different blacklist details corresponding to a blacklists name
   */
  public blacklists = async (params: BlacklistParams): Promise<BlacklistsDetails> => {
    assert.assert(params.blacklistName.length > 0, 'Blacklist name must not be an empty string');
    const result = await (await this.contract).blacklists.callAsync(stringToBytes32(params.blacklistName));
    return {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      repeatPeriodTime: result[2].toNumber(),
    };
  };

  /**
   * Used to add the blacklist type
   */
  public addBlacklistType = async (params: BlacklistTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddBlacklistType(params);
    return (await this.contract).addBlacklistType.sendTransactionAsync(
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      stringToBytes32(params.blacklistName),
      numberToBigNumber(params.repeatPeriodTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to add multiple blacklist types
   */
  public addNewBlacklistTypeMulti = async (params: BlacklistTypeMultiParams) => {
    assert.areValidArrayLengths(
      [params.startTimes, params.endTimes, params.blacklistNames, params.repeatPeriodTimes],
      'Argument arrays length mismatch',
    );
    assert.assert(params.startTimes.length > 0, 'Empty blacklist information');
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      results.push(
        this.checkAddBlacklistType({
          startTime: params.startTimes[i],
          endTime: params.endTimes[i],
          blacklistName: params.blacklistNames[i],
          repeatPeriodTime: params.repeatPeriodTimes[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).addBlacklistTypeMulti.sendTransactionAsync(
      dateArrayToBigNumberArray(params.startTimes),
      dateArrayToBigNumberArray(params.endTimes),
      stringArrayToBytes32Array(params.blacklistNames),
      numberArrayToBigNumberArray(params.repeatPeriodTimes),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to modify the details of a given blacklist type
   */
  public modifyBlacklistType = async (params: BlacklistTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkModifyBlacklistType(params);
    return (await this.contract).modifyBlacklistType.sendTransactionAsync(
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      stringToBytes32(params.blacklistName),
      numberToBigNumber(params.repeatPeriodTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to modify the details of given multiple blacklist types
   */
  public modifyBlacklistTypeMulti = async (params: BlacklistTypeMultiParams) => {
    assert.areValidArrayLengths(
      [params.startTimes, params.endTimes, params.blacklistNames, params.repeatPeriodTimes],
      'Argument arrays length mismatch',
    );
    assert.assert(params.startTimes.length > 0, 'Empty blacklist information');
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.startTimes.length; i += 1) {
      results.push(
        this.checkModifyBlacklistType({
          startTime: params.startTimes[i],
          endTime: params.endTimes[i],
          blacklistName: params.blacklistNames[i],
          repeatPeriodTime: params.repeatPeriodTimes[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).modifyBlacklistTypeMulti.sendTransactionAsync(
      dateArrayToBigNumberArray(params.startTimes),
      dateArrayToBigNumberArray(params.endTimes),
      stringArrayToBytes32Array(params.blacklistNames),
      numberArrayToBigNumberArray(params.repeatPeriodTimes),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete the blacklist type
   */
  public deleteBlacklistType = async (params: DeleteBlacklistTypeParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkDeleteBlacklistType(params.blacklistName);
    return (await this.contract).deleteBlacklistType.sendTransactionAsync(
      stringToBytes32(params.blacklistName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete the multiple blacklist types
   */
  public deleteBlacklistTypeMulti = async (params: DeleteBlacklistTypeMultiParams) => {
    assert.assert(params.blacklistNames.length > 0, 'Empty blacklist information');
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.blacklistNames.length; i += 1) {
      results.push(this.checkDeleteBlacklistType(params.blacklistNames[i]));
    }
    await Promise.all(results);
    return (await this.contract).deleteBlacklistTypeMulti.sendTransactionAsync(
      stringArrayToBytes32Array(params.blacklistNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to assign the blacklist type to the investor
   */
  public addInvestorToBlacklist = async (params: InvestorAndBlacklistParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddInvestorToBlacklist(params);
    return (await this.contract).addInvestorToBlacklist.sendTransactionAsync(
      params.userAddress,
      stringToBytes32(params.blacklistName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to assign a single blacklist type to multiple investors
   */
  public addInvestorToBlacklistMulti = async (params: InvestorMultiAndBlacklistParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.assert(params.userAddresses.length > 0, 'Empty user address information');
    const results = [];
    for (let i = 0; i < params.userAddresses.length; i += 1) {
      results.push(
        this.checkAddInvestorToBlacklist({
          userAddress: params.userAddresses[i],
          blacklistName: params.blacklistName,
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).addInvestorToBlacklistMulti.sendTransactionAsync(
      params.userAddresses,
      stringToBytes32(params.blacklistName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to assign multiple specific blacklist types to multiple investors
   */
  public addMultiInvestorToBlacklistMulti = async (params: InvestorMultiAndBlacklistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.areValidArrayLengths([params.userAddresses, params.blacklistNames], 'Argument arrays length mismatch');
    assert.assert(params.userAddresses.length > 0, 'Empty user address information');
    const results = [];
    for (let i = 0; i < params.userAddresses.length; i += 1) {
      results.push(
        this.checkAddInvestorToBlacklist({
          userAddress: params.userAddresses[i],
          blacklistName: params.blacklistNames[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).addMultiInvestorToBlacklistMulti.sendTransactionAsync(
      params.userAddresses,
      stringArrayToBytes32Array(params.blacklistNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to create a new blacklist type and add it to the investor
   */
  public addInvestorToNewBlacklist = async (params: AddNewInvestorToNewBlacklistParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkAddBlacklistType(params);
    return (await this.contract).addInvestorToNewBlacklist.sendTransactionAsync(
      dateToBigNumber(params.startTime),
      dateToBigNumber(params.endTime),
      stringToBytes32(params.blacklistName),
      numberToBigNumber(params.repeatPeriodTime),
      params.investor,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete the investor from the blacklist
   */
  public deleteInvestorFromBlacklist = async (params: InvestorAndBlacklistParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkDeleteInvestorFromBlacklist(params);
    return (await this.contract).deleteInvestorFromBlacklist.sendTransactionAsync(
      params.userAddress,
      stringToBytes32(params.blacklistName),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete the multiple investors from multiple specific blacklists
   */
  public deleteMultiInvestorsFromBlacklistMulti = async (params: InvestorMultiAndBlacklistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.areValidArrayLengths([params.userAddresses, params.blacklistNames], 'Argument arrays length mismatch');
    assert.assert(params.userAddresses.length > 0, 'Empty user address information');
    const results = [];
    for (let i = 0; i < params.userAddresses.length; i += 1) {
      results.push(
        this.checkDeleteInvestorFromBlacklist({
          userAddress: params.userAddresses[i],
          blacklistName: params.blacklistNames[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).deleteMultiInvestorsFromBlacklistMulti.sendTransactionAsync(
      params.userAddresses,
      stringArrayToBytes32Array(params.blacklistNames),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete the investor from all the associated blacklist types
   */
  public deleteInvestorFromAllBlacklist = async (params: DeleteInvestorFromAllBlacklistParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    await this.checkDeleteInvestorFromAllBlacklist(params);
    return (await this.contract).deleteInvestorFromAllBlacklist.sendTransactionAsync(
      params.investor,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete multiple investors from multiple associated blacklist types
   */
  public deleteInvestorFromAllBlacklistMulti = async (params: DeleteInvestorFromAllBlacklistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    const results = [];
    for (let i = 0; i < params.investors.length; i += 1) {
      results.push(
        this.checkDeleteInvestorFromAllBlacklist({
          investor: params.investors[i],
        }),
      );
    }
    await Promise.all(results);
    return (await this.contract).deleteInvestorFromAllBlacklistMulti.sendTransactionAsync(
      params.investors,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * get the list of the investors that correspond to a blacklist type
   * @return address List of investors associated with the blacklist
   */
  public getListOfAddresses = async (params: BlacklistParams): Promise<string[]> => {
    assert.assert(params.blacklistName.length > 0, 'Blacklist details must not be an empty string');
    return (await this.contract).getListOfAddresses.callAsync(stringToBytes32(params.blacklistName));
  };

  /**
   * get the list of blacklists associated with a particular investor
   * @return List of blacklist names associated with the given address
   */
  public getBlacklistNamesToUser = async (params: UserAddressParams): Promise<string[]> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    return bytes32ArrayToStringArray(await (await this.contract).getBlacklistNamesToUser.callAsync(params.user));
  };

  /**
   * get the list of blacklist names
   * @return bytes32 Array of blacklist names
   */
  public getAllBlacklists = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllBlacklists.callAsync());
  };

  /**
   * return the amount of tokens for a given user as per the partition
   * @param partition Identifier
   * @param tokenHolder Whom token amount need to query
   * @param additionalBalance It is the `value` that transfers during transfer/transferFrom function call
   * @return amount of tokens
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
   * Return the permissions flags that are associated with blacklist transfer manager
   */
  public getPermissions = async (): Promise<Perm[]> => {
    const permissions = await (await this.contract).getPermissions.callAsync();
    return permissions.map(parsePermBytes32Value);
  };

  /**
   * Used to verify the transfer transaction (View)
   * Restrict the blacklist address to transfer tokens
   * if the current time is between the timeframe define for the
   * blacklist type associated with the from address
   * @return Parse transfer result
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
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: BlacklistTransferManagerSubscribeAsyncParams = async <
    ArgsType extends BlacklistTransferManagerEventArgs
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, BlacklistTransferManagerEvents);
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
  public getLogsAsync: GetBlacklistTransferManagerLogsAsyncParams = async <
    ArgsType extends BlacklistTransferManagerEventArgs
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, BlacklistTransferManagerEvents);
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

  private checkAddBlacklistType = async (params: BlacklistTypeParams) => {
    const blacklistInfo = await this.blacklists({ blacklistName: params.blacklistName });
    assert.assert(dateToBigNumber(blacklistInfo.endTime).isZero(), 'Blacklist you are trying to add already exists');
    await this.checkBlacklistTypeDetails(params);
  };

  private checkModifyBlacklistType = async (params: BlacklistTypeParams) => {
    const blacklistInfo = await this.blacklists({ blacklistName: params.blacklistName });
    assert.isNotDateZero(blacklistInfo.endTime, 'Blacklist you are trying to modify does not exist');
    await this.checkBlacklistTypeDetails(params);
  };

  private checkBlacklistTypeDetails = async (params: BlacklistTypeParams) => {
    assert.assert(params.blacklistName.length > 0, 'Blacklist Name cannot be empty string');
    assert.isFutureDate(params.startTime, 'Start time must be in the future');
    assert.assert(params.startTime < params.endTime, 'Start time must be before the end time');
    if (params.repeatPeriodTime !== 0) {
      const blacklistDays = (params.endTime.getTime() - params.startTime.getTime()) / (1000 * 60 * 60 * 24);
      assert.assert(
        blacklistDays <= params.repeatPeriodTime,
        'The repeat period time in days must be greater than or equal to the difference between start and end time',
      );
    }
  };

  private checkDeleteBlacklistType = async (blacklistName: string) => {
    assert.assert(blacklistName.length > 0, 'Blacklist Name cannot be empty string');
    const blacklistsDetails = await this.blacklists({ blacklistName });
    assert.isNotDateZero(blacklistsDetails.endTime, 'Blacklist does not exist');
    const lookupListOfAddresses = await this.getListOfAddresses({ blacklistName });
    assert.assert(
      lookupListOfAddresses.length === 0,
      'There are users attached to the blacklist that must be removed before removing the blacklist type',
    );
  };

  private checkBlacklistToModifyInvestors = async (params: InvestorAndBlacklistParams) => {
    assert.assert(params.blacklistName.length > 0, 'Blacklist name cannot be empty string');
    const blacklistsDetails = await this.blacklists({ blacklistName: params.blacklistName });
    assert.isNotDateZero(blacklistsDetails.endTime, 'Blacklist does not exist');
  };

  private checkAddInvestorToBlacklist = async (params: InvestorAndBlacklistParams) => {
    await this.checkBlacklistToModifyInvestors(params);
    const currentBlacklistNames = await this.getBlacklistNamesToUser({ user: params.userAddress });
    assert.assert(!currentBlacklistNames.includes(params.blacklistName), 'User already added to this blacklist name');
  };

  private checkDeleteInvestorFromBlacklist = async (params: InvestorAndBlacklistParams) => {
    await this.checkBlacklistToModifyInvestors(params);
    const currentBlacklistNames = await this.getBlacklistNamesToUser({ user: params.userAddress });
    assert.assert(currentBlacklistNames.includes(params.blacklistName), 'User is not added to this blacklist name');
  };

  private checkDeleteInvestorFromAllBlacklist = async (params: DeleteInvestorFromAllBlacklistParams) => {
    assert.isNonZeroETHAddressHex('Investor Address', params.investor);
    const currentBlacklistNames = await this.getBlacklistNamesToUser({ user: params.investor });
    assert.assert(currentBlacklistNames.length > 0, 'Investor is not currently present on any blacklists');
  };
}
