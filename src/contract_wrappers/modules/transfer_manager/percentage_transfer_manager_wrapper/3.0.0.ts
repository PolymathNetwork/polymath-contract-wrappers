import { ContractVersion } from '../../../../types';

import PercentageTransferManagerCommon from './common';

export class PercentageTransferManager_3_0_0 extends PercentageTransferManagerCommon {}

export function isPercentageTransferManager_3_0_0(
  wrapper: PercentageTransferManagerCommon,
): wrapper is PercentageTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
