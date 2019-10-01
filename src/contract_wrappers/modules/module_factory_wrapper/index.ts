/* istanbul ignore file */
import { ModuleFactory_3_0_0, isModuleFactory_3_0_0 } from './3.0.0';

import Common, { isModuleFactory } from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../types';

export type ModuleFactory = ModuleFactory_3_0_0;

export {
  isModuleFactory,
  ModuleFactory_3_0_0,
  isModuleFactory_3_0_0
};

// for internal use
export class ModuleFactoryCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}
