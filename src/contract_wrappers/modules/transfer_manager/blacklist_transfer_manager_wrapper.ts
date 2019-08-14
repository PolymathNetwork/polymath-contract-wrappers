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
  parsePermBytes32Value,
  parseTransferResult,
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

// Return Types

interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
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
   * getListOfAddresses
   */
  public getListOfAddresses = async (params: BlacklistParams): Promise<string[]> => {
    assert.assert(params.blacklistName.length > 0, 'LockUp Details must not be an empty string');
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
}
