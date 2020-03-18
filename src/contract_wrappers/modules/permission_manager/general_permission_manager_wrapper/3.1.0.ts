import { GeneralPermissionManagerContract_3_1_0, Web3Wrapper, PolyResponse } from '@polymathnetwork/abi-wrappers';
import assert from '../../../../utils/assert';
import ContractFactory from '../../../../factories/contractFactory';
import { TxParams, Perm, ErrorCode, ContractVersion, Constructor } from '../../../../types';
import { stringArrayToBytes32Array } from '../../../../utils/convert';
import GeneralPermissionManagerCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

/**
 * @param delegates An array of Ethereum addresses of the delegates
 * @param details An array of details about the delegates i.e `Belongs to financial firm`
 */
export interface AddDelegateMultiParams extends TxParams {
  delegates: string[];
  details: string[];
}

/**
 * @param delegates An array of Ethereum address of delegates
 */
export interface DeleteDelegateMultiParams extends TxParams {
  delegates: string[];
}

// uses 3.0.0 Module contract
const GeneralPermissionManagerBase_3_1_0 = WithModule_3_0_0((GeneralPermissionManagerCommon as unknown) as Constructor<
  GeneralPermissionManagerCommon
>);

/**
 * This class includes the functionality related to interacting with the General Permission Manager contract.
 */
export class GeneralPermissionManager_3_1_0 extends GeneralPermissionManagerBase_3_1_0 {
  public contract: Promise<GeneralPermissionManagerContract_3_1_0>;

  public contractVersion = ContractVersion.V3_1_0;

  /**
   * Instantiate GeneralPermissionManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<GeneralPermissionManagerContract_3_1_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   * Used to add multiple delegates in a batch
   */
  public addDelegateMulti = async (params: AddDelegateMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    assert.assert(
      params.delegates.length === params.details.length,
      ErrorCode.MismatchedArrayLength,
      'Array length mismatch',
    );

    const resultCheckDelegate = [];
    for (let i = 0; i < params.delegates.length; i += 1) {
      assert.isNonZeroETHAddressHex('delegate', params.delegates[i]);
      assert.assert(params.details[i].length > 0, ErrorCode.InvalidData, '0 value not allowed');
      resultCheckDelegate.push(this.delegateIsNotPresent(params.delegates[i]));
    }
    await Promise.all(resultCheckDelegate);
    return (await this.contract).addDelegateMulti.sendTransactionAsync(
      params.delegates,
      stringArrayToBytes32Array(params.details),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Used to delete a list of delegates
   */
  public deleteDelegateMulti = async (params: DeleteDelegateMultiParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );

    const resultCheckDelegate = [];
    for (let i = 0; i < params.delegates.length; i += 1) {
      assert.isNonZeroETHAddressHex('delegate', params.delegates[i]);
      resultCheckDelegate.push(this.delegateDoesNotExist(params.delegates[i]));
    }
    await Promise.all(resultCheckDelegate);
    return (await this.contract).deleteDelegateMulti.sendTransactionAsync(
      params.delegates,
      params.txData,
      params.safetyFactor,
    );
  };

  private delegateIsNotPresent = async (delegate: string) => {
    assert.assert(
      !(await (await this.contract).checkDelegate.callAsync(delegate)),
      ErrorCode.AlreadyExists,
      `Delegate already present`,
    );
  };

  private delegateDoesNotExist = async (delegate: string) => {
    assert.assert(
      await (await this.contract).checkDelegate.callAsync(delegate),
      ErrorCode.NotFound,
      'Delegate does not exist',
    );
  };
}

export function isGeneralPermissionManager_3_1_0(
  wrapper: GeneralPermissionManagerCommon,
): wrapper is GeneralPermissionManager_3_1_0 {
  return wrapper.contractVersion === ContractVersion.V3_1_0;
}
