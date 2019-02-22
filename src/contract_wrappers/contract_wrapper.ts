import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';

export abstract class ContractWrapper {
    public abstract abi: ContractAbi;
    protected web3Wrapper: Web3Wrapper;
    constructor(web3Wrapper: Web3Wrapper) {
        this.web3Wrapper = web3Wrapper;
    }
}
