import { BigNumber } from '@polymathnetwork/abi-wrappers';
import P from 'bluebird';
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
  ModuleType,
  PercentageTransferManager,
  PolymathAPI,
  RestrictedPartialSaleTransferManager,
  USDTieredSTO,
  VestingEscrowWallet,
  VolumeRestrictionTransferManager,
  AdvancedPLCRVotingCheckpoint,
} from '../src';
import { PolymathError } from '../src/PolymathError';
import {
  CappedSTOData,
  CountTransferManagerData,
  DividendCheckpointData,
  PercentageTransferManagerData,
  RestrictedPartialSaleTransferManagerData,
  USDTieredSTOData,
  VestingEscrowWalletData,
} from '../src/contract_wrappers/tokens/security_token_wrapper/common';
import { ModuleFactory } from '../src/contract_wrappers/modules/module_factory_wrapper';

interface GetAttachedModulesParams {
  ticker: string;
  moduleName: ModuleName;
}

interface GetAttachedModulesOpts {
  unarchived: boolean;
}

export interface AddingModuleOpts {
  archived: boolean;
  label?: string;
  data?:
    | CountTransferManagerData
    | PercentageTransferManagerData
    | RestrictedPartialSaleTransferManagerData
    | DividendCheckpointData
    | CappedSTOData
    | USDTieredSTOData
    | VestingEscrowWalletData;
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

interface GetAttachedAdvancedPLCRVotingCheckpointsParams extends GetAttachedModulesParams {
  moduleName: ModuleName.AdvancedPLCRVotingCheckpoint;
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
  (params: GetAttachedAdvancedPLCRVotingCheckpointsParams, opts?: GetAttachedModulesOpts): Promise<
    AdvancedPLCRVotingCheckpoint
  >;
}

/**
 * Adds a module to the security token instance for a specific moduleName. Requires security token to already be generated.
 * @param polymathAPI Instance of the polymathAPI.
 * @param moduleName The enum ModuleName identifier
 * @param ticker The ticker symbol of the security token.
 * @param opts Options to return archived modules or not.
 */

export const addModule = async (
  polymathAPI: PolymathAPI,
  { ticker = '', moduleName }: GetAttachedModulesParams,
  opts: AddingModuleOpts,
) => {
  // Create a Security Token Instance
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker);

  const moduleTypes = {
    [ModuleName.CappedSTO]: ModuleType.STO,
    [ModuleName.UsdTieredSTO]: ModuleType.STO,
    [ModuleName.GeneralTransferManager]: ModuleType.TransferManager,
    [ModuleName.CountTransferManager]: ModuleType.TransferManager,
    [ModuleName.PercentageTransferManager]: ModuleType.TransferManager,
    [ModuleName.ManualApprovalTransferManager]: ModuleType.TransferManager,
    [ModuleName.BlacklistTransferManager]: ModuleType.TransferManager,
    [ModuleName.LockUpTransferManager]: ModuleType.TransferManager,
    [ModuleName.VolumeRestrictionTM]: ModuleType.TransferManager,
    [ModuleName.RestrictedPartialSaleTM]: ModuleType.TransferManager,
    [ModuleName.ERC20DividendCheckpoint]: ModuleType.Dividends,
    [ModuleName.EtherDividendCheckpoint]: ModuleType.Dividends,
    [ModuleName.GeneralPermissionManager]: ModuleType.PermissionManager,
    [ModuleName.VestingEscrowWallet]: ModuleType.Wallet,
    [ModuleName.AdvancedPLCRVotingCheckpoint]: ModuleType.Dividends,
  };

  async function getRequiredPolyTokenBalanceOnSecurityToken(setupCost: BigNumber) {
    // Get some poly tokens on the security token instance
    await polymathAPI.polyToken.transfer({
      to: await tickerSecurityTokenInstance.address(),
      value: setupCost,
    });
  }
  // This has to be done this way because of typescript limitations
  switch (moduleName) {
    case ModuleName.GeneralPermissionManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.GeneralPermissionManager],
        ModuleName.GeneralPermissionManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.GeneralPermissionManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    case ModuleName.CountTransferManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.CountTransferManager],
        ModuleName.CountTransferManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.CountTransferManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as CountTransferManagerData,
      });
      break;
    }

    case ModuleName.GeneralTransferManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.GeneralTransferManager],
        ModuleName.GeneralTransferManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.GeneralTransferManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    case ModuleName.ManualApprovalTransferManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.ManualApprovalTransferManager],
        ModuleName.ManualApprovalTransferManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.ManualApprovalTransferManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    case ModuleName.PercentageTransferManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.PercentageTransferManager],
        ModuleName.PercentageTransferManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.PercentageTransferManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as PercentageTransferManagerData,
      });
      break;
    }

    case ModuleName.VolumeRestrictionTM: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.VolumeRestrictionTM],
        ModuleName.VolumeRestrictionTM,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.VolumeRestrictionTM,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    case ModuleName.RestrictedPartialSaleTM: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.RestrictedPartialSaleTM],
        ModuleName.RestrictedPartialSaleTM,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.RestrictedPartialSaleTM,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as RestrictedPartialSaleTransferManagerData,
      });
      break;
    }

    case ModuleName.VestingEscrowWallet: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.VestingEscrowWallet],
        ModuleName.VestingEscrowWallet,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.VestingEscrowWallet,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as VestingEscrowWalletData,
      });
      break;
    }

    case ModuleName.BlacklistTransferManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.BlacklistTransferManager],
        ModuleName.BlacklistTransferManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.BlacklistTransferManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    case ModuleName.LockUpTransferManager: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.LockUpTransferManager],
        ModuleName.LockUpTransferManager,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.LockUpTransferManager,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    case ModuleName.CappedSTO: {
      const address = await getFactoryAddress(polymathAPI, moduleTypes[ModuleName.CappedSTO], ModuleName.CappedSTO);
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.CappedSTO,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as CappedSTOData,
      });
      break;
    }

    case ModuleName.UsdTieredSTO: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.UsdTieredSTO],
        ModuleName.UsdTieredSTO,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.UsdTieredSTO,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as USDTieredSTOData,
      });
      break;
    }

    case ModuleName.ERC20DividendCheckpoint: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.ERC20DividendCheckpoint],
        ModuleName.ERC20DividendCheckpoint,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.ERC20DividendCheckpoint,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as DividendCheckpointData,
      });
      break;
    }

    case ModuleName.EtherDividendCheckpoint: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.EtherDividendCheckpoint],
        ModuleName.EtherDividendCheckpoint,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.EtherDividendCheckpoint,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
        data: opts.data as DividendCheckpointData,
      });
      break;
    }

    case ModuleName.AdvancedPLCRVotingCheckpoint: {
      const address = await getFactoryAddress(
        polymathAPI,
        moduleTypes[ModuleName.AdvancedPLCRVotingCheckpoint],
        ModuleName.AdvancedPLCRVotingCheckpoint,
      );
      const factory = await polymathAPI.moduleFactory.getModuleFactory(address);
      const setupCost = await factory.setupCostInPoly();
      await getRequiredPolyTokenBalanceOnSecurityToken(setupCost);
      await tickerSecurityTokenInstance.addModule({
        moduleName: ModuleName.AdvancedPLCRVotingCheckpoint,
        address,
        maxCost: setupCost,
        budget: setupCost,
        archived: opts.archived,
      });
      break;
    }

    default: {
      throw new PolymathError({
        code: ErrorCode.NotFound,
        message: `There is no module with name ${moduleName}`,
      });
    }
  }
};

/**
 * Gets the module factory address
 * @param polymathAPI The api instance
 * @param moduleType Type of Module
 * @param moduleName Name of the module
 */
export const getFactoryAddress = async (
  polymathAPI: PolymathAPI,
  moduleType: ModuleType,
  moduleName: ModuleName,
): Promise<string> => {
  const modules = await polymathAPI.moduleRegistry.getModulesByType({
    moduleType,
  });
  const instances: Promise<ModuleFactory>[] = [];
  modules.map(address => {
    instances.push(polymathAPI.moduleFactory.getModuleFactory(address));
  });
  const resultInstances = await Promise.all(instances);

  const names: Promise<string>[] = [];
  resultInstances.map(instanceFactory => {
    names.push(instanceFactory.name());
  });
  const resultNames = await Promise.all(names);
  const index = resultNames.indexOf(moduleName);
  // Return  factory address
  return modules[index];
};

/**
 * Looks up the instance of a module based on its moduleName. Requires the module to already be added to the security token.
 * @param polymathAPI Instance of the polymathAPI.
 * @param moduleName The enum ModuleName identifier
 * @param ticker The ticker symbol of the security token.
 * @param opts Options to return archived modules or not.
 */
export const moduleInstancesLookup = async (
  polymathAPI: PolymathAPI,
  { ticker = '', moduleName }: GetAttachedModulesParams,
  opts?: GetAttachedModulesOpts,
): Promise<any[]> => {
  // Create a Security Token Instance

  const securityToken = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker);
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

    case ModuleName.AdvancedPLCRVotingCheckpoint: {
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
