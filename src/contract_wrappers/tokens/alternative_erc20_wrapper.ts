import { DetailedERC20Contract } from '@polymathnetwork/abi-wrappers';
import { AlternativeERC20 } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';
import DetailedERC20Wrapper from './detailed_erc20_wrapper';
import { bytes32ToString } from '../../utils/convert';

/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default class AlternativeERC20TokenWrapper extends DetailedERC20Wrapper {
  public abi: ContractAbi = AlternativeERC20.abi;

  protected contract: Promise<DetailedERC20Contract>;

  /**
   * Instantiate AlternativeERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<DetailedERC20Contract>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Returns the token name
   */
  public name = async () => {
    const name = (await this.contract).name.callAsync();
    return bytes32ToString(await name);
  };

  /**
   * Returns the token symbol
   */
  public symbol = async () => {
    const symbol = (await this.contract).symbol.callAsync();
    return bytes32ToString(await symbol);
  };
}
