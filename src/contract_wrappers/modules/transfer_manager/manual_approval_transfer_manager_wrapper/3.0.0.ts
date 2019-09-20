import ManualApprovalTransferManagerCommon from './common';
import { ContractVersion } from '../../../../types';

export class ManualApprovalTransferManager_3_0_0 extends ManualApprovalTransferManagerCommon {}

export function isManualApprovalTransferManager_3_0_0(
  wrapper: ManualApprovalTransferManagerCommon,
): wrapper is ManualApprovalTransferManager_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
