import {
  BigNumber,
  ContractAbi,
  BlacklistTransferManager,
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
  valueArrayToWeiArray,
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

interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

interface GetTokensByPartitionParams {
  partition: Partition;
  tokenHolder: string;
  additionalBalance: BigNumber;
}

interface BlacklistParams extends TxParams {
  blacklistName: string;
}

interface UserAddressParams {
  user: string;
}

interface BlacklistTypeParams extends TxParams {
  startTime: Date;
  endTime: Date;
  blacklistName: string;
  repeatPeriodTime: number;
}

interface AddNewInvestorToNewBlacklistParams extends BlacklistTypeParams {
  investor: string;
}

interface BlacklistTypeMultiParams extends TxParams {
  startTimes: Date[];
  endTimes: Date[];
  blacklistNames: string[];
  repeatPeriodTimes: number[];
}

interface DeleteBlacklistTypeParams extends TxParams {
  blacklistName: string;
}

interface DeleteBlacklistTypeMultiParams extends TxParams {
  blacklistNames: string[];
}

interface InvestorAndBlacklistParams extends TxParams {
  userAddress: string;
  blacklistName: string;
}

interface DeleteInvestorFromAllBlacklistParams extends TxParams {
  investor: string;
}

interface DeleteInvestorFromAllBlacklistMultiParams extends TxParams {
  investors: string[];
}

interface InvestorMultiAndBlacklistParams extends TxParams {
  userAddresses: string[];
  blacklistName: string;
}

interface InvestorMultiAndBlacklistMultiParams extends TxParams {
  userAddresses: string[];
  blacklistNames: string[];
}

// Return Types

interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}

interface BlacklistsDetails {
  startTime: Date;
  endTime: Date;
  repeatPeriodTime: number;
}
/**
 * This class includes the functionality related to interacting with the Blacklist Transfer Manager contract.
 */
export default class BlacklistTransferManagerWrapper extends ModuleWrapper {
  public abi: ContractAbi = BlacklistTransferManager.abi;

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
   * Return the blacklists
   */
  public blacklists = async (params: BlacklistParams): Promise<BlacklistsDetails> => {
    assert.assert(params.blacklistName.length > 0, 'Blacklist Details must not be an empty string');
    const result = await (await this.contract).blacklists.callAsync(stringToBytes32(params.blacklistName));
    return {
      startTime: bigNumberToDate(result[0]),
      endTime: bigNumberToDate(result[1]),
      repeatPeriodTime: result[2].toNumber(),
    };
  };

  /*
   * addBlacklistType
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

  /*
   * addNewBlacklistTypeMulti
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

  /*
   * modifyBlacklistType
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

  /*
   * modifyBlacklistTypeMulti
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


  /*
   * deleteBlacklistType
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

  /*
   * deleteBlacklistTypeMulti
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

  /*
   * addInvestorToBlacklist
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

  /*
   * addInvestorToBlacklistMulti
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

  /*
   * addMultiInvestorToBlacklistMulti
   */
  public addMultiInvestorToBlacklistMulti = async (params: InvestorMultiAndBlacklistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.areValidArrayLengths(
        [
          params.userAddresses,
          params.blacklistNames
        ],
        'Argument arrays length mismatch',
    );
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

  /*
   * addInvestorToNewBlacklist
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

  /*
   * deleteInvestorFromBlacklist
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

  /*
   * deleteMultiInvestorsFromBlacklistMulti
   */
  public deleteMultiInvestorsFromBlacklistMulti = async (params: InvestorMultiAndBlacklistMultiParams) => {
    assert.assert(await this.isCallerAllowed(params.txData, Perm.Admin), 'Caller is not allowed');
    assert.areValidArrayLengths(
        [
          params.userAddresses,
          params.blacklistNames
        ],
        'Argument arrays length mismatch',
    );
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

  /*
   * deleteInvestorFromAllBlacklist
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

  /*
   * deleteInvestorFromAllBlacklistMulti
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
   * getListOfAddresses
   */
  public getListOfAddresses = async (params: BlacklistParams): Promise<string[]> => {
    assert.assert(params.blacklistName.length > 0, 'Blacklist details must not be an empty string');
    return (await this.contract).getListOfAddresses.callAsync(stringToBytes32(params.blacklistName));
  };

  /**
   * getBlacklistNamesToUser
   */
  public getBlacklistNamesToUser = async (params: UserAddressParams): Promise<string[]> => {
    assert.isNonZeroETHAddressHex('User Address', params.user);
    return bytes32ArrayToStringArray(await (await this.contract).getBlacklistNamesToUser.callAsync(params.user));
  };

  /**
   * getAllBlacklists
   */
  public getAllBlacklists = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getAllBlacklists.callAsync());
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
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      BlacklistTransferManager.abi,
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
      BlacklistTransferManager.abi,
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
    assert.assert(currentBlacklistNames.length > 0, 'Investor is not currently present on any blacklists')
  };
}
