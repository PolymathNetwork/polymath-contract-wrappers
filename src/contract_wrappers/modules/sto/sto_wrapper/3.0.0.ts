import { STOBaseContract_3_0_0, Constructor } from '../../../../types';
import STOCommon from './common';

export interface MixinSTO_3_0_0 {}

export const WithSTO_3_0_0 = <T extends Constructor<STOCommon>>(Base: T): Constructor<MixinSTO_3_0_0> & T => {
  class Extended extends Base {
    public contract!: Promise<STOBaseContract_3_0_0>;
  }

  return Extended;
};