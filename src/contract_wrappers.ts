import {
  PolymathRegistry,
  SecurityToken,
  SecurityTokenRegistry,
  PolyToken,
} from 'polymath-contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Provider } from 'ethereum-types';
import * as _ from 'lodash';

import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { SecurityTokenWrapper } from './contract_wrappers/security_token_wrapper';
import { SecurityTokenRegistryWrapper } from './contract_wrappers/security_token_registry_wrapper';
import { PolyTokenWrapper } from './contract_wrappers/poly_token_wrapper';
import { ContractWrappersConfigSchema } from './schemas/contract_wrappers_config_schema';
import { ContractWrappersConfig } from './types';
import { assert } from './utils/assert';
import { _getDefaultContractAddresses } from './utils/contract_addresses';

export class ContractWrappers {
    public polymathRegistry: PolymathRegistryWrapper;
    public securityToken: SecurityTokenWrapper;
    public securityTokenRegistry: SecurityTokenRegistryWrapper;
    public polyToken: PolyTokenWrapper;

    private readonly _web3Wrapper: Web3Wrapper;
    constructor(provider: Provider, config: ContractWrappersConfig) {
        assert.isWeb3Provider('provider', provider);
        assert.doesConformToSchema('config', config, ContractWrappersConfigSchema);
        const txDefaults = {
          gasPrice: config.gasPrice,
        };
        this._web3Wrapper = new Web3Wrapper(provider, txDefaults);
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
        this.polyToken = new PolyTokenWrapper(this._web3Wrapper, config.networkId, this.polymathRegistry);
    }
}