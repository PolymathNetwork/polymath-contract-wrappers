import { GeneralPermissionManagerEvents_3_0_0, BigNumber } from '@polymathnetwork/abi-wrappers';
import { PolymathAPI } from '../src/PolymathAPI';
import { ModuleName, Perm, TransferType } from '../src';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { issueTokenToInvestors } from './issueTokenToInvestor';

/**
 * This method adds a GeneralPermissionManager module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */
export const generalPermissionManager = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Declare some random investors to work with later on
  const randomInvestors = [
    '0x3444444444444444444444444444444444444444',
    '0x5544444444444444444444444444444444444444',
    '0x6644444444444444444444444444444444444444',
  ];

  // Add the GeneralPermissionManager module
  const options: AddingModuleOpts = {
    archived: false,
    label: 'TM Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.GeneralPermissionManager,
    },
    options,
  );

  // Add all address in the whitelist including myAddress
  const kycInvestorMultiData = {
    investors: randomInvestors.concat(myAddress),
    canSendAfter: [new Date(), new Date(), new Date(), new Date()],
    canReceiveAfter: [new Date(), new Date(), new Date(), new Date()],
    expiryTime: [new Date(2021, 10), new Date(2021, 10), new Date(2021, 10), new Date(2021, 10)],
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: randomInvestors.concat(myAddress),
    values: [new BigNumber(10), new BigNumber(20), new BigNumber(20), new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);

  const generalPM = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.GeneralPermissionManager,
  }))[0];

  // Subscribe to event of add delegate
  await generalPM.subscribeAsync({
    eventName: GeneralPermissionManagerEvents_3_0_0.AddDelegate,
    indexFilterValues: {},
    callback: async (error: any, log: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Add delegate', log);
      }
    },
  });

  // Add a delegate which can have permissions in different modules
  await generalPM.addDelegate({ delegate: myAddress, details: 'details' });

  const generalTMAddress = (await tickerSecurityTokenInstance.getModulesByName({
    moduleName: ModuleName.GeneralTransferManager,
  }))[0];

  // Get all delegates
  const permissionChanged = await generalPM.changePermission({
    valid: true,
    perm: Perm.Admin,
    delegate: myAddress,
    module: generalTMAddress,
  });

  // Check  delegate
  console.log('Permission changed:');
  console.log(permissionChanged);

  console.log(await generalPM.checkDelegate({ delegate: myAddress }));
  console.log('Delegate has flags perm added on general transfer manager:');
  console.log(
    await generalPM.checkPermission({ delegate: myAddress, module: generalTMAddress, permission: Perm.Admin }),
  );

  // Use FLAGS permission to allow all whitelist transfers, this validates that the user can use the
  const generalTM = await polymathAPI.moduleFactory.getModuleInstance({
    name: ModuleName.GeneralTransferManager,
    address: generalTMAddress,
  });

  await generalTM.modifyTransferRequirementsMulti({
    transferTypes: [TransferType.General, TransferType.Issuance, TransferType.Redemption],
    fromValidKYC: [true, false, false],
    toValidKYC: [true, false, false],
    fromRestricted: [true, false, false],
    toRestricted: [true, false, false],
  });

  // Revoking Permission
  const permissionResult = await generalPM.changePermission({
    valid: false,
    perm: Perm.Admin,
    delegate: myAddress,
    module: generalTMAddress,
  });

  console.log('Delegate perm has been revoked. Check permission result:');
  console.log(permissionResult);
  console.log(
    await generalPM.checkPermission({ delegate: myAddress, module: generalTMAddress, permission: Perm.Admin }),
  );

  // Removing Delegate
  const deleteDelegateResult = await generalPM.deleteDelegate({ delegate: myAddress });

  // Check delegate
  console.log('Delegate is removed. Check delegate result:');
  console.log(deleteDelegateResult);
  console.log(await generalPM.checkDelegate({ delegate: myAddress }));

  generalPM.unsubscribeAll();
};
