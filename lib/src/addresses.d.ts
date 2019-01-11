export interface ContractAddresses {
    polymathRegistry: string;
}
export declare enum NetworkId {
    Mainnet = 1,
    Kovan = 42,
    Ganache = 50
}
/**
 * Used to get addresses of contracts that have been deployed to either the
 * Ethereum mainnet or a supported testnet. Throws if there are no known
 * contracts deployed on the corresponding network.
 * @param networkId The desired networkId.
 * @returns The set of addresses for contracts which have been deployed on the
 * given networkId.
 */
export declare function getContractAddressesForNetworkOrThrow(networkId: NetworkId): ContractAddresses;
//# sourceMappingURL=addresses.d.ts.map