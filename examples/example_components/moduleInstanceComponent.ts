import { ModuleName, PolymathAPI } from '../../src';

export async function moduleInstance(polymathAPI: PolymathAPI, moduleName: ModuleName, ticker?: string): Promise<any> {
  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(
    ticker ? ticker : '',
  );
  // Get General TM Address
  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: moduleName,
  }))[0];
  // Get general TM module instance
  return polymathAPI.moduleFactory.getModuleInstance({
    name: moduleName,
    address: generalTMAddress,
  });
}
