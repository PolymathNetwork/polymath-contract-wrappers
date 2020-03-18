import { PolymathAPI, TransactionParams, BigNumber } from '../src';

/**
 * Mints the token to a specific investor adding it to whitelist dynamically.
 * It requires to be called by token owner and a valid security token and no other transfer restrictions impeding the issuance.
 * @param polymathAPI Reference to polymathAPI instance.
 * @param ticker Ticker of the Security Token
 * @param issueMultiParams Transaction params for issuing to multiple investors.
 */
export const issueTokenToNonWhitelistedInvestor = async (
  polymathAPI: PolymathAPI,
  ticker: string,
  signTransferData: TransactionParams.SecurityToken.SignTransferData,
  amount: BigNumber,
) => {
  // Create a Security Token Instance
  const securityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // SignTransferData example
  //   {
  //     investorsData: [
  //       {
  //         investorAddress: '0xbfd02b95a0ba36807902d1c31b66edae90ec2151',
  //         canReceiveAfter: new Date(2019, 11, 1),
  //         canSendAfter: new Date(2019, 11, 1),
  //         expiryTime: new Date(2020, 12, 1),
  //       },
  //     ],
  //     validFrom: new Date(2019, 11, 1),
  //     validTo: new Date(2020, 12, 1),
  //   }
  const signature = await securityTokenInstance.signTransferData(signTransferData);
  const issue = await securityTokenInstance.issue({
    data: signature,
    investor: signTransferData.investorsData[0].investorAddress,
    value: amount,
  });
  await issue.receiptAsync;
  console.log('Tokens issued');
};
