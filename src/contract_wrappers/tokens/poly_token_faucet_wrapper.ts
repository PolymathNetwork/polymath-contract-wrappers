import { PolyTokenFaucetContract } from '@polymathnetwork/abi-wrappers';
import { PolyTokenFaucet } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import ContractWrapper from '../contract_wrapper';
import { TxParams } from '../../types';
import assert from '../../utils/assert';

interface GetTokensParams extends TxParams {
  amount: BigNumber;
  recipient: string;
}

/**
 * This class includes the functionality related to interacting with the PolyTokenFaucet contract.
 */
export default class PolyTokenFaucetWrapper extends ContractWrapper {
  public abi: ContractAbi = PolyTokenFaucet.abi;

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
      params.amount.isLessThanOrEqualTo(new BigNumber(1000000e18)),
      'Amount cannot exceed 1 million tokens',
    );

    return (await this.contract).getTokens.sendTransactionAsync(
      params.amount,
      params.recipient,
      params.txData,
      params.safetyFactor,
    );
  };

  public getLogsAsync: undefined;

  public subscribeAsync: undefined;
}
