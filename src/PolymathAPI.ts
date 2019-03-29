import {
  PolymathRegistry,
  SecurityToken,
  SecurityTokenRegistry,
  PolyToken,
  ModuleRegistry,
  CappedSTO,
  CappedSTOFactory,
  ModuleFactory,
  USDTieredSTO,
  USDTieredSTOFactory,
  FeatureRegistry,
  GeneralTransferManager,
  GeneralPermissionManager,
  ERC20DividendCheckpoint,
  ManualApprovalTransferManager,
  CountTransferManager,
} from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper, Provider } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { PolymathRegistryWrapper } from './contract_wrappers/registries/polymath_registry_wrapper';
import { SecurityTokenRegistryWrapper } from './contract_wrappers/registries/security_token_registry_wrapper';
import { PolyTokenWrapper } from './contract_wrappers/tokens/poly_token_wrapper';
import { ModuleRegistryWrapper } from './contract_wrappers/registries/module_registry_wrapper';
import { TokenWrapperFactory } from './factories/tokenWrapperFactory';
import { ModuleWrapperFactory } from './factories/moduleWrapperFactory';
import { FeatureRegistryWrapper } from './contract_wrappers/registries/feature_registry_wrapper';
import { assert } from './utils/assert';
import * as _ from 'lodash';


/**
 * @param provider The web3 provider 
 * @param polymathRegistry The PolymathRegistry contract address '0x...'
 */
export interface IApiConstructorParams {
  provider: Provider,
  polymathRegistryAddress?: string,
  defaultGasPrice?: BigNumber
}

/**
 * @param address (optional) Account address
 */
export interface IGetBalanceParams {
  address?: string
}

/**
 * The PolymathAPI class contains smart contract wrappers helpful to interact with Polymath ecosystem.
 */
export class PolymathAPI {
  /**
   * An instance of the PolymathRegistryWrapper class containing methods
   * for interacting with PolymathRegistry smart contract.
   */
  public polymathRegistry: PolymathRegistryWrapper;
  /**
   * An instance of the SecurityTokenRegistryWrapper class containing methods
   * for interacting with SecurityTokenRegistry smart contract.
   */
  public securityTokenRegistry: SecurityTokenRegistryWrapper;
  /**
   * An instance of the PolyTokenWrapper class containing methods
   * for interacting with PolyToken smart contract.
   */
  public polyToken: PolyTokenWrapper;
  /**
   * An instance of the ModuleRegistryWrapper class containing methods
   * for interacting with ModuleRegistry smart contract.
   */
  public moduleRegistry: ModuleRegistryWrapper;
  /**
   * An instance of the FeatureRegistryWrapper class containing methods
   * for interacting with FeatureRegistry smart contract.
   */
  public featureRegistry: FeatureRegistryWrapper;
  /**
   * An instance of the TokenWrapperFactory class to get 
   * TokenWrapper instances to interact with SecurityToken or ERC20 smart contracts
   */
  public tokenFactory: TokenWrapperFactory;
  /**
   * An instance of the ModuleWrapperFactory class to get 
   * different module wrapper instances to interact with SecurityToken smart contracts
   */
  public moduleFactory: ModuleWrapperFactory;

  private readonly _web3Wrapper: Web3Wrapper;

  /**
   * Instantiates a new PolymathAPI instance.
   * @return  An instance of the PolymathAPI class.
   */
  constructor(params: IApiConstructorParams) {
    assert.isWeb3Provider('provider', params.provider);

    this._web3Wrapper = new Web3Wrapper(
      params.provider,
      { 
        gasPrice: params.defaultGasPrice 
      }
    );

    const artifactsArray = [
      PolymathRegistry,
      SecurityToken,
      SecurityTokenRegistry,
      PolyToken,
      ModuleRegistry,
      CappedSTO,
      CappedSTOFactory,
      ModuleFactory,
      USDTieredSTO,
      USDTieredSTOFactory,
      FeatureRegistry,
      GeneralTransferManager,
      GeneralPermissionManager,
      ERC20DividendCheckpoint,
      ManualApprovalTransferManager,
      CountTransferManager,
    ];

    _.forEach(artifactsArray, artifact => { // tslint:disable-line
      this._web3Wrapper.abiDecoder.addABI((artifact as any).abi);
    });

    this.polymathRegistry = new PolymathRegistryWrapper(
      this._web3Wrapper,
      params.polymathRegistryAddress,
    );
    this.securityTokenRegistry = new SecurityTokenRegistryWrapper(
      this._web3Wrapper,
      this.polymathRegistry,
    );
    this.polyToken = new PolyTokenWrapper(
      this._web3Wrapper,
      this.polymathRegistry,
    );
    this.moduleRegistry = new ModuleRegistryWrapper(
      this._web3Wrapper,
      this.polymathRegistry,
    );
    this.featureRegistry = new FeatureRegistryWrapper(
      this._web3Wrapper,
      this.polymathRegistry,
    );
    this.tokenFactory = new TokenWrapperFactory(
      this._web3Wrapper,
      this.securityTokenRegistry
    )
    this.moduleFactory = new ModuleWrapperFactory(
      this._web3Wrapper
    )
  }

  /**
   * Get the account currently used by PolymathAPI
   * @return Address string
   */
  public getAccount = async (): Promise<string>  => {
    return (await this._web3Wrapper.getAvailableAddressesAsync())[0];
  }

  /**
   * Get the ETH balance
   * @return Balance BigNumber
   */
  public getBalance = async (params: IGetBalanceParams): Promise<BigNumber> => {
    const addr = !_.isUndefined(params.address) ? params.address : await this.getAccount();
    return (await this._web3Wrapper.getBalanceInWeiAsync(addr));
  }

  /**
   * Is it Testnet network?
   */
  public isTestnet = async (): Promise<boolean> => {
    return await this._web3Wrapper.getNetworkIdAsync() !== 1;
  }
}
  