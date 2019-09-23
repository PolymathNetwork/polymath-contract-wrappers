import { ContractVersion } from '../../../types';

import SecurityTokenCommon from './common';

export class SecurityToken_3_0_0 extends SecurityTokenCommon {}

export function isSecurityToken_3_0_0(wrapper: SecurityTokenCommon): wrapper is SecurityToken_3_0_0 {
  return wrapper.contractVersion === ContractVersion.V3_0_0;
}
