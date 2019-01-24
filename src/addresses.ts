import * as _ from 'lodash';

export interface IContractAddresses {
  polymathRegistry: string;
}

export enum NetworkId {
  Mainnet = 1,
  Kovan = 42,
  Ganache = 15,
}

const networkToAddresses: { [networkId: number]: IContractAddresses } = {
  1: {
    polymathRegistry: '0xdfabf3e4793cd30affb47ab6fa4cf4eef26bbc27',
  },
  42: {
    polymathRegistry: '0x5b215a7d39ee305ad28da29bf2f0425c6c2a00b3',
  },
  15: {
    polymathRegistry: '0x0f3da9b8682a6054300b8c78a0eca5e79d506380',
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
export function getContractAddressesForNetworkOrThrow(networkId: NetworkId): IContractAddresses {
  if (_.isUndefined(networkToAddresses[networkId])) {
    throw new Error(`Unknown network id (${networkId}). No known 0x contracts have been deployed on this network.`);
  }
  return networkToAddresses[networkId];
}
