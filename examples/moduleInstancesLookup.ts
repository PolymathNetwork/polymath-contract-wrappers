import {
  BlacklistTransferManager,
  CappedSTO,
  CountTransferManager,
  ERC20DividendCheckpoint,
  ErrorCode,
  EtherDividendCheckpoint,
  GeneralPermissionManager,
  GeneralTransferManager,
  LockUpTransferManager,
  ManualApprovalTransferManager,
  ModuleName,
  PercentageTransferManager,
  PolymathAPI,
  RestrictedPartialSaleTransferManager,
  USDTieredSTO,
  VestingEscrowWallet,
  VolumeRestrictionTransferManager,
} from '../src';
import P from 'bluebird';
import { PolymathError } from '../src/PolymathError';

interface GetAttachedModulesParams {
  ticker: string;
  moduleName: ModuleName;
}

interface GetAttachedModulesOpts {
  unarchived: boolean;
}

interface GetAttachedGeneralPermissionManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.GeneralPermissionManager;
}

interface GetAttachedCountTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.CountTransferManager;
}

interface GetAttachedGeneralTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.GeneralTransferManager;
}

interface GetAttachedManualApprovalTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.ManualApprovalTransferManager;
}

interface GetAttachedPercentageTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.PercentageTransferManager;
}

interface GetAttachedBlacklistTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.BlacklistTransferManager;
}

interface GetAttachedLockUpTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.LockUpTransferManager;
}

interface GetAttachedRestrictedPartialSaleTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.RestrictedPartialSaleTM;
}

interface GetAttachedVestingEscrowWalletParams extends GetAttachedModulesParams {
  moduleName: ModuleName.VestingEscrowWallet;
}

interface GetAttachedVolumeRestrictionTransferManagersParams extends GetAttachedModulesParams {
  moduleName: ModuleName.VolumeRestrictionTM;
}

interface GetAttachedCappedStosParams extends GetAttachedModulesParams {
  moduleName: ModuleName.CappedSTO;
}

interface GetAttachedUSDTieredStosParams extends GetAttachedModulesParams {
  moduleName: ModuleName.UsdTieredSTO;
}

interface GetAttachedErc20DividendCheckpointsParams extends GetAttachedModulesParams {
  moduleName: ModuleName.ERC20DividendCheckpoint;
}

interface GetAttachedEtherDividendCheckpointsParams extends GetAttachedModulesParams {
  moduleName: ModuleName.EtherDividendCheckpoint;
}

interface GetAttachedModules {
  (params: GetAttachedGeneralPermissionManagersParams, opts?: GetAttachedModulesOpts): Promise<
    GeneralPermissionManager[]
  >;
  (params: GetAttachedCountTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<CountTransferManager[]>;
  (params: GetAttachedGeneralTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<GeneralTransferManager[]>;
  (params: GetAttachedManualApprovalTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<
    ManualApprovalTransferManager[]
  >;
  (params: GetAttachedPercentageTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<
    PercentageTransferManager[]
  >;
  (params: GetAttachedBlacklistTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<
    BlacklistTransferManager[]
  >;
  (params: GetAttachedLockUpTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<LockUpTransferManager[]>;
  (params: GetAttachedVestingEscrowWalletParams, opts?: GetAttachedModulesOpts): Promise<VestingEscrowWallet[]>;
  (params: GetAttachedRestrictedPartialSaleTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<
    RestrictedPartialSaleTransferManager[]
  >;
  (params: GetAttachedVolumeRestrictionTransferManagersParams, opts?: GetAttachedModulesOpts): Promise<
    VolumeRestrictionTransferManager[]
  >;
  (params: GetAttachedCappedStosParams, opts?: GetAttachedModulesOpts): Promise<CappedSTO[]>;
  (params: GetAttachedUSDTieredStosParams, opts?: GetAttachedModulesOpts): Promise<USDTieredSTO[]>;
  (params: GetAttachedErc20DividendCheckpointsParams, opts?: GetAttachedModulesOpts): Promise<
    ERC20DividendCheckpoint[]
  >;
  (params: GetAttachedEtherDividendCheckpointsParams, opts?: GetAttachedModulesOpts): Promise<
    EtherDividendCheckpoint[]
  >;
}
/**
 * Looks up the instance of a module based on its moduleName. Requires the module to already be added to the security token.
 * @param polymathAPI Instance of the polymathAPI.
 * @param moduleName The enum ModuleName identifier
 * @param ticker The ticker symbol of the security token.
 * @param opts Options to return archived modules or not.
 */
export const moduleInstancesLookup = async (
  polymathAPI: PolymathAPI,
  { ticker, moduleName }: GetAttachedModulesParams,
  opts?: GetAttachedModulesOpts,
): Promise<any[]> => {
  // Create a Security Token Instance

  const securityToken = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker ? ticker : '');
  // Get Module Addresses
  const moduleAddresses = await securityToken.getModulesByName({ moduleName });

  // Filter based on options (whether to include archive tokens, or not)
  let filteredModuleAddresses: string[];
  if (opts && opts.unarchived) {
    // only return unarchived modules
    filteredModuleAddresses = await P.filter(moduleAddresses, async (moduleAddress: any) => {
      const { archived } = await securityToken.getModule({ moduleAddress });
      return !archived;
    });
  } else {
    filteredModuleAddresses = moduleAddresses;
  }
  console.log(filteredModuleAddresses);
  console.log('Addresses');
  // This has to be done this way because of typescript limitations
  let wrappedModules;
  switch (moduleName) {
    case ModuleName.GeneralPermissionManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.CountTransferManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.GeneralTransferManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.ManualApprovalTransferManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.PercentageTransferManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.VolumeRestrictionTM: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.RestrictedPartialSaleTM: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.VestingEscrowWallet: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.BlacklistTransferManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.LockUpTransferManager: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.CappedSTO: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.UsdTieredSTO: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.ERC20DividendCheckpoint: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    case ModuleName.EtherDividendCheckpoint: {
      wrappedModules = await P.map(filteredModuleAddresses, (moduleAddress: any) =>
        polymathAPI.moduleFactory.getModuleInstance({
          address: moduleAddress,
          name: moduleName,
        }),
      );
      return wrappedModules;
    }

    default: {
      throw new PolymathError({
        code: ErrorCode.NotFound,
        message: `There is no module with name ${moduleName}`,
      });
    }
  }
};
