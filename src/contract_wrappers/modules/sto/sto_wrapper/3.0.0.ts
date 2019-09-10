import { STOBaseContract_3_0_0, Constructor } from 'types';
import STOWrapper from './common';

export interface MixinSTO_3_0_0 {}

export const WithSTO_3_0_0 = <T extends Constructor<STOWrapper>>(Base: T): Constructor<MixinSTO_3_0_0> & T => {
  class Extended extends Base {
    public contract!: Promise<STOBaseContract_3_0_0>;
  }

  return Extended;
};