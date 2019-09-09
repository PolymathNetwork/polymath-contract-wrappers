import { PolymathAPI } from '../../src';

export async function launchToken(
  polymathAPI: PolymathAPI,
  name: string,
  ticker: string,
  tokenDetails: string,
  treasuryWallet: string,
  divisible: boolean,
  protocolVersion?: string,
) {
  // Get the st launch fee and approve the security token registry to spend
  const securityTokenLaunchFee = await polymathAPI.securityTokenRegistry.getSecurityTokenLaunchFee();
  const spender = await polymathAPI.securityTokenRegistry.address();
  const allowance = await polymathAPI.polyToken.allowance({
    owner: await polymathAPI.getAccount(),
    spender,
  });
  if (allowance.isLessThan(securityTokenLaunchFee)) {
    await polymathAPI.polyToken.approve({
      spender,
      value: securityTokenLaunchFee,
    });
  }
  protocolVersion = protocolVersion ? protocolVersion : '0';
  await polymathAPI.securityTokenRegistry.generateNewSecurityToken({
    name,
    ticker,
    tokenDetails,
    treasuryWallet,
    protocolVersion,
    divisible,
  });
}
