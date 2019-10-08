/* istanbul ignore file */
import { ModuleFactoryEventArgs_3_0_0 } from '@polymathnetwork/abi-wrappers';
import { ModuleFactory_3_0_0, isModuleFactory_3_0_0 } from './3.0.0';

import Common, {
  isModuleFactory,
  ChangeCostAndTypeParams,
  ChangeDescriptionParams,
  ChangeNameParams,
  ChangeSTVersionBoundsParams,
  ChangeSetupCostParams,
  ChangeTagsParams,
  ChangeTitleParams,
} from './common';
import { ContractVersion } from '../../../types';

export type ModuleFactoryEventArgs = ModuleFactoryEventArgs_3_0_0;

export {
  ModuleFactoryEvents_3_0_0 as ModuleFactoryEvents,
  ModuleFactoryChangeCostTypeEventArgs_3_0_0 as ModuleFactoryChangeCostTypeEventArgs,
  ModuleFactoryChangeSTVersionBoundEventArgs_3_0_0 as ModuleFactoryChangeSTVersionBoundEventArgs,
  ModuleFactoryChangeSetupCostEventArgs_3_0_0 as ModuleFactoryChangeSetupCostEventArgs,
  ModuleFactoryGenerateModuleFromFactoryEventArgs_3_0_0 as ModuleFactoryGenerateModuleFromFactoryEventArgs,
  ModuleFactoryOwnershipTransferredEventArgs_3_0_0 as ModuleFactoryOwnershipTransferredEventArgs,
} from '@polymathnetwork/abi-wrappers';

export type ModuleFactory = ModuleFactory_3_0_0;

export { isModuleFactory, ModuleFactory_3_0_0, isModuleFactory_3_0_0 };

export namespace ModuleFactoryTransactionParams {
  export interface ChangeSetupCost extends ChangeSetupCostParams {}
  export interface ChangeCostAndType extends ChangeCostAndTypeParams {}
  export interface ChangeTitle extends ChangeTitleParams {}
  export interface ChangeDescription extends ChangeDescriptionParams {}
  export interface ChangeName extends ChangeNameParams {}
  export interface ChangeTags extends ChangeTagsParams {}
  export interface ChangeSTVersionBounds extends ChangeSTVersionBoundsParams {}
}

// for internal use
export class ModuleFactoryCommon extends Common {
  public contractVersion!: ContractVersion;
}
