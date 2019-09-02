import { PolyTokenFaucetContract, Web3Wrapper, BigNumber } from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../contract_wrapper';
import { TxParams, ErrorCode } from '../../types';
import assert from '../../utils/assert';
import { valueToWei } from '../../utils/convert';

const MAX_TOKEN_AMOUNT = new BigNumber(1000000e18);

export namespace PolyTokenFaucetTransactionParams {
  export interface GetTokens extends GetTokensParams {}
}

interface GetTokensParams extends TxParams {
  amount: BigNumber;
  recipient: string;
}

/**
 * This class includes the functionality related to interacting with the PolyTokenFaucet contract.
 */
export default class PolyTokenFaucetWrapper extends ContractWrapper {
  protected contract: Promise<PolyTokenFaucetContract>;

  /**
   * Instantiate PolyTokenFaucetWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<PolyTokenFaucetContract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  public getTokens = async (params: GetTokensParams) => {
    assert.isNonZeroETHAddressHex('recipient', params.recipient);
    assert.assert(
      params.amount.isLessThanOrEqualTo(MAX_TOKEN_AMOUNT),
      ErrorCode.InvalidData,
      'Amount cannot exceed 1 million tokens',
    );

    return (await this.contract).getTokens.sendTransactionAsync(
      valueToWei(params.amount, await (await this.contract).decimals.callAsync()),
      params.recipient,
      params.txData,
      params.safetyFactor,
    );
  };

  public getLogsAsync: undefined;

  public subscribeAsync: undefined;
}
