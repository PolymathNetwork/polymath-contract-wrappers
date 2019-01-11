import { Provider } from 'ethereum-types';
import { PolymathRegistryWrapper } from './contract_wrappers/polymath_registry_wrapper';
import { ContractWrappersConfig } from './types';
/**
 * The ContractWrappers class contains smart contract wrappers helpful when building on Polymath ecosystem.
 */
export declare class ContractWrappers {
    polymathRegistry: PolymathRegistryWrapper;
    private readonly _web3Wrapper;
    /**
     * Instantiates a new ContractWrappers instance.
     * @param   provider    The Provider instance you would like the contract-wrappers library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the ContractWrappers class.
     */
    constructor(provider: Provider, config: ContractWrappersConfig);
    /**
     * Get the provider instance currently used by contract-wrappers
     * @return  Web3 provider instance
     */
    getProvider(): Provider;
}
//# sourceMappingURL=contract_wrappers.d.ts.map