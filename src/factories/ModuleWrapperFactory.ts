import { Web3Wrapper } from "@0x/web3-wrapper";
import { CappedSTOWrapper } from "contract_wrappers/capped_sto_wrapper";
import { USDTieredSTOWrapper } from "contract_wrappers/usd_tiered_sto_wrapper";

interface IGetModuleParams {
  address: string, 
  type: 1 | 2 | 3 | 4 | 5, 
  name: string
}

interface IGetCappedSTO extends IGetModuleParams {
  address: string, 
  type: 3, 
  name: 'CappedSTO'
}

interface IGetUSDTieredSTO extends IGetModuleParams {
  address: string, 
  type: 3, 
  name: 'USDTieredSTO'
}

interface IGetModuleInstance {
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
    switch (params.type) {
      case 1:
        //Permission modules
        break;
      case 2:
        //Transfer modules
        break;
      case 3:
        switch (params.name) {
          case 'CappedSTO':
            return new CappedSTOWrapper(this._web3Wrapper, params.address);
          case 'USDTieredSTO':
            return new USDTieredSTOWrapper(this._web3Wrapper, params.address);
        }
      case 4:
        //Checkpoint modules
        break;
      case 5:
        //Burn modules
        break;
    }
    
  }
}