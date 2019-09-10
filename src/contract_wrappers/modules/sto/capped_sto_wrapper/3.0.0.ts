import { CappedSTOContract_3_0_0, Web3Wrapper, CappedSTOEventArgs_3_0_0, CappedSTOEvents_3_0_0, LogWithDecodedArgs, EventCallback, CappedSTOTokenPurchaseEventArgs_3_0_0, CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0, CappedSTOSetFundRaiseTypesEventArgs_3_0_0, CappedSTOPauseEventArgs_3_0_0, CappedSTOUnpauseEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import CappedSTOWrapper from './common';
import assert from '../../../../utils/assert';
import {
  ContractVersion, SubscribeAsyncParams, GetLogsAsyncParams, Subscribe, GetLogs,
} from '../../../../types';
import ContractFactory from '../../../../factories/contractFactory';
import { WithSTO_3_0_0 } from '../sto_wrapper';

interface TokenPurchaseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.TokenPurchase;
  callback: EventCallback<CappedSTOTokenPurchaseEventArgs_3_0_0>;
}

interface GetTokenPurchaseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.TokenPurchase;
}

interface SetAllowBeneficialInvestmentsSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetAllowBeneficialInvestments;
  callback: EventCallback<CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0>;
}

interface GetSetAllowBeneficialInvestmentsLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetAllowBeneficialInvestments;
}

interface SetFundRaiseTypesSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetFundRaiseTypes;
  callback: EventCallback<CappedSTOSetFundRaiseTypesEventArgs_3_0_0>;
}

interface GetSetFundRaiseTypesLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.SetFundRaiseTypes;
}

interface PauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Pause;
  callback: EventCallback<CappedSTOPauseEventArgs_3_0_0>;
}

interface GetPauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Pause;
}

interface UnpauseSubscribeAsyncParams extends SubscribeAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Unpause;
  callback: EventCallback<CappedSTOUnpauseEventArgs_3_0_0>;
}

interface GetUnpauseLogsAsyncParams extends GetLogsAsyncParams {
  eventName: CappedSTOEvents_3_0_0.Unpause;
}

interface CappedSTOSubscribeAsyncParams extends Subscribe {
  (params: TokenPurchaseSubscribeAsyncParams): Promise<string>;
  (params: SetAllowBeneficialInvestmentsSubscribeAsyncParams): Promise<string>;
  (params: SetFundRaiseTypesSubscribeAsyncParams): Promise<string>;
  (params: PauseSubscribeAsyncParams): Promise<string>;
  (params: UnpauseSubscribeAsyncParams): Promise<string>;
}

interface GetCappedSTOLogsAsyncParams extends GetLogs {
  (params: GetTokenPurchaseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOTokenPurchaseEventArgs_3_0_0>[]>;
  (params: GetSetAllowBeneficialInvestmentsLogsAsyncParams): Promise<
    LogWithDecodedArgs<CappedSTOSetAllowBeneficialInvestmentsEventArgs_3_0_0>[]
  >;
  (params: GetSetFundRaiseTypesLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOSetFundRaiseTypesEventArgs_3_0_0>[]>;
  (params: GetPauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOPauseEventArgs_3_0_0>[]>;
  (params: GetUnpauseLogsAsyncParams): Promise<LogWithDecodedArgs<CappedSTOUnpauseEventArgs_3_0_0>[]>;
}

const CappedSTOWrapperBase_3_0_0 = WithSTO_3_0_0(CappedSTOWrapper);

export class CappedSTO_3_0_0 extends CappedSTOWrapperBase_3_0_0 {
  public contract: Promise<CappedSTOContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate CappedSTOWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOContract_3_0_0>, contractFactory: ContractFactory) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }  

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: CappedSTOSubscribeAsyncParams = async <ArgsType extends CappedSTOEventArgs_3_0_0>(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents_3_0_0);
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
  public getLogsAsync: GetCappedSTOLogsAsyncParams = async <ArgsType extends CappedSTOEventArgs_3_0_0>(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, CappedSTOEvents_3_0_0);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const logs = await this.getLogsAsyncInternal<ArgsType>(
      normalizedContractAddress,
      params.eventName,
      params.blockRange,
      params.indexFilterValues,
    );
    return logs;
  };
}

export function isCappedSTO_3_0_0(wrapper: any): wrapper is CappedSTO_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
};