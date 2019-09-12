import { BigNumber, Web3Wrapper, PolyResponse } from '@polymathnetwork/abi-wrappers';
import _ from 'lodash';
import ContractWrapper from '../contract_wrapper';
import { TxParams, ERC20Contract } from '../../types';
import assert from '../../utils/assert';
import { valueToWei, weiToValue } from '../../utils/convert';

export namespace ERC20TransactionParams {
  export interface Approve extends ApproveParams {}
  export interface TransferFrom extends TransferFromParams {}
  export interface Transfer extends TransferParams {}
}

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
 * This class includes the functionality related to interacting with the ERC20 contract.
 */
export default abstract class ERC20TokenWrapper extends ContractWrapper {
  protected contract: Promise<ERC20Contract>;

  /**
   * Instantiate ERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20Contract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Returns the token name
   * @return name
   */
  public name = async (): Promise<string> => {
    return (await this.contract).name.callAsync();
  };

  /**
   * Approves the passed address to spend the specified amount of tokens
   */
  public approve = async (params: ApproveParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('spender', params.spender);
    return (await this.contract).approve.sendTransactionAsync(
      params.spender,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the token total supply
   * @return total supply amount
   */
  public totalSupply = async (): Promise<BigNumber> => {
    return weiToValue(await (await this.contract).totalSupply.callAsync(), await this.decimals());
  };

  /**
   * Send tokens amount of tokens from address from to address to
   */
  public transferFrom = async (params: TransferFromParams): Promise<PolyResponse> => {
    assert.isETHAddressHex('from', params.from);
    assert.isNonZeroETHAddressHex('to', params.to);
    return (await this.contract).transferFrom.sendTransactionAsync(
      params.from,
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Returns the setted decimals
   * @return decimal amount
   */
  public decimals = async (): Promise<BigNumber> => {
    return (await this.contract).decimals.callAsync();
  };

  /**
   * Returns the balance of the specified address
   * @return A BigNumber representing the amount owned by the passed address
   */
  public balanceOf = async (params?: GetBalanceOfParams): Promise<BigNumber> => {
    const address =
      !_.isUndefined(params) && !_.isUndefined(params.owner) ? params.owner : await this.getDefaultFromAddress();
    assert.isETHAddressHex('owner', address);
    return weiToValue(await (await this.contract).balanceOf.callAsync(address), await this.decimals());
  };

  /**
   * Returns the token symbol
   * @return symbol
   */
  public symbol = async (): Promise<string> => {
    return (await this.contract).symbol.callAsync();
  };

  /**
   * Transfer the balance from token owner's account to 'to' account
   */
  public transfer = async (params: TransferParams): Promise<PolyResponse> => {
    assert.isNonZeroETHAddressHex('to', params.to);
    return (await this.contract).transfer.sendTransactionAsync(
      params.to,
      valueToWei(params.value, await this.decimals()),
      params.txData,
      params.safetyFactor,
    );
  };

  /**
   * Function to check the amount of tokens a spender is allowed to spend
   * @return A BigNumber specifying the amount of tokens left available for the spender
   */
  public allowance = async (params: AllowanceParams): Promise<BigNumber> => {
    assert.isETHAddressHex('owner', params.owner);
    assert.isETHAddressHex('spender', params.spender);
    return weiToValue(
      await (await this.contract).allowance.callAsync(params.owner, params.spender),
      await this.decimals(),
    );
  };

  public async isValidContract() {
    try {
      const contract = await this.contract;
      const totalSupply = await contract.totalSupply.callAsync();
      const symbol = await contract.symbol.callAsync();
      const name = await contract.name.callAsync();
      if (symbol === '' || name === '' || totalSupply.isZero()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
