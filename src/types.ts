import { IContractAddresses } from './addresses';
import { BigNumber } from '@0x/utils';

/**
 * networkId: The id of the underlying ethereum network your provider is connected to.
 * gasPrice: Gas price to use with every transaction
 * contractAddresses: The address of all contracts to use. Defaults to the known addresses based on networkId.
 */
export interface IContractWrappersConfig {
    networkId: number;
    gasPrice?: BigNumber;
    contractAddresses?: IContractAddresses;
}
