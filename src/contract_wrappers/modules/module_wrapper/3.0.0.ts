import { GenericModuleContract_3_0_0, Constructor } from '../../../types';
import ModuleCommon from './common';

export interface MixinModule_3_0_0 {}

export const WithModule_3_0_0 = <T extends Constructor<ModuleCommon>>(Base: T): Constructor<MixinModule_3_0_0> & T => {
  abstract class Extended extends Base {
    public contract!: Promise<GenericModuleContract_3_0_0>;
  }

  return Extended;
};
