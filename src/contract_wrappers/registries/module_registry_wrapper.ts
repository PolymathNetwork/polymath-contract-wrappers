import {
  ModuleRegistryContract,
  ModuleRegistryEventArgs,
  ModuleRegistryEvents,
  ModuleRegistryModuleRegisteredEventArgs,
  ModuleRegistryModuleRemovedEventArgs,
  ModuleRegistryModuleUsedEventArgs,
  ModuleRegistryModuleVerifiedEventArgs,
  ModuleRegistryOwnershipTransferredEventArgs,
  ModuleRegistryPauseEventArgs,
  ModuleRegistryUnpauseEventArgs,
  SecurityTokenRegistryContract,
  FeatureRegistryContract,
  ModuleFactoryContract,
} from '@polymathnetwork/abi-wrappers';
import { ModuleRegistry } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import * as _ from 'lodash';
import { schemas } from '@0x/json-schemas';
import assert from '../../utils/assert';
import ContractWrapper from '../contract_wrapper';
import ContractFactory from '../../factories/contractFactory';
import {
  EventCallback,
  Features,
  GetLogs,
  GetLogsAsyncParams,
  ModuleType,
  Subscribe,
  SubscribeAsyncParams,
  TxParams,
} from '../../types';
import { bytes32ArrayToStringArray } from '../../utils/convert';

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
  (params: ModuleRemovedSubscribeAsyncParams): Promise<string>;
  (params: OwnershipTransferredSubscribeAsyncParams): Promise<string>;
}

interface GetModuleRegistryLogsAsyncParams extends GetLogs {
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryPauseEventArgs>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryUnpauseEventArgs>[]>;
  (params: GetModuleUsedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleUsedEventArgs>[]>;
  (params: GetModuleRegisteredLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleRegisteredEventArgs>[]>;
  (params: GetModuleVerifiedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleVerifiedEventArgs>[]>;
  (params: GetModuleRemovedLogsAsyncParams): Promise<LogWithDecodedArgs<ModuleRegistryModuleRemovedEventArgs>[]>;
  (params: GetOwnershipTransferredLogsAsyncParams): Promise<
    LogWithDecodedArgs<ModuleRegistryOwnershipTransferredEventArgs>[]
  >;
}

interface GetValueByVariableParams {
  variable: string;
}

interface GetValueByKeyParams {
  key: string;
}

interface ModuleFactoryParams extends TxParams {
  moduleFactory: string;
}

interface VerifyModuleParams extends TxParams {
  moduleFactory: string;
  verified: boolean;
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
// // End of return types ////

/**
 * This class includes the functionality related to interacting with the ModuleRegistry contract.
 */
export default class ModuleRegistryWrapper extends ContractWrapper {
  public abi: ContractAbi = ModuleRegistry.abi;

  protected contract: Promise<ModuleRegistryContract>;

  protected contractFactory: ContractFactory;

  protected securityTokenRegistryContract = async (): Promise<SecurityTokenRegistryContract> => {
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

  public registerModule = async (params: ModuleFactoryParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    await this.checkModuleNotPausedOrOwner();
    await this.checkModuleNotRegistered(params.moduleFactory);
    const callerAddress = await this.getCallerAddress(undefined);
    const owner = await this.owner();
    if ((await this.featureRegistryContract()).getFeatureStatus.callAsync(Features.CustomModulesAllowed)) {
      const factoryOwner = await (await this.moduleFactoryContract(params.moduleFactory)).owner.callAsync();
      assert.assert(
        callerAddress === owner || callerAddress === factoryOwner,
        'Calling address must be owner or factory owner with custom modules allowed feature status',
      );
    } else {
      assert.assert(
        callerAddress === owner,
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
    await this.checkModuleNotPausedOrOwner();
    await this.checkModuleRegistered(params.moduleFactory);
    const callerAddress = await this.getCallerAddress(undefined);
    const owner = await this.owner();
    const factoryOwner = await (await this.moduleFactoryContract(params.moduleFactory)).owner.callAsync();
    assert.assert(
      callerAddress === owner || callerAddress === factoryOwner,
      'Calling address must be owner or factory owner ',
    );
    return (await this.contract).removeModule.sendTransactionAsync(
      params.moduleFactory,
      params.txData,
      params.safetyFactor,
    );
  };

  public verifyModule = async (params: VerifyModuleParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    await this.checkMsgSenderIsOwner();
    await this.checkModuleRegistered(params.moduleFactory);
    return (await this.contract).verifyModule.sendTransactionAsync(
      params.moduleFactory,
      params.verified,
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
    _.forEach(
      groupedResult,
      (value, key): void => {
        const tags = _.unzip(value as string[][])[0];
        const tagsByModule: TagsByModule = {
          module: key,
          tags: bytes32ArrayToStringArray(tags),
        };
        typedResult.push(tagsByModule);
      },
    );
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
    _.forEach(
      groupedResult,
      (value, key): void => {
        const tags = _.unzip(value as string[][])[0];
        const tagsByModule: TagsByModule = {
          module: key,
          tags: bytes32ArrayToStringArray(tags),
        };
        typedResult.push(tagsByModule);
      },
    );
    return typedResult;
  };

  public getReputationByFactory = async (params: ModuleFactoryParams) => {
    assert.isETHAddressHex('moduleFactory', params.moduleFactory);
    return (await this.contract).getReputationByFactory.callAsync(params.moduleFactory);
  };

  public getModulesByType = async (params: ModuleTypeParams) => {
    return (await this.contract).getModulesByType.callAsync(params.moduleType);
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
    assert.isAddressNotZero(params.tokenContract);
    assert.isETHAddressHex('tokenContract', params.tokenContract);
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
    assert.assert(!(await this.isPaused()), 'Contract is already not paused');
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public updateFromRegistry = async (params: TxParams) => {
    await this.checkMsgSenderIsOwner();
    return (await this.contract).updateFromRegistry.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  public transferOwnership = async (params: TransferOwnershipParams) => {
    assert.isAddressNotZero(params.newOwner);
    assert.isETHAddressHex('newOwner', params.newOwner);
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
      ModuleType.PermissionManager,
      ModuleType.STO,
      ModuleType.Burn,
      ModuleType.Dividends,
      ModuleType.TransferManager,
    ];
    return Promise.all(
      allModulesTypes.map(async type => {
        return this.callGetModulesByTypeAndReturnIfModuleExists(type, moduleAddress);
      }),
    ).then(values => {
      return values.includes(true);
    });
  };

  private callGetModulesByTypeAndReturnIfModuleExists = async (moduleType: ModuleType, moduleAddress: string) => {
    return (await this.getModulesByType({ moduleType })).includes(moduleAddress);
  };

  private checkMsgSenderIsOwner = async () => {
    assert.assert(
      (await this.owner()) === (await this.web3Wrapper.getAvailableAddressesAsync())[0],
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
      !(await this.isPaused()) || (await this.owner()) === (await this.web3Wrapper.getAvailableAddressesAsync())[0],
      'Contract should not be Paused',
    );
  };
}
