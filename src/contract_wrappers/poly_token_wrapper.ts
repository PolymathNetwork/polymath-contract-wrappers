import { PolyTokenContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { PolyToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { IBalanceOf, IAllowance, IApprove } from '../types';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the PolyToken contract.
 */
export class PolyTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = PolyToken.abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private polyTokenContract: Promise<PolyTokenContract>;
  /**
   * Instantiate PolyTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.polyTokenContract = this._getPolyTokenContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.polyTokenContract).address;
  }

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public getBalanceOf = async (params: IBalanceOf): Promise<BigNumber> => {
    const address = !_.isUndefined(params.address) ? params.address! : await this._getDefaultFromAddress();
    return await (await this.polyTokenContract).balanceOf.callAsync(
      address,
    );
  }

  /**
   * Function to check the amount of tokens a spender is allowed to spend
   * @return A BigNumber specifying the amount of tokens left available for the spender
   */
  public allowance = async (params: IAllowance): Promise<BigNumber> => {
    const spender = await this._getDefaultFromAddress();
    return await (await this.polyTokenContract).allowance.callAsync(
      params.owner,
      spender,
    );
  }

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: IApprove) => {
    return async () => {
      return (await this.polyTokenContract).approve.sendTransactionAsync(
        params.spender,
        params.value
      );
    }
  }

  private async _getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
      this.abi,
      await this.polymathRegistry.getPolyTokenAddress(),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
