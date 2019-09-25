import { DividendCheckpointBaseContract_3_0_0, Constructor } from '../../../../types';
import DividendCheckpointCommon from './common';
import { WithModule_3_0_0 } from '../../module_wrapper';

export interface MixinDividendCheckpoint_3_0_0 {}

export const WithDividendCheckpoint_3_0_0 = <T extends Constructor<DividendCheckpointCommon>>(Base: T): Constructor<MixinDividendCheckpoint_3_0_0> & T => {
  abstract class Extended extends Base {
    public contract!: Promise<DividendCheckpointBaseContract_3_0_0>;
  }

  return WithModule_3_0_0(Extended);
};