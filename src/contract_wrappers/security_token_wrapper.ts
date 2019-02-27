import { SecurityTokenContract } from '@polymathnetwork/abi-wrappers';
import { PolymathRegistryWrapper } from './polymath_registry_wrapper';
import { SecurityToken } from '@polymathnetwork/contract-artifacts';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ContractAbi } from 'ethereum-types';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { ContractWrapper } from './contract_wrapper';
import { ITxParams } from '../types';

/**
 * @param type type of the module
 */
export interface IGetModulesByTypeParams {
  type: number;
}

export interface IAddModuleParams extends ITxParams {
  moduleFactory: string;
  data: string;
  maxCost: BigNumber;
  budget: BigNumber;
}

/**
* @param module address of the module
*/
export interface IGetModuleParams {
  module: string;
}

/**
 * @param from sender of transfer
 * @param to receiver of transfer
 * @param value value of transfer
 * @param data data to indicate validation
 */
export interface IVerifyTransferParams {
  from: string;
  to: string;
  value: BigNumber;
  data: string;
}

/**
 * This class includes the functionality related to interacting with the SecurityToken contract.
 */
export class SecurityTokenWrapper extends ContractWrapper {
  public abi: ContractAbi = (SecurityToken as any).abi;
  private polymathRegistry: PolymathRegistryWrapper;
  private securityTokenContract: Promise<SecurityTokenContract>;
  /**
   * Instantiate SecurityTokenWrapper
   * @param web3Wrapper Web3Wrapper instance to use
   * @param polymathRegistry The PolymathRegistryWrapper instance contract
   */
  constructor(web3Wrapper: Web3Wrapper, polymathRegistry: PolymathRegistryWrapper) {
    super(web3Wrapper);
    this.polymathRegistry = polymathRegistry;
    this.securityTokenContract = this._getSecurityTokenContract();
  }

  /**
   * Returns the contract address
   */
  public getAddress = async (): Promise<string> => {
    return (await this.securityTokenContract).address;
  }

  /**
   * Returns a list of modules that match the provided module type
   * @return address[] list of modules with this type
   */
  public getModulesByType = async (params: IGetModulesByTypeParams): Promise<string[]> => {
    return (await this.securityTokenContract).getModulesByType.callAsync(
      params.type,
    );
  }

  /**
   * Attachs a module to the SecurityToken
   */
  public addModule = async (params: IAddModuleParams) => {
    return async () => {
      return (await this.securityTokenContract).addModule.sendTransactionAsync(
        params.moduleFactory,
        params.data,
        params.maxCost,
        params.budget
      );
    }
  }

  /**
   * @return Returns the data associated to a module
   */
  public getModule = async (params: IGetModuleParams): Promise<[string, string, string, boolean, BigNumber[]]> => {
    return (await this.securityTokenContract).getModule.callAsync(params.module);
  }

  /**
   * Symbol of the Token
   */
  public getSymbol = async (): Promise<string> => {
    return await (await this.securityTokenContract).symbol.callAsync();
  }

  /**
   * Validates a transfer with a TransferManager module if it exists
   * @return bool
   */
  public verifyTransfer = async (params: IVerifyTransferParams): Promise<boolean> => {
    return await (await this.securityTokenContract).verifyTransfer.callAsync(
      params.from,
      params.to,
      params.value,
      params.data,
    );
  }

  private async _getSecurityTokenContract(): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(
      this.abi,
      await this.polymathRegistry.getAddress({
        contractName: 'SecurityToken',
      }),
      this._web3Wrapper.getProvider(),
      this._web3Wrapper.getContractDefaults(),
    );
  }
}
