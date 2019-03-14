import { SecurityTokenRegistryWrapper } from "../contract_wrappers/security_token_registry_wrapper";
import { SecurityTokenWrapper } from "../contract_wrappers/security_token_wrapper";
import { DetailedERC20Wrapper } from "../contract_wrappers/detailed_erc20_wrapper";
import { Web3Wrapper } from "@0x/web3-wrapper";

/**
 * The SecurityTokenFactory class is a factory to generate new SecurityTokenWrappers.
 */
export class TokenWrapperFactory {

  private readonly _web3Wrapper: Web3Wrapper;
    /**
   * An instance of the SecurityTokenRegistryWrapper class containing methods
   * for interacting with SecurityTokenRegistry smart contract.
   */
  private _securityTokenRegistry: SecurityTokenRegistryWrapper;

  constructor(web3Wrapper: Web3Wrapper, securityTokenRegistry: SecurityTokenRegistryWrapper) {
    this._web3Wrapper = web3Wrapper;
    this._securityTokenRegistry = securityTokenRegistry;
  }

    /**
   * @param address Security Token contract address
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getERC20TokenInstanceFromAddress = async (address: string) : Promise<DetailedERC20Wrapper> => {
    return new DetailedERC20Wrapper(this._web3Wrapper, address);
  }

  /**
   * @param address Security Token contract address
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getSecurityTokenInstanceFromAddress = async (address: string) : Promise<SecurityTokenWrapper> => {
    return new SecurityTokenWrapper(this._web3Wrapper, address);
  }

  /**
   * @param ticker Security Token token symbol
   *
   * @memberof SecurityTokenWrapperFactory
   */
  public getSecurityTokenInstanceFromTicker = async (ticker: string) : Promise<SecurityTokenWrapper> => {
    const address = await this._securityTokenRegistry.getSecurityTokenAddress(ticker);
    return new SecurityTokenWrapper(this._web3Wrapper, address);
  }

}