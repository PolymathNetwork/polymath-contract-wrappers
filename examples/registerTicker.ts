import { PolymathAPI } from '../src';

/**
 * Registers a ticker for a future token. Requires no previous setup.
 * @param polymathAPI Instance of the polymathAPI.
 * @param ticker Token symbol you wish to reserve.
 * @param owner Address of the owner for the registered ticker.
 */
export const registerTicker = async (polymathAPI: PolymathAPI, ticker: string, owner: string) => {
  // Get the ticker fee and approve the security token registry to spend
  const tickerFee = await polymathAPI.securityTokenRegistry.getTickerRegistrationFee();
  // Get the security token registry address
  const spender = await polymathAPI.securityTokenRegistry.address();
  // Get the allowance for the polytoken owner
  const allowance = await polymathAPI.polyToken.allowance({
    owner,
    spender,
  });
  if (allowance.isLessThan(tickerFee)) {
    // Approve spending of poly tokens
    await polymathAPI.polyToken.approve({
      spender,
      value: tickerFee,
    });
  }
  await polymathAPI.securityTokenRegistry.registerNewTicker({
    owner,
    ticker,
  });
  console.log('Ticker registered successfully!');
};
