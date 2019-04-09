import { SecurityTokenRegistryWrapper } from "../contract_wrappers/registries/security_token_registry_wrapper";
import { SecurityTokenWrapper } from "../contract_wrappers/tokens/security_token_wrapper";
import { ERC20TokenWrapper } from "../contract_wrappers/tokens/erc20_wrapper";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { DetailedERC20TokenWrapper } from "../contract_wrappers/tokens/detailed_erc20_wrapper";
import {PolymathRegistryWrapper} from '../contract_wrappers/registries/polymath_registry_wrapper';
import {ContractFactory} from './contractFactory';

/**
 * The SecurityTokenFactory class is a factory to generate new SecurityTokenWrappers.
 */
export class TokenWrapperFactory {

  private readonly _web3Wrapper: Web3Wrapper;
  private _contractFactory;
    /**
   * An instance of the SecurityTokenRegistryWrapper class containing methods
   * for interacting with SecurityTokenRegistry smart contract.
   */
  private _securityTokenRegistry: SecurityTokenRegistryWrapper;

  constructor(web3Wrapper: Web3Wrapper, securityTokenRegistry: SecurityTokenRegistryWrapper, contractFactory: ContractFactory) {
    this._web3Wrapper = web3Wrapper;
    this._securityTokenRegistry = securityTokenRegistry;
    this._contractFactory = contractFactory;
  }

    /**
   * @param address Security Token contract address
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getERC20TokenInstanceFromAddress = async (address: string): Promise<ERC20TokenWrapper> => {
      const token = new DetailedERC20TokenWrapper(
          this._web3Wrapper,
          this._contractFactory._getDetailedERC20Contract(address));
    if (await token.isValidContract()) {
      return token;
    } else {
      //TODO: Replace this for a typed Error
      throw new Error();
    }
  }

  /**
   * @param address Security Token contract address
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getSecurityTokenInstanceFromAddress = async (address: string) : Promise<SecurityTokenWrapper> => {
    if (await this.isValidSecurityToken(address)) {
      return new SecurityTokenWrapper(
          this._web3Wrapper,
          this._contractFactory._getSecurityTokenContract(address));
    } else {
      //TODO: Replace this for a typed Error
      throw new Error();
    }
  }

  /**
   * @param ticker Security Token token symbol
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getSecurityTokenInstanceFromTicker = async (ticker: string) : Promise<SecurityTokenWrapper> => {
    const address = await this._securityTokenRegistry.getSecurityTokenAddress(ticker);
    return new SecurityTokenWrapper(this._web3Wrapper, this._contractFactory._getSecurityTokenContract(address));
  }

  private async isValidSecurityToken(tokenAddress: string): Promise<boolean> {
    return await this._securityTokenRegistry.isSecurityToken({ securityTokenAddress: tokenAddress});
  }
}
