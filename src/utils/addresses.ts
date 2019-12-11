import _ from 'lodash';
import { NetworkId, ErrorCode } from '../types';
import { PolymathError } from '../PolymathError';

const networkToAddresses: { [networkId: number]: string } = {
  1: '0xdfabf3e4793cd30affb47ab6fa4cf4eef26bbc27',
  5: '0x7e3c8af98538ba19a10dfc7e8f5469a76998b0f0',
  42: '0x5b215a7d39ee305ad28da29bf2f0425c6c2a00b3',
  15: '0x8b21e65058a5e52b423080044634ffac53c1e5ce',
};

function getContractAddressesForNetworkOrThrow(networkId: NetworkId): string {
  if (_.isUndefined(networkToAddresses[networkId])) {
    throw new PolymathError({
      message: `Unknown network id (${networkId}). No known Polymath contracts have been deployed on this network.`,
      code: ErrorCode.UnknownNetwork,
    });
  }
  return networkToAddresses[networkId];
}

/**
 * Returns the default Polymath Registry addresses for the given networkId or throws with
 * a context-specific error message if the networkId is not recognized.
 */
export default function getDefaultContractAddresses(networkId: NetworkId): string {
  if (!(networkId in NetworkId)) {
    throw new PolymathError({
      message: `No default contract addresses found for the given network id (${networkId}).
    If you want to use ContractWrappers on this network,
    you must manually pass in the contract address(es) to the constructor.`,
      code: ErrorCode.NotFound,
    });
  }
  return getContractAddressesForNetworkOrThrow(networkId);
}
