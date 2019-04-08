import { PolyTokenFaucetContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from '../registries/polymath_registry_wrapper';
import { PolyTokenFaucet } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { ContractWrapper } from '../contract_wrapper';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { TxParams } from '../../types';

interface GetTokensParams extends TxParams {
  amount: BigNumber,
  recipient: string,
}

/**
 * This class includes the functionality related to interacting with the PolyTokenFaucet contract.
 */
export class PolyTokenFaucetWrapper extends ContractWrapper {
  public abi: ContractAbi = (PolyTokenFaucet as any).abi;
  protected _contract: Promise<PolyTokenFaucetContract>;
  protected _polymathRegistry: PolymathRegistryWrapper;

  /**
   * Instantiate PolyTokenFaucetWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper, contract: Promise<PolyTokenFaucetContract>) {
    super(web3Wrapper, contract);
    this._polymathRegistry = polymathRegistry;
    this._contract = contract;
  }

  public getTokens = async (params: GetTokensParams) => {
    return (await this._contract).getTokens.sendTransactionAsync(
      params.amount,
      params.recipient,
      params.txData,
      params.safetyFactor
    );
  }

  public getLogsAsync: undefined;
  public subscribeAsync: undefined;
}
