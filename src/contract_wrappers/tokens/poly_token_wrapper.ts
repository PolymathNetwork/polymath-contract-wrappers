import {
  PolyTokenContract,
  PolyTokenEventArgs,
  PolyTokenEvents,
  PolyTokenTransferEventArgs,
  PolyTokenApprovalEventArgs,
} from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from '../registries/polymath_registry_wrapper';
import { PolyToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, LogWithDecodedArgs } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import {
  TxParams,
  IGetLogsAsyncParams,
  ISubscribeAsyncParams,
  EventCallback,
  ISubscribe,
  IGetLogs
} from '../../types';
import { assert } from '../../utils/assert';
import { schemas } from '@0x/json-schemas';
import { ERC20TokenWrapper } from './erc20_wrapper';

interface IApprovalSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PolyTokenEvents.Approval,
  callback: EventCallback<PolyTokenApprovalEventArgs>,
}

interface IGetApprovalLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PolyTokenEvents.Approval,
}

interface ITransferSubscribeAsyncParams extends ISubscribeAsyncParams {
  eventName: PolyTokenEvents.Transfer,
  callback: EventCallback<PolyTokenTransferEventArgs>,
}

interface IGetTransferLogsAsyncParams extends IGetLogsAsyncParams {
  eventName: PolyTokenEvents.Transfer,
}

interface IPolyTokenSubscribeAsyncParams extends ISubscribe {
  (params: IApprovalSubscribeAsyncParams): Promise<string>,
  (params: ITransferSubscribeAsyncParams): Promise<string>,
}

interface IGetPolyTokenLogsAsyncParams extends IGetLogs {
  (params: IGetApprovalLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PolyTokenApprovalEventArgs>>>,
  (params: IGetTransferLogsAsyncParams): Promise<Array<LogWithDecodedArgs<PolyTokenTransferEventArgs>>>,
}

/**
 * @param spender The address which will spend the funds.
 * @param value The amount of tokens to increase the allowance by.
 */
interface ChangeApprovalParams extends TxParams {
  spender: string;
  value: BigNumber;
}

/**
 * This class includes the functionality related to interacting with the PolyToken contract.
 */
export class PolyTokenWrapper extends ERC20TokenWrapper {
  public abi: ContractAbi = PolyToken.abi;
  protected _polymathRegistry: PolymathRegistryWrapper;
  protected _contract: Promise<PolyTokenContract>;

  /**
   * Instantiate PolyTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, ''); //Address is not needed as it is obtained from polymathRegistry async
    this._polymathRegistry = polymathRegistry;
    this._contract = this._getPolyTokenContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this._contract).address;
  }

  public increaseApproval = async (params: ChangeApprovalParams) => {
    return async () => {
      return (await this._contract).increaseApproval.sendTransactionAsync(
        params.spender,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public decreaseApproval = async (params: ChangeApprovalParams) => {
    return async () => {
      return (await this._contract).decreaseApproval.sendTransactionAsync(
        params.spender,
        params.value,
        params.txData,
        params.safetyFactor
      );
    }
  }

  public decimalFactor = async (): Promise<BigNumber> => {
    return await (await this._contract).decimalFactor.callAsync();
  }

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: IPolyTokenSubscribeAsyncParams = async <ArgsType extends PolyTokenEventArgs>(
    params: ISubscribeAsyncParams
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenEvents);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const subscriptionToken = this._subscribe<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.indexFilterValues,
        PolyToken.abi,
        params.callback,
        !_.isUndefined(params.isVerbose),
    );
    return subscriptionToken;
  }

  /**
   * Gets historical logs without creating a subscription
   * @return Array of logs that match the parameters
   */
  public getLogsAsync: IGetPolyTokenLogsAsyncParams = async <ArgsType extends PolyTokenEventArgs>(
    params: IGetLogsAsyncParams
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, PolyTokenEvents);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    const normalizedContractAddress = (await this._contract).address.toLowerCase();
    const logs = await this._getLogsAsync<ArgsType>(
        normalizedContractAddress,
        params.eventName,
        params.blockRange,
        params.indexFilterValues,
        PolyToken.abi,
    );
    return logs;
  }

  private async _getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
      this.abi,
      await this._polymathRegistry.getPolyTokenAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
