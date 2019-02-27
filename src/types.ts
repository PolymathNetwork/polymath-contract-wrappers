import { TxData } from '@0x/web3-wrapper';

/**
 * @param txData Data to override default values on tx, i.e. 'from', 'gasPrice'
 * @param safetyFactor Factor to use for gas limit estimation
 */
export interface ITxParams {
    txData?: Partial<TxData>;
    safetyFactor?: number;
}

export enum NetworkId {
    Mainnet = 1,
    Kovan = 42,
    Local = 15,
  }