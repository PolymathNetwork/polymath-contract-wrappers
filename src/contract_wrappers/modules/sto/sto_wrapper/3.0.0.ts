import { STOBaseContract_3_0_0, Constructor } from '../../../../types';
import STOCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

export interface MixinSTO_3_0_0 {}

export const WithSTO_3_0_0 = <T extends Constructor<STOCommon>>(Base: T): Constructor<MixinSTO_3_0_0> & T => {
  abstract class Extended extends Base {
    public contract!: Promise<STOBaseContract_3_0_0>;
  }

  return WithModule_3_0_0(Extended);
};