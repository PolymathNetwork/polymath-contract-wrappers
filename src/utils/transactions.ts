import { Web3Wrapper } from '@0x/web3-wrapper';

/**
 * Returns the default Polymath registry addresses for the given networkId or throws with
 * a context-specific error message if the networkId is not recognized.
 */

/**
 * Returns an estimated gas calculation to perform transactions.
 * @param factor  Number multiplier
 * @returns       Number
 */
export async function estimateGasLimit(web3Wrapper: Web3Wrapper, estimateGas: number, factor: number): Promise<number> {
    const block = await web3Wrapper.getBlockWithTransactionDataAsync('latest');
    const networkGasLimit = block.gasLimit;
    const gas = Math.round(factor * estimateGas);
    return (gas > networkGasLimit) ? networkGasLimit : gas;
}
