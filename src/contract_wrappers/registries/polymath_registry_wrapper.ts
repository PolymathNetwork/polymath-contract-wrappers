import {
  PolymathRegistryContract_3_0_0,
  PolymathRegistryEventArgs_3_0_0,
  PolymathRegistryEvents_3_0_0,
  PolymathRegistryChangeAddressEventArgs_3_0_0,
  PolymathRegistryOwnershipTransferredEventArgs_3_0_0,
  Web3Wrapper,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  PolymathContract,
  GetLogs,
  Subscribe,
  ErrorCode,
  ContractVersion,
} from '../../types';
import functionsUtils from '../../utils/functions_utils';

interface ChangeAddressSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolymathRegistryEvents_3_0_0.ChangeAddress;
  callback: EventCallback<PolymathRegistryChangeAddressEventArgs_3_0_0>;
}

interface GetChangeAddressLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolymathRegistryEvents_3_0_0.ChangeAddress;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolymathRegistryEvents_3_0_0.OwnershipTransferred;
  callback: EventCallback<PolymathRegistryOwnershipTransferredEventArgs_3_0_0>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolymathRegistryEvents_3_0_0.OwnershipTransferred;
}

interface PolymathRegistrySubscribeAsyncParams extends Subscribe {
  (params: ChangeAddressSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetPolymathRegistryLogsAsyncParams extends GetLogs {
  (params: GetChangeAddressLogsAsyncParams): Promise<LogWithDecodedArgs<PolymathRegistryChangeAddressEventArgs_3_0_0>[]>;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<PolymathRegistryOwnershipTransferredEventArgs_3_0_0>[]
  >;
}

export namespace PolymathRegistryTransactionParams {
  export interface ChangeAddress extends ChangeAddressParams {}
}

/**
 * @param contractName is the key for the contract address mapping
 */
interface GetAddressParams {
  contractName: string;
}

/**
 * @param nameKey is the key for the contract address mapping
 * @param newAddress is the new contract address
 */
interface ChangeAddressParams extends TxParams {
  nameKey: string;
  newAddress: string;
}

/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
export default class PolymathRegistryWrapper extends ContractWrapper {
  public contract: Promise<PolymathRegistryContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate PolymathRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PolymathRegistryContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Get owner of contract
   * @return address
   */
  public owner = async (): Promise<string> => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * Gets the contract address
   * @return address string
   */
  public getAddress = async (params: GetAddressParams): Promise<string> => {
    return this.getAddressInternal(params.contractName);
  };

  /**
   * Gets the PolyToken contract address
   * @return address string
   */
  public getPolyTokenAddress = async (): Promise<string> => {
    return this.getAddressInternal(PolymathContract.PolyToken);
  };

  /**
   * Gets the ModuleRegistry contract address
   * @return address string
   */
  public getModuleRegistryAddress = async (): Promise<string> => {
    return this.getAddressInternal(PolymathContract.ModuleRegistry);
  };

  /**
   * Gets the FeatureRegistry contract address
   * @return address string
   */
  public getFeatureRegistryAddress = async (): Promise<string> => {
    return this.getAddressInternal(PolymathContract.FeatureRegistry);
  };

  /**
   * Gets the SecurityTokenRegistry contract address
   * @return address string
   */
  public getSecurityTokenRegistryAddress = async (): Promise<string> => {
    return this.getAddressInternal(PolymathContract.SecurityTokenRegistry);
  };

  /**
   * Gets the PolyUsdOracle contract address
   * @return address string
   */
  public getPolyUsdOracleAddress = async (): Promise<string> => {
    return this.getAddressInternal(PolymathContract.PolyUsdOracle);
  };

  /**
   * Gets the EthUsdOracle contract address
   * @return address string
   */
  public getEthUsdOracleAddress = async (): Promise<string> => {
    return this.getAddressInternal(PolymathContract.EthUsdOracle);
  };

  /**
   * Changes the contract address
   */
  public changeAddress = async (params: ChangeAddressParams) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(params.txData)),
      ErrorCode.Unauthorized,
      'Form sender must be owner',
    );
    assert.isETHAddressHex('newAddress', params.newAddress);
    return (await this.contract).changeAddress.sendTransactionAsync(
      params.nameKey,
      params.newAddress,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: PolymathRegistrySubscribeAsyncParams = async <ArgsType extends PolymathRegistryEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolymathRegistryEvents_3_0_0);
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
  public getLogsAsync: GetPolymathRegistryLogsAsyncParams = async <ArgsType extends PolymathRegistryEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolymathRegistryEvents_3_0_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };

  public async getAddressInternal(contractName: string) {
    return (await this.contract).getAddress.callAsync(contractName);
  }
}
