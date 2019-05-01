import {
  PolymathRegistryContract,
  PolymathRegistryEventArgs,
  PolymathRegistryEvents,
  PolymathRegistryChangeAddressEventArgs,
  PolymathRegistryOwnershipRenouncedEventArgs,
  PolymathRegistryOwnershipTransferredEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { PolymathRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import {
  TxParams,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  PolymathContracts,
  GetLogs,
  Subscribe,
} from '../../types';

interface ChangeAddressSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolymathRegistryEvents.ChangeAddress;
  callback: EventCallback<PolymathRegistryChangeAddressEventArgs>;
}

interface GetChangeAddressLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolymathRegistryEvents.ChangeAddress;
}

interface OwnershipRenouncedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolymathRegistryEvents.OwnershipRenounced;
  callback: EventCallback<PolymathRegistryOwnershipRenouncedEventArgs>;
}

interface GetOwnershipRenouncedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolymathRegistryEvents.OwnershipRenounced;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: PolymathRegistryEvents.OwnershipTransferred;
  callback: EventCallback<PolymathRegistryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: PolymathRegistryEvents.OwnershipTransferred;
}

interface PolymathRegistrySubscribeAsyncParams extends Subscribe {
  (params: ChangeAddressSubscribeAsyncParams): Promise<string>;
  (params: OwnershipRenouncedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetPolymathRegistryLogsAsyncParams extends GetLogs {
  (params: GetChangeAddressLogsAsyncParams): Promise<LogWithDecodedArgs<PolymathRegistryChangeAddressEventArgs>[]>;
  (params: GetOwnershipRenouncedLogsAsyncParams): Promise<
    LogWithDecodedArgs<PolymathRegistryOwnershipRenouncedEventArgs>[]
  >;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<PolymathRegistryOwnershipTransferredEventArgs>[]
  >;
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
  public abi: ContractAbi = PolymathRegistry.abi;

  protected contract: Promise<PolymathRegistryContract>;

  /**
   * Instantiate PolymathRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PolymathRegistryContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Gets the contract address
   * @return address string
   */
  public getAddress = async (params: GetAddressParams) => {
    return this.getAddressInternal(params.contractName);
  };

  /**
   * Gets the PolyToken contract address
   * @return address string
   */
  public getPolyTokenAddress = async () => {
    return this.getAddressInternal(PolymathContracts.PolyToken);
  };

  /**
   * Gets the ModuleRegistry contract address
   * @return address string
   */
  public getModuleRegistryAddress = async () => {
    return this.getAddressInternal(PolymathContracts.ModuleRegistry);
  };

  /**
   * Gets the FeatureRegistry contract address
   * @return address string
   */
  public getFeatureRegistryAddress = async () => {
    return this.getAddressInternal(PolymathContracts.FeatureRegistry);
  };

  /**
   * Gets the SecurityTokenRegistry contract address
   * @return address string
   */
  public getSecurityTokenRegistryAddress = async () => {
    return this.getAddressInternal(PolymathContracts.SecurityTokenRegistry);
  };

  /**
   * Gets the PolyUsdOracle contract address
   * @return address string
   */
  public getPolyUsdOracleAddress = async () => {
    return this.getAddressInternal(PolymathContracts.PolyUsdOracle);
  };

  /**
   * Gets the EthUsdOracle contract address
   * @return address string
   */
  public getEthUsdOracleAddress = async () => {
    return this.getAddressInternal(PolymathContracts.EthUsdOracle);
  };

  /**
   * Changes the contract address
   */
  public changeAddress = async (params: ChangeAddressParams) => {
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
  public subscribeAsync: PolymathRegistrySubscribeAsyncParams = async <ArgsType extends PolymathRegistryEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolymathRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      PolymathRegistry.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetPolymathRegistryLogsAsyncParams = async <ArgsType extends PolymathRegistryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolymathRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      PolymathRegistry.abi,
    );
    return logs;
  };

  private async getAddressInternal(contractName: string) {
    return (await this.contract).getAddress.callAsync(contractName);
  }
}
