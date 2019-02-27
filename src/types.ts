import { TxData } from '@0x/web3-wrapper';
import {
    Provider,
    ContractEventArg,
    DecodedLogArgs,
    LogWithDecodedArgs,
    BlockParam,
} from 'ethereum-types';
import {
    PolyTokenEventArgs,
    PolyTokenEvents,
} from '@polymathnetwork/abi-wrappers';

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

export interface DecodedLogEvent<ArgsType extends DecodedLogArgs> {
    isRemoved: boolean;
    log: LogWithDecodedArgs<ArgsType>;
}

export type EventCallback<ArgsType extends DecodedLogArgs> = (
    err: null | Error,
    log?: DecodedLogEvent<ArgsType>,
) => void;

export interface IndexedFilterValues {
    [index: string]: ContractEventArg;
}

export type ContractEventArgs = PolyTokenEventArgs;

export type ContractEvents = PolyTokenEvents;

export interface BlockRange {
    fromBlock: BlockParam;
    toBlock: BlockParam;
}

export interface BlockRange {
    fromBlock: BlockParam;
    toBlock: BlockParam;
}