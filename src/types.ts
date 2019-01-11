import { ContractAddresses } from './addresses';
import { BigNumber } from '@0x/utils';

/**
 * networkId: The id of the underlying ethereum network your provider is connected to. (1-mainnet, 3-ropsten, 4-rinkeby, 42-kovan, 50-testrpc)
 * gasPrice: Gas price to use with every transaction
 * contractAddresses: The address of all contracts to use. Defaults to the known addresses based on networkId.
 */
export interface ContractWrappersConfig {
    networkId: number;
    gasPrice?: BigNumber;
    contractAddresses?: ContractAddresses;
}