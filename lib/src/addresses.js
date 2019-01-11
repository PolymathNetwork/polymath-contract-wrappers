"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var NetworkId;
(function (NetworkId) {
    NetworkId[NetworkId["Mainnet"] = 1] = "Mainnet";
    NetworkId[NetworkId["Kovan"] = 42] = "Kovan";
    NetworkId[NetworkId["Ganache"] = 50] = "Ganache";
})(NetworkId = exports.NetworkId || (exports.NetworkId = {}));
var networkToAddresses = {
    1: {
        polymathRegistry: '0xdfabf3e4793cd30affb47ab6fa4cf4eef26bbc27',
    },
    42: {
        polymathRegistry: '0x5b215a7d39ee305ad28da29bf2f0425c6c2a00b3',
    },
    50: {
        polymathRegistry: '0x0000000000000000000000000000000000000000',
    },
};
/**
 * Used to get addresses of contracts that have been deployed to either the
 * Ethereum mainnet or a supported testnet. Throws if there are no known
 * contracts deployed on the corresponding network.
 * @param networkId The desired networkId.
 * @returns The set of addresses for contracts which have been deployed on the
 * given networkId.
 */
function getContractAddressesForNetworkOrThrow(networkId) {
    if (_.isUndefined(networkToAddresses[networkId])) {
        throw new Error("Unknown network id (" + networkId + "). No known 0x contracts have been deployed on this network.");
    }
    return networkToAddresses[networkId];
}
exports.getContractAddressesForNetworkOrThrow = getContractAddressesForNetworkOrThrow;
//# sourceMappingURL=addresses.js.map