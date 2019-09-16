/* istanbul ignore file */
import { USDTieredSTO_3_0_0, isUSDTieredSTO_3_0_0 } from './3.0.0';
import { USDTieredSTO_3_1_0, isUSDTieredSTO_3_1_0 } from './3.1.0';

export type USDTieredSTO = USDTieredSTO_3_0_0 | USDTieredSTO_3_1_0;

export {
  USDTieredSTO_3_0_0,
  isUSDTieredSTO_3_0_0,
  USDTieredSTO_3_1_0,
  isUSDTieredSTO_3_1_0
};
export { default as USDTieredSTOCommon } from './common';
