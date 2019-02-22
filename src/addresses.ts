import * as _ from 'lodash';
import { NetworkId } from './types';

const networkToAddresses: { [networkId: number]: string } = {
  1: '0xdfabf3e4793cd30affb47ab6fa4cf4eef26bbc27',
  42: '0x5b215a7d39ee305ad28da29bf2f0425c6c2a00b3',
  15: '0x8b21e65058a5e52b423080044634ffac53c1e5ce'
};

function _getContractAddressesForNetworkOrThrow(networkId: NetworkId): string {
  if (_.isUndefined(networkToAddresses[networkId])) {
    throw new Error(
      `Unknown network id (${networkId}).
      No known Polymath contracts have been deployed on this network.`,
    );
  }
  return networkToAddresses[networkId];
}

/**
 * Returns the default Polymath Registry addresses for the given networkId or throws with
 * a context-specific error message if the networkId is not recognized.
 */
export function _getDefaultContractAddresses(networkId: NetworkId): string {
  if (!(networkId in NetworkId)) {
    throw new Error(
      `No default contract addresses found for the given network id (${networkId}).
      If you want to use ContractWrappers on this network,
      you must manually pass in the contract address(es) to the constructor.`,
    );
  }
  return _getContractAddressesForNetworkOrThrow(networkId);
}
