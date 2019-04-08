import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from '../contract_wrapper';
import {
  TxParams,
  ERC20Contract,
} from '../../types';

/**
 * @param spender The address which will spend the funds
 * @param value The amount of tokens to be spent
 */
interface ApproveParams extends TxParams {
    spender: string;
    value: BigNumber;
}

/**
 * @param from The address which will spend the funds
 * @param to The address who will receive the funds
 * @param value The amount of tokens to be spent
 */
interface TransferFromParams extends TxParams {
    from: string;
    to: string;
    value: BigNumber;
}

/**
 * @param owner The address to query the the balance of
 */
interface GetBalanceOfParams {
    owner?: string;
}

/**
 * @param to The address who will receive the funds
 * @param value The amount of tokens to be spent
 */
interface TransferParams extends TxParams {
    to: string;
    value: BigNumber;
}

/**
 * @param owner address The address which owns the tokens
 * @param spender address The address which will spend the tokens
 */
interface AllowanceParams {
    owner: string;
    spender: string;
}

/**
 * This class includes the functionality related to interacting with the DetailedERC20 contract.
 */
export abstract class ERC20TokenWrapper extends ContractWrapper {
  protected _contract: Promise<ERC20Contract>;

  /**
   * Instantiate DetailedERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20Contract>) {
    super(web3Wrapper, contract);
    this._contract = contract;
  }

  /**
   * Returns the token name
   */
  public name = async () => {
    return await (await this._contract).name.callAsync();
  }

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: ApproveParams) => {
    return (await this._contract).approve.sendTransactionAsync(
      params.spender,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Returns the token total supply
   */
  public totalSupply = async () => {
    return await (await this._contract).totalSupply.callAsync();
  }

  /**
   * Send tokens amount of tokens from address from to address to
   */
  public transferFrom = async (params: TransferFromParams) => {
    return (await this._contract).transferFrom.sendTransactionAsync(
      params.from,
      params.to,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Returns the setted decimals
   */
  public decimals = async () => {
    return await (await this._contract).decimals.callAsync();
  }

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public balanceOf = async (params?: GetBalanceOfParams) => {
    const address = (!_.isUndefined(params) && !_.isUndefined(params.owner)) ? params.owner : await this._getDefaultFromAddress();
    return await (await this._contract).balanceOf.callAsync(
      address
    );
  }

  /**
   * Returns the token symbol
   */
  public symbol = async () => {
    return await (await this._contract).symbol.callAsync();
  }

  /**
   * Transfer the balance from token owner's account to 'to' account
   */
  public transfer = async (params: TransferParams) => {
    return (await this._contract).transfer.sendTransactionAsync(
      params.to,
      params.value,
      params.txData,
      params.safetyFactor
    );
  }

  /**
   * Function to check the amount of tokens a spender is allowed to spend
   * @return A BigNumber specifying the amount of tokens left available for the spender
   */
  public allowance = async (params: AllowanceParams) => {
    return await (await this._contract).allowance.callAsync(
      params.owner,
      params.spender
    );
  }

  public async isValidContract() {
    try {
      const contract = await this._contract;
      await contract.totalSupply.callAsync();
      await contract.balanceOf.callAsync(contract.address);
      await contract.allowance.callAsync(contract.address, contract.address);
      await contract.symbol.callAsync();
      return true;
    } catch (error) {
      return false;
    }
  }
}
