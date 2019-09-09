import { PolymathAPI } from '../../src';

export async function registerTicker(polymathAPI: PolymathAPI, ticker: string, owner: string) {
  // Get the ticker fee and approve the security token registry to spend
  const tickerFee = await polymathAPI.securityTokenRegistry.getTickerRegistrationFee();
  const spender = await polymathAPI.securityTokenRegistry.address();
  const allowance = await polymathAPI.polyToken.allowance({
    owner,
    spender,
  });
  if (allowance.isLessThan(tickerFee)) {
    await polymathAPI.polyToken.approve({
      spender,
      value: tickerFee,
    });
  }
  await polymathAPI.securityTokenRegistry.registerNewTicker({
    owner,
    ticker,
  });
}
