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
  } from '@polymathnetwork/contract-artifacts';
  import { Web3Wrapper } from '@0x/web3-wrapper';
  import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
  import { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
  import { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
  import { ModuleRegistryWrapper } from './contract_wrappers/module_registry_wrapper';

  import { FeatureRegistryWrapper } from './contract_wrappers/feature_registry_wrapper';
  import * as types from './types';
  import { assert } from './utils/assert';
  import { _getDefaultContractAddresses } from './addresses';
  import * as _ from 'lodash';
  
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
  
      private readonly web3Wrapper: Web3Wrapper;
  
      /**
       * Instantiates a new PolymathAPI instance.
       * @return  An instance of the PolymathAPI class.
       */
      constructor(params: types.IApiConstructor) {
        assert.isWeb3Provider('provider', params.provider);
  
        this.web3Wrapper = new Web3Wrapper(
          params.provider,
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
        ];
  
        _.forEach(artifactsArray, artifact => { // tslint:disable-line
          this.web3Wrapper.abiDecoder.addABI((artifact as any).abi);
        });
  
        this.polymathRegistry = new PolymathRegistryWrapper(
          this.web3Wrapper,
          params.polymathRegistryAddress,
        );
        this.securityTokenRegistry = new SecurityTokenRegistryWrapper(
          this.web3Wrapper,
          this.polymathRegistry,
        );
        this.polyToken = new PolyTokenWrapper(
          this.web3Wrapper,
          this.polymathRegistry,
        );
        this.moduleRegistry = new ModuleRegistryWrapper(
          this.web3Wrapper,
          this.polymathRegistry,
        );
        this.featureRegistry = new FeatureRegistryWrapper(
          this.web3Wrapper,
          this.polymathRegistry,
        );
      }
  
      /**
       * Get the account currently used by PolymathAPI
       * @return Address string
       */
      public getAccount = async (): Promise<string | undefined>  => {
        if (!_.isUndefined(this.web3Wrapper)) {
          return (await this.web3Wrapper.getAvailableAddressesAsync())[0];
        } else {
          return undefined;
        }
      }
  
      /**
       * Is it Testnet network?
       */
      public isTestnet = async (): Promise<boolean> => {
        return await this.web3Wrapper.getNetworkIdAsync() !== 1;
      }
  
  }
  