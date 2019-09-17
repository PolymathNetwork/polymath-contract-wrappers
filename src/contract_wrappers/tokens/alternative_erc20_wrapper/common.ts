import { ERC20DetailedContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import { bytes32ToString } from '../../../utils/convert';
import ERC20TokenWrapper from '../erc20_wrapper';
import { ContractVersion } from '../../../types';

/**
 * This class includes the functionality related to interacting with the AlternativeERC20 contract.
 */
export default abstract class AlternativeERC20Common extends ERC20TokenWrapper {
  public contract: Promise<ERC20DetailedContract_3_0_0>;

  public contractVersion = ContractVersion.V3_0_0;

  /**
   * Instantiate AlternativeERC20Wrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param contract
   */
  public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ERC20DetailedContract_3_0_0>) {
    super(web3Wrapper, contract);
    this.contract = contract;
  }

  /**
   * Returns the token name
   * @return name
   */
  public name = async (): Promise<string> => {
    const name = (await this.contract).name.callAsync();
    return bytes32ToString(await name);
  };

  /**
   * Returns the token symbol
   * @return symbol
   */
  public symbol = async (): Promise<string> => {
    const symbol = (await this.contract).symbol.callAsync();
    return bytes32ToString(await symbol);
  };

  public async isValidContract(): Promise<boolean> {
    try {
      const contract = await this.contract;
      const totalSupply = await contract.totalSupply.callAsync();
      const symbol = await contract.symbol.callAsync();
      const name = await contract.name.callAsync();
      if (bytes32ToString(symbol) === '' || bytes32ToString(name) === '' || totalSupply.isZero()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
