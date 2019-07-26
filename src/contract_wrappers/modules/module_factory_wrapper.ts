import {
  ModuleFactoryContract,
  ModuleFactoryEventArgs,
  ModuleFactoryEvents,
  ModuleFactoryOwnershipTransferredEventArgs,
  ModuleFactoryGenerateModuleFromFactoryEventArgs,
  ModuleFactoryChangeSTVersionBoundEventArgs,
  BigNumber,
  ModuleFactory,
  Web3Wrapper,
  ContractAbi,
  LogWithDecodedArgs,
  TxData,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import {
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  EventCallback,
  Subscribe,
  GetLogs,
  FULL_DECIMALS,
  ModuleType,
  TxParams,
} from '../../types';
import { weiToValue, bytes32ToString, bytes32ArrayToStringArray, parseModuleTypeValue } from '../../utils/convert';
import functionsUtils from '../../utils/functions_utils';

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred;
  callback: EventCallback<ModuleFactoryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.OwnershipTransferred;
}

interface GenerateModuleFromFactorySubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.GenerateModuleFromFactory;
  callback: EventCallback<ModuleFactoryGenerateModuleFromFactoryEventArgs>;
}

interface GetGenerateModuleFromFactoryLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.GenerateModuleFromFactory;
}

interface ChangeSTVersionBoundSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleFactoryEvents.ChangeSTVersionBound;
  callback: EventCallback<ModuleFactoryChangeSTVersionBoundEventArgs>;
}

interface GetChangeSTVersionBoundLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleFactoryEvents.ChangeSTVersionBound;
}

interface ModuleFactorySubscribeAsyncParams extends Subscribe {
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
  (params: GenerateModuleFromFactorySubscribeAsyncParams): Promise<string>;
  (params: ChangeSTVersionBoundSubscribeAsyncParams): Promise<string>;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryOwnershipTransferredEventArgs>[]
  >;
  (params: GetGenerateModuleFromFactoryLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryGenerateModuleFromFactoryEventArgs>[]
  >;
  (params: GetChangeSTVersionBoundLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleFactoryChangeSTVersionBoundEventArgs>[]
  >;
}

interface ChangeSetupCostParams extends TxParams {
  setupCost: BigNumber;
}

interface ChangeCostAndTypeParams extends ChangeSetupCostParams {
  isCostInPoly: boolean;
}

/**
 * This class includes the functionality related to interacting with the ModuleFactory contract.
 */
export default class ModuleFactoryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleFactory.abi;

  protected contract: Promise<ModuleFactoryContract>;

  /**
   * Instantiate ModuleFactoryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleFactoryContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Get the owner of the Module Factory
   */
  public owner = async () => {
    return (await this.contract).owner.callAsync();
  };

  /**
   * Get the name of the Module
   */
  public name = async (): Promise<string> => {
    const name = await (await this.contract).name.callAsync();
    return bytes32ToString(name);
  };

  /**
   * Get the title of the Module
   */
  public title = async (): Promise<string> => {
    return (await this.contract).title.callAsync();
  };

  /**
   * Get isCostInPoly
   */
  public isCostInPoly = async (): Promise<boolean> => {
    return (await this.contract).isCostInPoly.callAsync();
  };

  /**
   * Get the description of the Module
   */
  public description = async (): Promise<string> => {
    return (await this.contract).description.callAsync();
  };

  /**
   * Get the version of the Module
   */
  public version = async (): Promise<string> => {
    return (await this.contract).version.callAsync();
  };

  /**
   * Get the types
   */
  public getTypes = async (): Promise<ModuleType[]> => {
    return (await (await this.contract).getTypes.callAsync()).map(type => {
      return parseModuleTypeValue(type);
    });
  };

  /**
   * Get the tags
   */
  public getTags = async (): Promise<string[]> => {
    return bytes32ArrayToStringArray(await (await this.contract).getTags.callAsync());
  };

  /**
   * Change the setupCost
   */
  public changeSetupCost = async (params: ChangeSetupCostParams) => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeSetupCost.sendTransactionAsync(
      params.setupCost,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the cost and type
   */
  public changeCostAndType = async (params: ChangeCostAndTypeParams) => {
    await this.checkOnlyOwner(params.txData);
    return (await this.contract).changeCostAndType.sendTransactionAsync(
      params.setupCost,
      params.isCostInPoly,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Get setup cost
   */
  public setupCost = async (): Promise<BigNumber> => {
    const value = await (await this.contract).setupCost.callAsync();
    return weiToValue(value, FULL_DECIMALS);
  };

  /**
   * Get upper ST version bounds
   */
  public getUpperSTVersionBounds = async (): Promise<BigNumber[]> => {
    return (await (await this.contract).getUpperSTVersionBounds.callAsync()).map(v => new BigNumber(v));
  };

  /**
   * Get lower ST version bounds
   */
  public getLowerSTVersionBounds = async (): Promise<BigNumber[]> => {
    return (await (await this.contract).getLowerSTVersionBounds.callAsync()).map(v => new BigNumber(v));
  };

  /**
   * Get setup cost in poly
   */
  public setupCostInPoly = async (): Promise<BigNumber> => {
    const value = await (await this.contract).setupCostInPoly.callAsync();
    return weiToValue(value, FULL_DECIMALS);
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: Subscribe = async <ArgsType extends ModuleFactoryEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ModuleFactory.abi,
      params.callback,
      params.isVerbose,
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetLogs = async <ArgsType extends ModuleFactoryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleFactoryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ModuleFactory.abi,
    );
    return logs;
  };

  private checkOnlyOwner = async (txData: Partial<TxData> | undefined) => {
    assert.assert(
      functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(txData)),
      'Msg sender must be owner',
    );
  };
}
