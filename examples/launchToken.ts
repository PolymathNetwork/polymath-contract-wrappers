import { PolymathAPI } from '../src';
import { PolyTokenEvents_3_0_0, ISecurityTokenRegistryEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';

/**
 * Generates a new security token. Requires that a ticker has been registered previously.
 * @param polymathAPI Instance of the polymathAPI.
 * @param name The name of the token.
 * @param ticker The ticker symbol of the security token.
 * @param tokenDetails The off-chain details of the token.
 * @param divisible Whether or not the token is divisible.
 * @param treasuryWallet Ethereum address which will holds the STs.
 * @param protocolVersion Version of securityToken contract.
 */
export const launchToken = async (
  polymathAPI: PolymathAPI,
  name: string,
  ticker: string,
  tokenDetails: string,
  treasuryWallet: string,
  divisible: boolean,
  protocolVersion?: string,
) => {
  // Subscribe to events
  await polymathAPI.polyToken.subscribeAsync({
    eventName: PolyTokenEvents_3_0_0.Approval,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Tokens approved');
      }
    },
  });
  await polymathAPI.securityTokenRegistry.subscribeAsync({
    eventName: ISecurityTokenRegistryEvents_3_0_0.NewSecurityToken,
    indexFilterValues: {},
    callback: async (error, log) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New security token!', log);
      }
    },
  });

  // Get the st launch fee and approve the security token registry to spend
  const securityTokenLaunchFee = await polymathAPI.securityTokenRegistry.getSecurityTokenLaunchFee();
  // Get the st registry address
  const spender = await polymathAPI.securityTokenRegistry.address();
  // Finding the polytoken allowance for current user
  const allowance = await polymathAPI.polyToken.allowance({
    owner: await polymathAPI.getAccount(),
    spender,
  });
  if (allowance.isLessThan(securityTokenLaunchFee)) {
    // Approve poly token expenditure
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
  console.log('Token launched successfully!');
};
