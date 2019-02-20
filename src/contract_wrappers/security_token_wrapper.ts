import { SecurityTokenContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi, TxData } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import { estimateGasLimit } from '../utils/transactions';
import * as _ from 'lodash';
import { IModulesByType, IAddModule, IModule, IVerifyTransfer } from '../types';
import { ContractWrapper } from './contract_wrapper';

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private securityTokenContract: Promise<SecurityTokenContract>;
  private factor = 1.2;
  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param networkId Desired networkId
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, networkId: number, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper, networkId);
    this.polymathRegistry = polymathRegistry;
    this.securityTokenContract = this._getSecurityTokenContract();
  }

  /**
   * Returns the contract address
   */
  public async getAddress(): Promise<string> {
    return (await this.securityTokenContract).address;
  }

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public async getModulesByType(params: IModulesByType): Promise<string[]> {
    return (await this.securityTokenContract).getModulesByType.callAsync(
      params.type,
    );
  }

  /**
   * Attachs a module to the SecurityToken
   */
  public async addModule(params: IAddModule) {
    const owner = await this._getOwnerAddress();
    const estimateGas = await (await this.securityTokenContract).addModule.estimateGasAsync(
      params.moduleFactory,
      params.data,
      params.maxCost,
      params.budget,
      { from: owner },
    );
    const txData: TxData = {
      from: owner,
      gas: await estimateGasLimit(
        this.web3Wrapper,
        estimateGas,
        this.factor,
      ),
    };
    return async () => {
      return (await this.securityTokenContract).addModule.sendTransactionAsync(
        params.moduleFactory,
        params.data,
        params.maxCost,
        params.budget,
        txData,
      );
    };
  }

  /**
   * @return Returns the data associated to a module
   */
  public async getModule(params: IModule): Promise<[string, string, string, boolean, BigNumber[]]> {
    return (await this.securityTokenContract).getModule.callAsync(params.module);
  }

  /**
   * Symbol of the Token
   */
  public async getSymbol(): Promise<string> {
    return await (await this.securityTokenContract).symbol.callAsync();
  }

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public async verifyTransfer(params: IVerifyTransfer): Promise<boolean> {
    return await (await this.securityTokenContract).verifyTransfer.callAsync(
      params.from,
      params.to,
      params.value,
      params.data,
    );
  }

  private async _getOwnerAddress(): Promise<string> {
    const addresses = await this.web3Wrapper.getAvailableAddressesAsync();
    return addresses[0];
  }

  private async _getSecurityTokenContract(): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'SecurityToken',
      }),
      this.web3Wrapper.getProvider(),
      this.web3Wrapper.getContractDefaults(),
    );
  }
}
