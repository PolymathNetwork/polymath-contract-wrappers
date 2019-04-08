import { Provider, TxData } from "ethereum-types";

import { ERC20DividendCheckpointContract,
  ModuleContract,
  ModuleFactoryContract,
  EtherDividendCheckpointContract,
  DetailedERC20Contract} from "@polymathnetwork/abi-wrappers";

import { ERC20DividendCheckpoint,
  Module,
  ModuleFactory,
  EtherDividendCheckpoint,
  DetailedERC20} from "@polymathnetwork/contract-artifacts";

export class ContractFactory {
  private _provider: Provider;
  private _contractDefaults: Partial<TxData>;

  constructor(provider: Provider, contractDefaults: Partial<TxData>) {
    this._provider = provider;
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

  private async getModuleFactoryContract(address: string): Promise<ModuleFactoryContract> {
    return new ModuleFactoryContract(
        ModuleFactory.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  private async _getEtherDividendCheckpointContract(address: string): Promise<EtherDividendCheckpointContract> {
    return new EtherDividendCheckpointContract(
        EtherDividendCheckpoint.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }

  private async _getDetailedERC20Contract(address: string): Promise<DetailedERC20Contract> {
    return new DetailedERC20Contract(
        DetailedERC20.abi,
        address,
        this._provider,
        this._contractDefaults,
    );
  }
}
