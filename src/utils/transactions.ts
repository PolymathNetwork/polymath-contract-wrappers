import { Web3Wrapper } from '@0x/web3-wrapper';

export async function estimateGasLimit(web3Wrapper: Web3Wrapper, estimateGas: number, factor: number): Promise<number> {
    const block = await web3Wrapper.getBlockWithTransactionDataAsync('latest');
    const networkGasLimit = block.gasLimit;
    const gas = Math.round(factor * estimateGas);
    return (gas > networkGasLimit) ? networkGasLimit : gas;
}