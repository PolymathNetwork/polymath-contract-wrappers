import { assert as sharedAssert } from '@0x/assert';
import { BigNumber } from '@0x/utils';

const ZERO = '0x0000000000000000000000000000000000000000';
const MAX_64_BYTES_DATE = new Date(18446744073709);
const MAX_PERCENTAGE = new BigNumber(100);
const BIG_NUMBER_ZERO = new BigNumber(0);

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
    const result = addresses.length === new Set(addresses).size;
    sharedAssert.assert(result, `There are duplicates in ${variableName} array.`);
  },
  isLessThanMax64BytesDate(variableName: string, value: Date): void {
    sharedAssert.assert(value <= MAX_64_BYTES_DATE, `${variableName} date is too far in the future`);
  },
  isPercentage(variableName: string, value: BigNumber): void {
    sharedAssert.assert(
      value.isLessThanOrEqualTo(MAX_PERCENTAGE),
      `${variableName} is not expected to be greater than 100%`,
    );
  },
  isFutureDate(value: Date, message: string): void {
    sharedAssert.assert(value >= new Date(), message);
  },
  isPastDate(value: Date, message: string): void {
    sharedAssert.assert(value <= new Date(), message);
  },
  isNotDateZero(value: Date, message: string): void {
    sharedAssert.assert(value !== new Date(0), message);
  },
  isBigNumberZero(value: BigNumber, message: string): void {
    sharedAssert.assert(value.isEqualTo(BIG_NUMBER_ZERO), message);
  },
  isBigNumberGreaterThanZero(value: BigNumber, message: string): void {
    sharedAssert.assert(value >= BIG_NUMBER_ZERO, message);
  },
  areValidArrayLengths(value: any[][], message: string) {
    sharedAssert.assert(
      value.every((x: any[]) => {
        return x.length === value[0].length;
      }),
      message,
    );
  },
};

export default assert;
