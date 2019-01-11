import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
export declare abstract class ContractWrapper {
    abstract abi: ContractAbi;
    protected _networkId: number;
    protected _web3Wrapper: Web3Wrapper;
    constructor(web3Wrapper: Web3Wrapper, networkId: number);
}
//# sourceMappingURL=contract_wrapper.d.ts.map