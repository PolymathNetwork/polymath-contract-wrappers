import {
  ModuleRegistryContract,
  ModuleRegistryEventArgs,
  ModuleRegistryEvents,
  ModuleRegistryModuleRegisteredEventArgs,
  ModuleRegistryModuleRemovedEventArgs,
  ModuleRegistryModuleUsedEventArgs,
  ModuleRegistryModuleVerifiedEventArgs,
  ModuleRegistryModuleUnverifiedEventArgs,
  ModuleRegistryOwnershipTransferredEventArgs,
  ModuleRegistryPauseEventArgs,
  ModuleRegistryUnpauseEventArgs,
  ISecurityTokenRegistryContract,
  FeatureRegistryContract,
  ModuleFactoryContract,
  ModuleRegistry,
  Web3Wrapper,
  ContractAbi,
  LogWithDecodedArgs,
} from '@polymathnetwork/abi-wrappers';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import ContractFactory from '../../factories/contractFactory';
import {
  EventCallback,
  Feature,
  GetLogs,
  GetLogsAsyncParams,
  ModuleType,
  Subscribe,
  SubscribeAsyncParams,
  TxParams,
} from '../../types';
import { bytes32ArrayToStringArray } from '../../utils/convert';
import functionsUtils from '../../utils/functions_utils';

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.Pause;
  callback: EventCallback<ModuleRegistryPauseEventArgs>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.Unpause;
  callback: EventCallback<ModuleRegistryUnpauseEventArgs>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.Unpause;
}

interface ModuleUsedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUsed;
  callback: EventCallback<ModuleRegistryModuleUsedEventArgs>;
}

interface GetModuleUsedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUsed;
}

interface ModuleRegisteredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRegistered;
  callback: EventCallback<ModuleRegistryModuleRegisteredEventArgs>;
}

interface GetModuleRegisteredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRegistered;
}

interface ModuleVerifiedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleVerified;
  callback: EventCallback<ModuleRegistryModuleVerifiedEventArgs>;
}

interface GetModuleVerifiedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleVerified;
}

interface ModuleUnverifiedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUnverified;
  callback: EventCallback<ModuleRegistryModuleVerifiedEventArgs>;
}

interface GetModuleUnverifiedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleUnverified;
}

interface ModuleRemovedSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRemoved;
  callback: EventCallback<ModuleRegistryModuleRemovedEventArgs>;
}

interface GetModuleRemovedLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.ModuleRemoved;
}

interface OwnershipTransferredSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: ModuleRegistryEvents.OwnershipTransferred;
  callback: EventCallback<ModuleRegistryOwnershipTransferredEventArgs>;
}

interface GetOwnershipTransferredLogsAsyncParams extends GetLogsAsyncParams {
  eventName: ModuleRegistryEvents.OwnershipTransferred;
}

interface ModuleRegistrySubscribeAsyncParams extends Subscribe {
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
  (params: ModuleUsedSubscribeAsyncParams): Promise<string>;
  (params: ModuleRegisteredSubscribeAsyncParams): Promise<string>;
  (params: ModuleVerifiedSubscribeAsyncParams): Promise<string>;
  (params: ModuleUnverifiedSubscribeAsyncParams): Promise<string>;
  (params: ModuleRemovedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetModuleRegistryLogsAsyncParams extends GetLogs {
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryUnpauseEventArgs>[]>;
  (params: GetModuleUsedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleUsedEventArgs>[]>;
  (params: GetModuleRegisteredLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleRegisteredEventArgs>[]>;
  (params: GetModuleVerifiedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleVerifiedEventArgs>[]>;
  (params: GetModuleUnverifiedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleUnverifiedEventArgs>[]>;
  (params: GetModuleRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleRemovedEventArgs>[]>;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleRegistryOwnershipTransferredEventArgs>[]
  >;
}

interface ModuleFactoryParams extends TxParams {
  moduleFactory: string;
}

/**
 * @param moduleType is the module type to look for
 * @param securityToken is the address of SecurityToken
 */
interface TypeAndTokenParams {
  moduleType: ModuleType;
  securityToken: string;
}

interface ModuleTypeParams {
  moduleType: ModuleType;
}

interface IsCompatibleModuleParams {
  moduleFactoryAddress: string;
  securityTokenAddress: string;
}

interface GetFactoryDetailsParams {
  factoryAddress: string;
}

interface ReclaimERC20Params extends TxParams {
  tokenContract: string;
}

interface TransferOwnershipParams extends TxParams {
  newOwner: string;
}

// // Return types ////
interface TagsByModule {
  module: string;
  tags: string[];
}

interface FactoryDetails {
  isVerified: boolean;
  ownerAddress: string;
  securityTokenAddresses: string[];
}
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export default class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;

  protected contract: Promise<ModuleRegistryContract>;

  protected contractFactory: ContractFactory;

  protected securityTokenRegistryContract = async (): Promise<ISecurityTokenRegistryContract> => {
    return this.contractFactory.getSecurityTokenRegistryContract();
  };

  protected featureRegistryContract = async (): Promise<FeatureRegistryContract> => {
    return this.contractFactory.getFeatureRegistryContract();
  };

  protected moduleFactoryContract = async (address: string): Promise<ModuleFactoryContract> => {
    return this.contractFactory.getModuleFactoryContract(address);
  };

  /**
   * Instantiate ModuleRegistryWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<ModuleRegistryContract>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract);
    this.contract = contract;
    this.contractFactory = contractFactory;
  }

  public isCompatibleModule = async (params: IsCompatibleModuleParams): Promise<boolean> => {
    return (await this.contract).isCompatibleModule.callAsync(params.moduleFactoryAddress, params.securityTokenAddress);
  };

  public registerModule = async (params: ModuleFactoryParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    await this.checkModuleNotPausedOrOwner();
    await this.checkModuleNotRegistered(params.moduleFactory);
    const callerAddress = await this.getCallerAddress(params.txData);
    const owner = await this.owner();
    if ((await this.featureRegistryContract()).getFeatureStatus.callAsync(Feature.CustomModulesAllowed)) {
      const factoryOwner = await (await this.moduleFactoryContract(params.moduleFactory)).owner.callAsync();
      assert.assert(
        functionsUtils.checksumAddressComparision(callerAddress, owner) ||
          functionsUtils.checksumAddressComparision(callerAddress, factoryOwner),
        'Calling address must be owner or factory owner with custom modules allowed feature status',
      );
    } else {
      assert.assert(
        functionsUtils.checksumAddressComparision(callerAddress, owner),
        'Calling address must be owner without custom modules allowed feature status',
      );
    }
    const getTypesResult = await (await this.moduleFactoryContract(params.moduleFactory)).getTypes.callAsync();
    // Check for duplicates
    if (getTypesResult.length > 1) {
      assert.assert(getTypesResult.length === new Set(getTypesResult).size, 'Type mismatch');
    }
    assert.assert(getTypesResult.length > 0, 'Factory must have type');
    return (await this.contract).registerModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  };

  public removeModule = async (params: ModuleFactoryParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    await this.checkModuleNotPaused();
    await this.checkModuleRegistered(params.moduleFactory);
    await this.checkIsOwnerOrModuleFactoryOwner(params.moduleFactory);
    return (await this.contract).removeModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  };

  public verifyModule = async (params: ModuleFactoryParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    await this.checkMsgSenderIsOwner();
    await this.checkModuleRegistered(params.moduleFactory);
    return (await this.contract).verifyModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  };

  public unverifyModule = async (params: ModuleFactoryParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    await this.checkIsOwnerOrModuleFactoryOwner(params.moduleFactory);
    await this.checkModuleRegistered(params.moduleFactory);
    return (await this.contract).unverifyModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  };

  public getTagsByTypeAndToken = async (params: TypeAndTokenParams) => {
    assert.isETHAddressHex('securityToken', params.securityToken);
    const result = await (await this.contract).getTagsByTypeAndToken.callAsync(params.moduleType, params.securityToken);
    // [tag1, tag2, tag3, tag2, tag3], [module1, module1, module1, module2, module2]
    const zippedResult = _.zip(result[0], result[1]); // [[tag1, module1], [tag2, module1], [tag3, module1] ...]
    const groupedResult = _.groupBy(zippedResult, value => {
      return value[1];
    }); // [module1: [[tag1, module1], [tag2, module1]], ...]
    const typedResult: TagsByModule[] = [];
    _.forEach(groupedResult, (value, key): void => {
      const tags = _.unzip(value as string[][])[0];
      const tagsByModule: TagsByModule = {
        module: key,
        tags: bytes32ArrayToStringArray(tags),
      };
      typedResult.push(tagsByModule);
    });
    return typedResult;
  };

  public getTagsByType = async (params: ModuleTypeParams) => {
    const result = await (await this.contract).getTagsByType.callAsync(params.moduleType);
    // [tag1, tag2, tag3, tag2, tag3], [module1, module1, module1, module2, module2]
    const zippedResult = _.zip(result[0], result[1]); // [[tag1, module1], [tag2, module1], [tag3, module1] ...]
    const groupedResult = _.groupBy(zippedResult, value => {
      return value[1];
    }); // [module1: [[tag1, module1], [tag2, module1]], ...]
    const typedResult: TagsByModule[] = [];
    _.forEach(groupedResult, (value, key): void => {
      const tags = _.unzip(value as string[][])[0];
      const tagsByModule: TagsByModule = {
        module: key,
        tags: bytes32ArrayToStringArray(tags),
      };
      typedResult.push(tagsByModule);
    });
    return typedResult;
  };

  /**
   * @returns Returns factoryIsVerified, factoryOwnerAddress, listSecurityTokens
   */
  public getFactoryDetails = async (params: GetFactoryDetailsParams) => {
    const result = await (await this.contract).getFactoryDetails.callAsync(params.factoryAddress);
    const typedResult: FactoryDetails = {
      isVerified: result[0],
      ownerAddress: result[1],
      securityTokenAddresses: result[2],
    };
    return typedResult;
  };

  public getModulesByType = async (params: ModuleTypeParams) => {
    return (await this.contract).getModulesByType.callAsync(params.moduleType);
  };

  public getAllModulesByType = async (params: ModuleTypeParams): Promise<string[]> => {
    return (await this.contract).getAllModulesByType.callAsync(params.moduleType);
  };

  /**
   * Returns the list of available Module factory addresses of a particular type for a given token.
   * @return address array that contains the list of available addresses of module factory contracts.
   */
  public getModulesByTypeAndToken = async (params: TypeAndTokenParams) => {
    assert.isETHAddressHex('securityToken', params.securityToken);
    return (await this.contract).getModulesByTypeAndToken.callAsync(params.moduleType, params.securityToken);
  };

  public reclaimERC20 = async (params: ReclaimERC20Params) => {
    assert.isNonZeroETHAddressHex('tokenContract', params.tokenContract);
    await this.checkMsgSenderIsOwner();
    return (await this.contract).reclaimERC20.sendTransactionAsync(
      params.tokenContract,
      params.txData,
      params.safetyFactor,
    );
  };

  public pause = async (params: TxParams) => {
    await this.checkMsgSenderIsOwner();
    assert.assert(!(await this.isPaused()), 'Contract is paused');
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public unpause = async (params: TxParams) => {
    await this.checkMsgSenderIsOwner();
    assert.assert(await this.isPaused(), 'Contract is already not paused');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public updateFromRegistry = async (params: TxParams) => {
    await this.checkMsgSenderIsOwner();
    return (await this.contract).updateFromRegistry.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public transferOwnership = async (params: TransferOwnershipParams) => {
    assert.isNonZeroETHAddressHex('newOwner', params.newOwner);
    await this.checkMsgSenderIsOwner();
    return (await this.contract).transferOwnership.sendTransactionAsync(
      params.newOwner,
      params.txData,
      params.safetyFactor,
    );
  };

  public owner = async () => {
    return (await this.contract).owner.callAsync();
  };

  public isPaused = async () => {
    return (await this.contract).isPaused.callAsync();
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: ModuleRegistrySubscribeAsyncParams = async <ArgsType extends ModuleRegistryEventArgs>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleRegistryEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.indexFilterValues,
      ModuleRegistry.abi,
      params.callback,
      !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  };

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: GetModuleRegistryLogsAsyncParams = async <ArgsType extends ModuleRegistryEventArgs>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, ModuleRegistryEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
      ModuleRegistry.abi,
    );
    return logs;
  };

  private checkForRegisteredModule = async (moduleAddress: string) => {
    const allModulesTypes = [
      await this.getModulesByType({ moduleType: ModuleType.PermissionManager }),
      await this.getModulesByType({ moduleType: ModuleType.STO }),
      await this.getModulesByType({ moduleType: ModuleType.Burn }),
      await this.getModulesByType({ moduleType: ModuleType.Dividends }),
      await this.getModulesByType({ moduleType: ModuleType.TransferManager }),
    ];
    const allModules = await Promise.all(
      allModulesTypes.map(myPromise => {
        return myPromise.includes(moduleAddress);
      }),
    );
    return allModules.includes(true);
  };

  private callGetModulesByTypeAndReturnIfModuleExists = async (moduleType: ModuleType, moduleAddress: string) => {
    return (await this.getModulesByType({ moduleType })).includes(moduleAddress);
  };

  private checkMsgSenderIsOwner = async () => {
    assert.assert(
      functionsUtils.checksumAddressComparision(
        await this.owner(),
        (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      ),
      'Msg sender must be owner',
    );
  };

  private checkModuleRegistered = async (moduleFactory: string) => {
    assert.assert(await this.checkForRegisteredModule(moduleFactory), 'Module is not registered');
  };

  private checkModuleNotRegistered = async (moduleFactory: string) => {
    assert.assert(!(await this.checkForRegisteredModule(moduleFactory)), 'Module is already registered');
  };

  private checkModuleNotPausedOrOwner = async () => {
    assert.assert(
        !(await this.isPaused()) ||
        functionsUtils.checksumAddressComparision(await this.owner(), await this.getCallerAddress(undefined)),
        'Contract is either paused or the calling address is not the owner',
    );
  };

  private checkModuleNotPaused = async () => {
    assert.assert(
        !(await this.isPaused()),
        'Contract is currently paused',
    );
  };

  private checkIsOwnerOrModuleFactoryOwner = async(moduleFactoryAddress: string) => {
    const callerAddress = await this.getCallerAddress(undefined);
    const owner = await this.owner();
    const factoryOwner = await (await this.moduleFactoryContract(moduleFactoryAddress)).owner.callAsync();
    assert.assert(
        functionsUtils.checksumAddressComparision(callerAddress, owner) ||
        functionsUtils.checksumAddressComparision(callerAddress, factoryOwner),
        'Calling address must be owner or factory owner ',
    );
  }
}
