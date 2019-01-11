import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { ContractWrapper } from './contract_wrapper';
/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
export declare class PolymathRegistryWrapper extends ContractWrapper {
    abi: ContractAbi;
    address: string;
    private _polymathRegistryContractIfExists?;
    /**
     * Instantiate PolymathRegistryWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param networkId Desired networkId
     * @param address The address of the PolymathRegistry contract. If undefined, will
     * default to the known address corresponding to the networkId.
     */
    constructor(web3Wrapper: Web3Wrapper, networkId: number, address?: string);
    getAddress(contractName: string): Promise<string>;
    private _getPolymathRegistryContract;
}
//# sourceMappingURL=polymath_registry_wrapper.d.ts.map