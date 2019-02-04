import { PublicNodeUrlsByNetworkId } from '../types';

const INFURA_API_KEY = 'T5WSC8cautR4KXyYgsRs';

export const configs = {
    PUBLIC_NODE_URLS_BY_NETWORK_ID: {
        [1]: [`https://mainnet.infura.io/${INFURA_API_KEY}`],
        [42]: [`https://kovan.infura.io/${INFURA_API_KEY}`],
        [15]: [`http://127.0.0.1:8545`],
    } as PublicNodeUrlsByNetworkId,
};
