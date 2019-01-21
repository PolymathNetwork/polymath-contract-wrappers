import {
  PolymathRegistry,
  SecurityToken,
  SecurityTokenRegistry,
  PolyToken,
} from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';

import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { SecurityTokenWrapper } from './contract_wrappers/security_token_wrapper';
import { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
import { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
import { ContractWrappersConfigSchema } from './schemas/contract_wrappers_config_schema';
import { ContractWrappersConfig } from './types';
import { assert } from './utils/assert';
import { _getDefaultContractAddresses } from './utils/contract_addresses';
import { SignerSubprovider, RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';

declare global {
  interface Window { web3: any; ethereum: any; }
}

export class ContractWrappers {
    public polymathRegistry: PolymathRegistryWrapper;
    public securityToken: SecurityTokenWrapper;
    public securityTokenRegistry: SecurityTokenRegistryWrapper;
    public polyToken: PolyTokenWrapper;
    private readonly _web3Wrapper: Web3Wrapper;

    constructor(config: ContractWrappersConfig, provider: string = "http://127.0.0.1:8545") {
      assert.doesConformToSchema('config', config, ContractWrappersConfigSchema);
      const txDefaults = {
        gasPrice: config.gasPrice,
      };

      const providerEngine = new Web3ProviderEngine();

      if (window.web3) {
        providerEngine.addProvider(new SignerSubprovider(window.web3.currentProvider))
      } else if (window.ethereum) {
        providerEngine.addProvider(new SignerSubprovider(window.ethereum))
      }
      providerEngine.addProvider(new RPCSubprovider(provider));
      providerEngine.start();

      this._web3Wrapper = new Web3Wrapper(providerEngine, txDefaults);
      const artifactsArray = [
        PolymathRegistry,
        SecurityToken,
        SecurityTokenRegistry,
        PolyToken
      ];
      _.forEach(artifactsArray, artifact => {
        this._web3Wrapper.abiDecoder.addABI(artifact.abi);
      });
      const contractAddresses = _.isUndefined(config.contractAddresses)
          ? _getDefaultContractAddresses(config.networkId)
          : config.contractAddresses;
      this.polymathRegistry = new PolymathRegistryWrapper(this._web3Wrapper, config.networkId, contractAddresses.polymathRegistry);
      this.securityToken = new SecurityTokenWrapper(this._web3Wrapper, config.networkId, this.polymathRegistry);
      this.securityTokenRegistry = new SecurityTokenRegistryWrapper(this._web3Wrapper, config.networkId, this.polymathRegistry);
      this.polyToken = new PolyTokenWrapper(this._web3Wrapper, config.networkId, this.polymathRegistry, this.securityTokenRegistry);
    }

    public async getAccount(): Promise<string[]> {
      return await this._web3Wrapper.getAvailableAddressesAsync();
    }

    public async getNetworkId(): Promise<number> {
      return await this._web3Wrapper.getNetworkIdAsync();
    }
}