import {
  PolymathRegistry,
  SecurityToken,
  SecurityTokenRegistry,
  PolyToken,
  ModuleRegistry,
  CappedSTO,
  CappedSTOFactory,
} from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { SecurityTokenWrapper } from './contract_wrappers/security_token_wrapper';
import { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
import { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
import { ModuleRegistryWrapper } from './contract_wrappers/module_registry_wrapper';
import { CappedSTOWrapper } from './contract_wrappers/capped_sto_wrapper';
import { CappedSTOFactoryWrapper } from './contract_wrappers/capped_sto_factory_wrapper';
import { ContractWrappersConfigSchema } from './schemas/contract_wrappers_config_schema';
import { IContractWrappersConfig } from './types';
import { assert } from './utils/assert';
import { _getDefaultContractAddresses } from './utils/contract_addresses';
import { SignerSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import * as _ from 'lodash';

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

/**
 * The PolymathAPI class contains smart contract wrappers helpful to interact with Polymath ecosystem.
 */
export class PolymathAPI {
    /**
     * An instance of the PolymathRegistryWrapper class containing methods for interacting with PolymathRegistry smart contract.
     */
    public polymathRegistry: PolymathRegistryWrapper;
    /**
     * An instance of the SecurityTokenWrapper class containing methods for interacting with SecurityToken smart contract.
     */
    public securityToken: SecurityTokenWrapper;
    /**
     * An instance of the SecurityTokenRegistryWrapper class containing methods for interacting with SecurityTokenRegistry smart contract.
     */
    public securityTokenRegistry: SecurityTokenRegistryWrapper;
    /**
     * An instance of the PolyTokenWrapper class containing methods for interacting with PolyToken smart contract.
     */
    public polyToken: PolyTokenWrapper;
    /**
     * An instance of the ModuleRegistryWrapper class containing methods for interacting with ModuleRegistry smart contract.
     */
    public moduleRegistry: ModuleRegistryWrapper;
    /**
     * An instance of the CappedSTOWrapper class containing methods for interacting with ModuleRegistry smart contract.
     */
    public cappedSTO: CappedSTOWrapper;
    /**
     * An instance of the CappedSTOFactoryWrapper class containing methods for interacting with ModuleRegistry smart contract.
     */
    public cappedSTOFactory: CappedSTOFactoryWrapper;

    private readonly web3Wrapper: Web3Wrapper;

    /**
     * Instantiates a new PolymathAPI instance.
     * @param   rpcurl      The RPC url you would like the contract-wrappers library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the PolymathAPI class.
     */
    constructor(rpcurl: string = 'http://127.0.0.1:8545', config: IContractWrappersConfig) {
      assert.doesConformToSchema(
        'config',
        config,
        ContractWrappersConfigSchema,
      );

      const txDefaults = {
        gasPrice: config.gasPrice,
      };

      const providerEngine = new Web3ProviderEngine();

      if (window.web3) {
        providerEngine.addProvider(
          new SignerSubprovider(window.web3.currentProvider),
        );
      } else if (window.ethereum) {
        providerEngine.addProvider(
          new SignerSubprovider(window.ethereum),
        );
      }
      providerEngine.addProvider(new RPCSubprovider(rpcurl));
      providerEngine.start();

      this.web3Wrapper = new Web3Wrapper(
        providerEngine,
        txDefaults,
      );
      const artifactsArray = [
        PolymathRegistry,
        SecurityToken,
        SecurityTokenRegistry,
        PolyToken,
        ModuleRegistry,
        CappedSTO,
        CappedSTOFactory,
      ];
      _.forEach(artifactsArray, artifact => {
        this.web3Wrapper.abiDecoder.addABI(artifact.abi);
      });
      const contractAddresses = _.isUndefined(config.contractAddresses)
          ? _getDefaultContractAddresses(config.networkId)
          : config.contractAddresses;
      this.polymathRegistry = new PolymathRegistryWrapper(
        this.web3Wrapper,
        config.networkId,
        contractAddresses.polymathRegistry,
      );
      this.securityToken = new SecurityTokenWrapper(
        this.web3Wrapper,
        config.networkId,
        this.polymathRegistry,
      );
      this.securityTokenRegistry = new SecurityTokenRegistryWrapper(
        this.web3Wrapper,
        config.networkId,
        this.polymathRegistry,
      );
      this.polyToken = new PolyTokenWrapper(
        this.web3Wrapper,
        config.networkId,
        this.polymathRegistry,
      );
      this.moduleRegistry = new ModuleRegistryWrapper(
        this.web3Wrapper,
        config.networkId,
        this.polymathRegistry,
      );
      this.cappedSTO = new CappedSTOWrapper(
        this.web3Wrapper,
        config.networkId,
        this.polymathRegistry,
      );
      this.cappedSTOFactory = new CappedSTOFactoryWrapper(
        this.web3Wrapper,
        config.networkId,
        this.polymathRegistry,
      );
    }

    /**
     * Get the account currently used by PolymathAPI
     * @return Address string
     */
    public async getAccount(): Promise<string> {
      return (await this.web3Wrapper.getAvailableAddressesAsync())[0];
    }

    /**
     * Get the network id currently used by PolymathAPI
     * @return Number
     */
    public async getNetworkId(): Promise<number> {
      return await this.web3Wrapper.getNetworkIdAsync();
    }
}
