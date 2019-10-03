import {
  VestingEscrowWalletContract_3_0_0,
  Web3Wrapper,
  PolyResponse,
  LogWithDecodedArgs,
  VestingEscrowWalletEventArgs_3_0_0,
  VestingEscrowWalletEvents_3_0_0,
} from '@polymathnetwork/abi-wrappers';
import { schemas } from '@0x/json-schemas';
import ContractFactory from '../../../../factories/contractFactory';
import {
  ContractVersion,
  TxParams,
  Perm,
  ErrorCode,
  GetLogsAsyncParams,
  SubscribeAsyncParams,
  Constructor,
} from '../../../../types';
import { stringToBytes32, dateToBigNumber } from '../../../../utils/convert';
import VestingEscrowWalletCommon, {
  VestingEscrowWalletSubscribeAsyncParams,
  GetVestingEscrowWalletLogsAsyncParams,
} from './common';
import assert from '../../../../utils/assert';
import { WithModule_3_0_0 } from '../../module_wrapper';

/**
 * @param beneficiary Address of the beneficiary for whom it is modified
 * @param templateName Name of the template was used for schedule creation
 * @param startTime Start time of the created vesting schedule
 */
interface ModifyScheduleParams extends TxParams {
  beneficiary: string;
  templateName: string;
  startTime: Date;
}

export namespace VestingEscrowWalletTransactionParams {
  export interface ModifySchedule extends ModifyScheduleParams {}
}

const VestingEscrowWalletBase_3_0_0 = WithModule_3_0_0((VestingEscrowWalletCommon as unknown) as Constructor<
  VestingEscrowWalletCommon
>);

/**
 * This class includes the functionality related to interacting with the Vesting Escrow Wallet contract.
 */
export class VestingEscrowWallet_3_0_0 extends VestingEscrowWalletBase_3_0_0 {
  public contract: Promise<VestingEscrowWalletContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate VestingEscrowWalletWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<VestingEscrowWalletContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Address of the Treasury wallet. All of the unassigned token will transfer to that address.
   * @return address
   */
  public treasuryWallet = async (): Promise<string> => {
    return (await this.contract).treasuryWallet.callAsync();
  };

  /**
   * Modifies a vesting schedule for a beneficiary address
   */
  public modifySchedule = async (params: ModifyScheduleParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    this.checkSchedule(params.beneficiary);
    assert.assert(params.startTime.getTime() > Date.now(), ErrorCode.TooEarly, 'Date in the past');
    return (await this.contract).modifySchedule.sendTransactionAsync(
      params.beneficiary,
      stringToBytes32(params.templateName),
      dateToBigNumber(params.startTime),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Subscribe to an event type emitted by the contract.
   * @return Subscription token used later to unsubscribe
   */
  public subscribeAsync: VestingEscrowWalletSubscribeAsyncParams = async <
    ArgsType extends VestingEscrowWalletEventArgs_3_0_0
  >(
    params: SubscribeAsyncParams,
  ): Promise<string> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents_3_0_0);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', params.callback);
    const normalizedContractAddress = (await this.contract).address.toLowerCase();
    const subscriptionToken = this.subscribeInternal<ArgsType>(
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
  public getLogsAsync: GetVestingEscrowWalletLogsAsyncParams = async <
    ArgsType extends VestingEscrowWalletEventArgs_3_0_0
  >(
    params: GetLogsAsyncParams,
  ): Promise<LogWithDecodedArgs<ArgsType>[]> => {
    assert.doesBelongToStringEnum('eventName', params.eventName, VestingEscrowWalletEvents_3_0_0);
    assert.doesConformToSchema('blockRange', params.blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', params.indexFilterValues, schemas.indexFilterValuesSchema);
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

export function isVestingEscrowWallet_3_0_0(wrapper: VestingEscrowWalletCommon): wrapper is VestingEscrowWallet_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
