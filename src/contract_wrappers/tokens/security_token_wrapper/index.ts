/* istanbul ignore file */
import { SecurityToken_3_0_0, isSecurityToken_3_0_0 } from './3.0.0';

import Common from './common';
import { ContractVersion, Subscribe, GetLogs } from '../../../types';

export type SecurityToken = SecurityToken_3_0_0;

export { SecurityToken_3_0_0, isSecurityToken_3_0_0 };

// for internal use
export class SecurityTokenCommon extends Common {
  public contractVersion!: ContractVersion;

  public subscribeAsync!: Subscribe;

  public getLogsAsync!: GetLogs;
}