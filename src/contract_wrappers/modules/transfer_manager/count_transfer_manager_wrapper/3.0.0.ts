import { ContractVersion } from '../../../../types';

import CountTransferManagerCommon from './common';

export class CountTransferManager_3_0_0 extends CountTransferManagerCommon {}

export function isCountTransferManager_3_0_0(
  wrapper: CountTransferManagerCommon,
): wrapper is CountTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
