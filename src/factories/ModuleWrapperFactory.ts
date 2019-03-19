import { Web3Wrapper } from "@0x/web3-wrapper";
import { CappedSTOWrapper } from "../contract_wrappers/modules/sto/capped_sto_wrapper";
import { USDTieredSTOWrapper } from "../contract_wrappers/modules/sto/usd_tiered_sto_wrapper";
import { GeneralTransferManagerWrapper } from "../contract_wrappers/modules/transfer_manager/general_transfer_manager_wrapper";

interface IGetModuleParams {
  address: string, 
  name: string
}

interface IGetGeneralTransferManager extends IGetModuleParams {
  address: string, 
  name: 'GeneralTransferManager'
}

interface IGetCappedSTO extends IGetModuleParams {
  address: string, 
  name: 'CappedSTO'
}

interface IGetUSDTieredSTO extends IGetModuleParams {
  address: string, 
  name: 'USDTieredSTO'
}

interface IGetModuleInstance {
  (params: IGetGeneralTransferManager): Promise<GeneralTransferManagerWrapper>;
  (params: IGetCappedSTO): Promise<CappedSTOWrapper>;
  (params: IGetUSDTieredSTO): Promise<USDTieredSTOWrapper>;
}

/**
 * The ModuleWrapperFactory class is a factory to get instances from modules attached to a SecurityToken.
 */
export class ModuleWrapperFactory {

  private readonly _web3Wrapper: Web3Wrapper;

  constructor(web3Wrapper: Web3Wrapper) {
    this._web3Wrapper = web3Wrapper;
  }

  public getModuleInstance: IGetModuleInstance = async (params: IGetModuleParams): Promise<any> => {
    switch (params.name) {
      // Permission
      // TMs
      case 'GeneralTransferManager':
        return new GeneralTransferManagerWrapper(this._web3Wrapper, params.address);
      // STOs
      case 'CappedSTO':
        return new CappedSTOWrapper(this._web3Wrapper, params.address);
      case 'USDTieredSTO':
        return new USDTieredSTOWrapper(this._web3Wrapper, params.address);
      // Checkpoint
      // Burn
    }
  }
}