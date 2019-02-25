import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import * as _ from 'lodash';

export abstract class ContractWrapper {
    public abstract abi: ContractAbi;
    protected _web3Wrapper: Web3Wrapper;
    constructor(web3Wrapper: Web3Wrapper) {
        this._web3Wrapper = web3Wrapper;
    }

    protected _getDefaultFromAddress = async(): Promise<string> => {
        const addresses = await this._web3Wrapper.getAvailableAddressesAsync();
        return addresses[0];
    }
}
