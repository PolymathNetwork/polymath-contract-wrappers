import { Provider, TxData } from "ethereum-types";

import { ERC20DividendCheckpointContract,
    ModuleContract,
    ModuleFactoryContract,
    EtherDividendCheckpointContract,
    DetailedERC20Contract,
    SecurityTokenContract,
    PolyTokenContract,
    PolyTokenFaucetContract} from "@polymathnetwork/abi-wrappers";

import { ERC20DividendCheckpoint,
    Module,
    ModuleFactory,
    EtherDividendCheckpoint,
    DetailedERC20,
    SecurityToken,
    PolyToken,
    PolyTokenFaucet} from "@polymathnetwork/contract-artifacts";
import {PolymathRegistryWrapper} from '../contract_wrappers/registries/polymath_registry_wrapper';

export class ContractFactory {
  private _provider: Provider;
  private _polymathRegistry: PolymathRegistryWrapper;
  private _contractDefaults: Partial<TxData>;

  constructor(provider: Provider, contractDefaults: Partial<TxData>, polymathRegistry: PolymathRegistryWrapper) {
    this._provider = provider;
    this._polymathRegistry = polymathRegistry;
    this._contractDefaults = contractDefaults;
  }

  public async getModuleContract(address: string): Promise<ModuleContract> {
    return new ModuleContract(
      Module.abi,
      address,
      this._provider,
      this._contractDefaults,
    );
  }

  public async getERC20DividendCheckpointContract(address: string): Promise<ERC20DividendCheckpointContract> {
    return new ERC20DividendCheckpointContract(
      ERC20DividendCheckpoint.abi,
      address,
      this._provider,
      this._contractDefaults,
    );
  }

  public async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(
        ModuleFactory.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    return new EtherDividendCheckpointContract(
        EtherDividendCheckpoint.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getDetailedERC20Contract(address: string): Promise<DetailedERC20Contract> {
    return new DetailedERC20Contract(
        DetailedERC20.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getSecurityTokenContract(address: string): Promise<SecurityTokenContract> {
    return new SecurityTokenContract(
        (SecurityToken as any).abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getPolyTokenFaucetContract(): Promise<PolyTokenFaucetContract> {
    return new PolyTokenFaucetContract(
        PolyTokenFaucet.abi,
        await this._polymathRegistry.getPolyTokenAddress(),
        this._provider,
        this._contractDefaults,
    );
  }

  public async _getPolyTokenContract(): Promise<PolyTokenContract> {
    return new PolyTokenContract(
        PolyToken.abi,
        await this._polymathRegistry.getPolyTokenAddress(),
        this._provider,
        this._contractDefaults,
    );
  }
}
