import { DividendCheckpointBaseContract_3_0_0, Constructor } from '../../../../types';
import DividendCheckpointCommon from './common';

export interface MixinDividendCheckpoint_3_0_0 {}

export const WithDividendCheckpoint_3_0_0 = <T extends Constructor<DividendCheckpointCommon>>(Base: T): Constructor<MixinDividendCheckpoint_3_0_0> & T => {
  abstract class Extended extends Base {
    public contract!: Promise<DividendCheckpointBaseContract_3_0_0>;
  }

  return Extended;
};
