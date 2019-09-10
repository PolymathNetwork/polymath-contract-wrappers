import { ModuleName, PolymathAPI } from '../src';

/**
 * Looks up the instance of a module based on its moduleName. Requires the module to already be added to the security token.
 * @param polymathAPI Instance of the polymathAPI.
 * @param moduleName The enum ModuleName identifier
 * @param ticker The ticker symbol of the security token.
 */
export const moduleInstanceLookup = async (
  polymathAPI: PolymathAPI,
  moduleName: ModuleName,
  ticker: string,
): Promise<any> => {
  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(
    ticker ? ticker : '',
  );
  // Get General TM Address
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: moduleName,
  }))[0];

  // Return the module instance as an object
  return polymathAPI.moduleFactory.getModuleInstance({
    name: moduleName,
    address: generalTMAddress,
  });
};
