import { PolymathAPI, TransactionParams, ModuleName } from '../src';
import { moduleInstanceLookup } from './moduleInstanceLookup';

/**
 * Adds investors to a security token's whitelist. Requires that a valid security token has been generated previously.
 * @param polymathAPI Reference to polymathAPI instance.
 * @param ticker Ticker of the Security Token
 * @param modifyKYCDataMultiParams Investors KYC Data Params
 */
export const addInvestorsToWhitelist = async (
  polymathAPI: PolymathAPI,
  ticker: string,
  modifyKYCDataMultiParams: TransactionParams.GeneralTransferManager.ModifyKYCDataMulti,
) => {
  // Get general TM module instance
  const generalTM = await moduleInstanceLookup(polymathAPI, ModuleName.GeneralTransferManager, ticker ? ticker : '');

  // Publish kyc data to whitelist in general transfer manager
  await generalTM.modifyKYCDataMulti(modifyKYCDataMultiParams);

  console.log('KYC data after added an address', await generalTM.getAllKYCData());

  generalTM.unsubscribeAll();
};
