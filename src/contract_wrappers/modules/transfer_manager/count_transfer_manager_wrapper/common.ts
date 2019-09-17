import {
  CountTransferManagerContract_3_0_0,
  Web3Wrapper,
  BigNumber,
  PolyResponse,
} from '@polymathnetwork/abi-wrappers';
import { numberToBigNumber, parseTransferResult, valueToWei } from '../../../../utils/convert';
import ContractFactory from '../../../../factories/contractFactory';
import { ErrorCode, Perm, TransferResult, TxParams } from '../../../../types';
import ModuleWrapper from '../../module_wrapper';
import assert from '../../../../utils/assert';

export namespace CountTransferManagerTransactionParams {
  export interface ChangeHolderCount extends ChangeHolderCountParams {}
}

/**
 * @param from Address of the sender
 * @param to Address of the receiver
 * @param amount Amount to send
 * @param data Data value
 */
interface VerifyTransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  data: string;
}

/**
 * @param maxHolderCount is the new maximum amount of token holders
 */
interface ChangeHolderCountParams extends TxParams {
  maxHolderCount: number;
}

/**
 * @param transferResult
 * @param address
 */
interface VerifyTransfer {
  transferResult: TransferResult;
  address: string;
}

/**
 * This class includes the functionality related to interacting with the Count Transfer Manager contract.
 */
export default class CountTransferManagerCommon extends ModuleWrapper {
  public contract: Promise<CountTransferManagerContract_3_0_0>;

  /**
   * Instantiate CountTransferManagerWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param contractFactory
   */
  public constructor(
    web3Wrapper: Web3Wrapper,
    contract: Promise<CountTransferManagerContract_3_0_0>,
    contractFactory: ContractFactory,
  ) {
    super(web3Wrapper, contract, contractFactory);
    this.contract = contract;
  }

  /**
   *  Unpause the module
   */
  public unpause = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(await this.paused(), ErrorCode.PreconditionRequired, 'Controller not currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).unpause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *  Check if module paused
   */
  public paused = async (): Promise<boolean> => {
    return (await this.contract).paused.callAsync();
  };

  /**
   *  Pause the module
   */
  public pause = async (params: TxParams): Promise<PolyResponse> => {
    assert.assert(!(await this.paused()), ErrorCode.ContractPaused, 'Controller currently paused');
    assert.assert(
      await this.isCallerTheSecurityTokenOwner(params.txData),
      ErrorCode.Unauthorized,
      'Sender is not owner',
    );
    return (await this.contract).pause.sendTransactionAsync(params.txData, params.safetyFactor);
  };

  /**
   *The maximum number of concurrent token holders
   */
  public maxHolderCount = async (): Promise<number> => {
    return (await (await this.contract).maxHolderCount.callAsync()).toNumber();
  };

  /**
   * Used to verify the transfer transaction and prevent a transfer if it passes the allowed amount of token holders
   * @return boolean transfer result, address
   */
  public verifyTransfer = async (params: VerifyTransferParams): Promise<VerifyTransfer> => {
    assert.isETHAddressHex('from', params.from);
    assert.isETHAddressHex('to', params.to);
    const decimals = await (await this.securityTokenContract()).decimals.callAsync();
    const result = await (await this.contract).verifyTransfer.callAsync(
      params.from,
      params.to,
      valueToWei(params.amount, decimals),
      params.data,
    );
    const transferResult = parseTransferResult(result[0]);
    return {
      transferResult,
      address: result[1],
    };
  };

  /**
   * Sets the cap for the amount of token holders there can be
   */
  public changeHolderCount = async (params: ChangeHolderCountParams): Promise<PolyResponse> => {
    assert.assert(
      await this.isCallerAllowed(params.txData, Perm.Admin),
      ErrorCode.Unauthorized,
      'Caller is not allowed',
    );
    return (await this.contract).changeHolderCount.sendTransactionAsync(
      numberToBigNumber(params.maxHolderCount),
      params.txData,
      params.safetyFactor,
    );
  };
}
