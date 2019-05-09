import { assert as sharedAssert } from '@0x/assert';
import * as _ from 'lodash';
import { BigNumber } from '@0x/utils';

const ZERO = '0x0000000000000000000000000000000000000000';
const MAX_64_BYTES_DATE = new Date(18446744073709);

const assert = {
  ...sharedAssert,
  isValidSubscriptionToken(variableName: string, subscriptionToken: string): void {
    const uuidRegex = new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$');
    const isValid = uuidRegex.test(subscriptionToken);
    sharedAssert.assert(isValid, `Expected ${variableName} to be a valid subscription token`);
  },
  isNonZeroETHAddressHex(variableName: string, address: string): void {
    sharedAssert.isETHAddressHex(variableName, address);
    sharedAssert.assert(address !== ZERO, `'${variableName}' is not expected to be 0x0`);
  },
  areThereDuplicatedStrings(variableName: string, addresses: string[]): void {
    const result = _.filter(addresses, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
    sharedAssert.assert(
      result.length > 0,
      `There are duplicates in ${variableName} array. Duplicates: ${result.toString}`,
    );
  },
  isLessThanMax64BytesDate(variableName: string, value: Date): void {
    sharedAssert.assert(value <= MAX_64_BYTES_DATE, `${variableName} date is too far in the future`);
  },
};

export default assert;
