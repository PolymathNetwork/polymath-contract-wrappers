import {PolymathAPI, ModuleName, TransactionParams} from '../src';
import { moduleInstancesLookup } from './modules';
import { GeneralTransferManagerEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';

/**
 * Adds investors to a security token's whitelist. Requires that a valid security token has been generated previously.
 * @param polymathAPI Reference to polymathAPI instance.
 * @param ticker Ticker of the Security Tokens
 * @param modifyKYCDataMultiParams Investors KYC Data Params
 */
export const addInvestorsToWhitelist = async (
  polymathAPI: PolymathAPI,
  ticker: string,
  modifyKYCDataMultiParams: TransactionParams.GeneralTransferManager.ModifyKYCDataMulti,
) => {
  // Get general TM module instance
  const generalTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  // Subscribe to event
  await generalTM.subscribeAsync({
    eventName: GeneralTransferManagerEvents_3_0_0.ModifyKYCData,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Whitelist modified successfully', log);
      }
    },
  });

  // Publish kyc data to whitelist in general transfer manager
  await generalTM.modifyKYCDataMulti(modifyKYCDataMultiParams);

  console.log('KYC data:', await generalTM.getAllKYCData());
};
