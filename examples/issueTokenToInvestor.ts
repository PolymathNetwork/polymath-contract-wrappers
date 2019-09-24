import { PolymathAPI, ModuleName, TransactionParams } from '../src';
import { moduleInstancesLookup } from './modules';
import { SecurityTokenEvents_3_0_0 } from '@polymathnetwork/abi-wrappers/lib/src';

/**
 * Mints the token to a specific investor. Requires a valid security token and no transfer restrictions impeding the issuance.
 * @param polymathAPI Reference to polymathAPI instance.
 * @param ticker Ticker of the Security Token
 * @param issueMultiParams Transaction params for issuing to multiple investors.
 */
export const issueTokenToInvestors = async (
  polymathAPI: PolymathAPI,
  ticker: string,
  issueMultiParams: TransactionParams.SecurityToken.IssueMulti,
) => {
  const tokenAddress = await polymathAPI.securityTokenRegistry.getSecurityTokenAddress({ ticker: ticker! });
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromAddress(tokenAddress);

  // Subscribe to event
  await tickerSecurityTokenInstance.subscribeAsync({
    eventName: SecurityTokenEvents_3_0_0.Issued,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Tokens issued successfully', log);
      }
    },
  });

  // Get general TM module instance
  const generalTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];
  const listInvestors = await generalTM.getAllKYCData();
  const found = listInvestors.find(function(addr: { investor: any }) {
    return issueMultiParams.investors.includes(addr.investor);
  });
  // If the investors are in the whitelist, go ahead and issue multi with the params passed in.
  if (found) {
    await tickerSecurityTokenInstance.issueMulti(issueMultiParams);
    console.log('Tokens issued');
  } else {
    console.log('Please make sure beneficiary address has been whitelisted');
  }
};
