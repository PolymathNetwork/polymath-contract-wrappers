import {
  PolymathRegistry,
} from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Provider } from 'ethereum-types';
import * as _ from 'lodash';

import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { ContractWrappersConfigSchema } from './schemas/contract_wrappers_config_schema';
import { ContractWrappersConfig } from './types';
import { assert } from './utils/assert';
import { _getDefaultContractAddresses } from './utils/contract_addresses';

/**
 * The ContractWrappers class contains smart contract wrappers helpful when building on Polymath ecosystem.
 */
export class ContractWrappers {
    public polymathRegistry: PolymathRegistryWrapper;

    private readonly _web3Wrapper: Web3Wrapper;
    /**
     * Instantiates a new ContractWrappers instance.
     * @param   provider    The Provider instance you would like the contract-wrappers library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the ContractWrappers class.
     */
    constructor(provider: Provider, config: ContractWrappersConfig) {
        assert.isWeb3Provider('provider', provider);
        assert.doesConformToSchema('config', config, ContractWrappersConfigSchema);
        const txDefaults = {
          gasPrice: config.gasPrice,
        };
        this._web3Wrapper = new Web3Wrapper(provider, txDefaults);
        const artifactsArray = [
          PolymathRegistry,
        ];
        _.forEach(artifactsArray, artifact => {
          this._web3Wrapper.abiDecoder.addABI(artifact.abi);
        });
        const contractAddresses = _.isUndefined(config.contractAddresses)
            ? _getDefaultContractAddresses(config.networkId)
            : config.contractAddresses;
        this.polymathRegistry = new PolymathRegistryWrapper(this._web3Wrapper, config.networkId, contractAddresses.polymathRegistry);
    }

    /**
     * Get the provider instance currently used by contract-wrappers
     * @return  Web3 provider instance
     */
    public getProvider(): Provider {
        return this._web3Wrapper.getProvider();
    }
}