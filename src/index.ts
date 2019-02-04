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
} from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { SecurityTokenWrapper } from './contract_wrappers/security_token_wrapper';
import { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
import { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
import { ModuleRegistryWrapper } from './contract_wrappers/module_registry_wrapper';
import { CappedSTOWrapper } from './contract_wrappers/capped_sto_wrapper';
import { CappedSTOFactoryWrapper } from './contract_wrappers/capped_sto_factory_wrapper';
import { ModuleFactoryWrapper } from './contract_wrappers/module_factory_wrapper';
import { USDTieredSTOWrapper } from './contract_wrappers/usd_tiered_sto_wrapper';
import { USDTieredSTOFactoryWrapper } from './contract_wrappers/usd_tiered_sto_factory_wrapper';
import { _getDefaultContractAddresses } from './utils/contract_addresses';
import { configs } from './utils/configs';
import {
  RPCSubprovider,
  Web3ProviderEngine,
  MetamaskSubprovider,
  RedundantSubprovider,
} from '@0x/subproviders';
import * as _ from 'lodash';
import { Provider } from 'ethereum-types';

/**
 * The PolymathAPI class contains smart contract wrappers helpful to interact with Polymath ecosystem.
 */
export class PolymathAPI {

    /**
     * Instantiates a new PolymathAPI instance.
     * @return  An instance of the PolymathAPI class.
     */
    public static async init(): Promise<PolymathAPI> {

      const me = new PolymathAPI();
      const providerEngine = new Web3ProviderEngine();
      let networkId: number = 1;

      const injectedProviderIfExists = await me._getInjectedProviderIfExists();
      if (!_.isUndefined(injectedProviderIfExists)) {
        try {
          providerEngine.addProvider(new MetamaskSubprovider(injectedProviderIfExists));
          networkId = Number((injectedProviderIfExists as any).networkVersion);
        } catch (err) {
          // Ignore error and proceed with networkId undefined
        }
      } else {
        networkId = 15; // Remove this with something better.
      }

      const publicNodeUrlsIfExistsForNetworkId = configs.PUBLIC_NODE_URLS_BY_NETWORK_ID[networkId];
      /* tslint:disable */
      const rpcSubproviders = _.map(publicNodeUrlsIfExistsForNetworkId, publicNodeUrl => {
        return new RPCSubprovider(publicNodeUrl);
      });
      /* tslint:enable */
      providerEngine.addProvider(new RedundantSubprovider(rpcSubproviders));
      providerEngine.start();

      me.web3Wrapper = new Web3Wrapper(
        providerEngine,
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
      ];

      /* tslint:disable */
      _.forEach(artifactsArray, artifact => {
        (me.web3Wrapper)!.abiDecoder.addABI((artifact as any).abi);
      });
      /* tslint:enable */
      const contractAddresses = _getDefaultContractAddresses(networkId);

      me.polymathRegistry = new PolymathRegistryWrapper(
        me.web3Wrapper,
        networkId,
        contractAddresses.polymathRegistry,
      );
      me.securityToken = new SecurityTokenWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.securityTokenRegistry = new SecurityTokenRegistryWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.polyToken = new PolyTokenWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.moduleRegistry = new ModuleRegistryWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.cappedSTO = new CappedSTOWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.cappedSTOFactory = new CappedSTOFactoryWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.moduleFactory = new ModuleFactoryWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.usdTieredSTO = new USDTieredSTOWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );
      me.usdTieredSTOFactory = new USDTieredSTOFactoryWrapper(
        me.web3Wrapper,
        networkId,
        me.polymathRegistry,
      );

      return me;
    }

    /**
     * An instance of the PolymathRegistryWrapper class containing methods
     * for interacting with PolymathRegistry smart contract.
     */
    public polymathRegistry?: PolymathRegistryWrapper;
    /**
     * An instance of the SecurityTokenWrapper class containing methods
     * for interacting with SecurityToken smart contract.
     */
    public securityToken?: SecurityTokenWrapper;
    /**
     * An instance of the SecurityTokenRegistryWrapper class containing methods
     * for interacting with SecurityTokenRegistry smart contract.
     */
    public securityTokenRegistry?: SecurityTokenRegistryWrapper;
    /**
     * An instance of the PolyTokenWrapper class containing methods
     * for interacting with PolyToken smart contract.
     */
    public polyToken?: PolyTokenWrapper;
    /**
     * An instance of the ModuleRegistryWrapper class containing methods
     * for interacting with ModuleRegistry smart contract.
     */
    public moduleRegistry?: ModuleRegistryWrapper;
    /**
     * An instance of the CappedSTOWrapper class containing methods
     * for interacting with ModuleRegistry smart contract.
     */
    public cappedSTO?: CappedSTOWrapper;
    /**
     * An instance of the CappedSTOFactoryWrapper class containing methods
     * for interacting with ModuleRegistry smart contract.
     */
    public cappedSTOFactory?: CappedSTOFactoryWrapper;
    /**
     * An instance of the ModuleFactoryWrapper class containing methods
     * for interacting with ModuleFactory smart contract.
     */
    public moduleFactory?: ModuleFactoryWrapper;
    /**
     * An instance of the USDTieredSTOWrapper class containing methods
     * for interacting with ModuleRegistry smart contract.
     */
    public usdTieredSTO?: USDTieredSTOWrapper;
    /**
     * An instance of the USDTieredSTOFactoryWrapper class containing methods
     * for interacting with ModuleRegistry smart contract.
     */
    public usdTieredSTOFactory?: USDTieredSTOFactoryWrapper;

    private web3Wrapper?: Web3Wrapper;

    /**
     * Get the account currently used by PolymathAPI
     * @return Address string
     */
    public async getAccount(): Promise<string | undefined> {
      if (!_.isUndefined(this.web3Wrapper)) {
        return (await this.web3Wrapper.getAvailableAddressesAsync())[0];
      } else {
        return undefined;
      }
    }

    /**
     * Get the network id currently used by PolymathAPI
     * @return Number
     */
    public async getNetworkId(): Promise<number | undefined> {
      if (!_.isUndefined(this.web3Wrapper)) {
        return await this.web3Wrapper.getNetworkIdAsync();
      } else {
        return undefined;
      }
    }

    private async _getInjectedProviderIfExists(): Promise<Provider | undefined> {
      let injectedProviderIfExists = (window as any).ethereum;
      if (!_.isUndefined(injectedProviderIfExists)) {
        if (!_.isUndefined(injectedProviderIfExists.enable)) {
          try {
            await injectedProviderIfExists.enable();
          } catch (err) {
            return undefined;
          }
        }
      } else {
        const injectedWeb3IfExists = (window as any).web3;
        if (!_.isUndefined(injectedWeb3IfExists) && !_.isUndefined(injectedWeb3IfExists.currentProvider)) {
          injectedProviderIfExists = injectedWeb3IfExists.currentProvider;
        } else {
          return undefined;
        }
      }
      return injectedProviderIfExists;
    }
}
