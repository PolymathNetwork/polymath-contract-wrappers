import {
  BigNumber,
  ContractAbi,
  LogWithDecodedArgs,
  ModuleFactory,
  ModuleFactoryChangeSTVersionBoundEventArgs,
  ModuleFactoryContract,
  ModuleFactoryEventArgs,
  ModuleFactoryEvents,
  ModuleFactoryGenerateModuleFromFactoryEventArgs,
  ModuleFactoryOwnershipTransferredEventArgs,
  TxData,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import {
  BoundType,
  EventCallback,
  FULL_DECIMALS,
  GetLogs,
  GetLogsAsyncParams,
  ModuleType,
  Subscribe,
  SubscribeAsyncParams,
  TxParams,
} from '../../types';
import {
  bytes32ArrayToStringArray,
  bytes32ToString,
  parseModuleTypeValue,
  stringArrayToBytes32Array,
  stringToBytes32,
  weiToValue,
} from '../../utils/convert';
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

interface ChangeTitleParams extends TxParams {
  title: string;
}

interface ChangeDescriptionParams extends TxParams {
  description: string;
}

interface ChangeNameParams extends TxParams {
  name: string;
}

interface ChangeTagsParams extends TxParams {
  tags: string[];
}

interface ChangeSTVersionBoundsParams extends TxParams {
  boundType: BoundType;
  newVersion: number[];
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
   * Change the title
   */
  public changeTitle = async (params: ChangeTitleParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.title.length > 0, 'Invalid title');
    return (await this.contract).changeTitle.sendTransactionAsync(params.title, params.txData, params.safetyFactor);
  };

  /**
   * Change the description
   */
  public changeDescription = async (params: ChangeDescriptionParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.description.length > 0, 'Invalid description');
    return (await this.contract).changeDescription.sendTransactionAsync(
      params.description,
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the name
   */
  public changeName = async (params: ChangeNameParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.name.length > 0, 'Invalid name');
    return (await this.contract).changeName.sendTransactionAsync(
      stringToBytes32(params.name),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the tags
   */
  public changeTags = async (params: ChangeTagsParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(params.tags.length > 0, 'Invalid, must provide one or more tags');
    return (await this.contract).changeTags.sendTransactionAsync(
      stringArrayToBytes32Array(params.tags),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Change the ST VersionBounds
   */
  public changeSTVersionBounds = async (params: ChangeSTVersionBoundsParams) => {
    await this.checkOnlyOwner(params.txData);
    assert.assert(
      params.boundType === BoundType.LowerBound || params.boundType === BoundType.UpperBound,
      'Invalid bound type',
    );
    assert.assert(params.newVersion.length === 3, 'Invalid version, number array must have 3 elements');
    const currentBound = BoundType.LowerBound === params.boundType ? await this.getLowerSTVersionBounds() : await this.getUpperSTVersionBounds();
    for (let i = 0; i < 3; i += 1) {
      if (params.boundType === BoundType.LowerBound) {
        assert.assert(currentBound[i].isGreaterThanOrEqualTo(params.newVersion[i]), 'New Lower ST Bounds must be less than or equal to current');
      } else {
        assert.assert(currentBound[i].isLessThanOrEqualTo(params.newVersion[i]), 'New Upper ST Bounds must be greater than or equal to current');
      }
    }
    return (await this.contract).changeSTVersionBounds.sendTransactionAsync(
      params.boundType,
      params.newVersion,
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
