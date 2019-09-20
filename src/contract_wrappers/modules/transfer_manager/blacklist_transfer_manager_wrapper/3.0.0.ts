import { ContractVersion } from '../../../../types';

import BlacklistTransferManagerCommon from './common';

export class BlacklistTransferManager_3_0_0 extends BlacklistTransferManagerCommon {}

export function isBlacklistTransferManager_3_0_0(
  wrapper: BlacklistTransferManagerCommon,
): wrapper is BlacklistTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
