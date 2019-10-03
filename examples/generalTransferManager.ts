import { GeneralTransferManagerEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src';
import { ModuleName, TransferType } from '../src';
import { moduleInstancesLookup } from './modules';

/**
 * This method adds a GeneralTransferManager module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const generalTransferManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();

  // The GTM module should be attached by default to an already existing security token.
  // We can do a lookup to get the wrapper instance.
  const generalTM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Modify transfer requirements
  // Subscribe to event of modify transfer requirements
  await generalTM.subscribeAsync({
    eventName: GeneralTransferManagerEvents_3_0_0.ModifyTransferRequirements,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Allow all transfers', log);
      }
    },
  });

  // Add owner address in the whitelist to allow mint tokens
  await generalTM.modifyKYCData({
    investor: myAddress,
    canSendAfter: new Date(),
    canReceiveAfter: new Date(),
    expiryTime: new Date(2020, 0),
  });

  const randomBeneficiary1 = '0x3444444444444444444444444444444444444444';
  const randomBeneficiary2 = '0x5544444444444444444444444444444444444444';

  // Add beneficiaries in the whitelist with distant dates to send and receive
  const delay = 10000000000;

  await generalTM.modifyKYCDataMulti({
    investors: [randomBeneficiary1, randomBeneficiary2],
    canSendAfter: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    canReceiveAfter: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
    expiryTime: [new Date(Date.now().valueOf() + delay), new Date(Date.now().valueOf() + delay)],
  });

  // Mint yourself some tokens
  await tickerSecurityTokenInstance.issue({ investor: myAddress, value: new BigNumber(200), data: '0x00' });

  // No one can receive tokens
  console.log(
    await tickerSecurityTokenInstance.canTransfer({
      to: randomBeneficiary1,
      data: '0x00',
      value: new BigNumber(10),
    }),
  );

  // Allow all transfers between token holders
  await generalTM.modifyTransferRequirementsMulti({
    transferTypes: [TransferType.General, TransferType.Issuance, TransferType.Redemption],
    fromValidKYC: [false, false, false],
    toValidKYC: [false, false, false],
    fromRestricted: [false, false, false],
    toRestricted: [false, false, false],
  });

  // Now we can transfer to all
  console.log(
    await tickerSecurityTokenInstance.canTransfer({
      to: randomBeneficiary1,
      data: '0x00',
      value: new BigNumber(10),
    }),
  );

  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary1, value: new BigNumber(50) });
  await tickerSecurityTokenInstance.transfer({ to: randomBeneficiary2, value: new BigNumber(10) });
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: myAddress }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary1 }));
  console.log(await tickerSecurityTokenInstance.balanceOf({ owner: randomBeneficiary2 }));
  console.log('Funds transferred');

  generalTM.unsubscribeAll();
};
