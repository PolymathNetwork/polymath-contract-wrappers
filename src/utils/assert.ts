import { assert as sharedAssert } from '@0x/assert';
import { BigNumber } from '@polymathnetwork/abi-wrappers';
import { Partition, ErrorCode } from '../types';
import { PolymathError } from '../PolymathError';

const ZERO = '0x0000000000000000000000000000000000000000';
const MAX_64_BYTES_DATE = new Date(18446744073709);
const MAX_PERCENTAGE = new BigNumber(100);
const BIG_NUMBER_ZERO = new BigNumber(0);

const assert = {
  ...sharedAssert,
  assert(condition: boolean, code: ErrorCode, message?: string): void {
    if (!condition) {
      throw new PolymathError({ message, code });
    }
  },
  isValidSubscriptionToken(variableName: string, subscriptionToken: string): void {
    const uuidRegex = new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$');
    const isValid = uuidRegex.test(subscriptionToken);
    this.assert(
      isValid,
      ErrorCode.InvalidSubscriptionToken,
      `Expected ${variableName} to be a valid subscription token`,
    );
  },
  isNonZeroETHAddressHex(variableName: string, address: string): void {
    sharedAssert.isETHAddressHex(variableName, address);
    this.assert(address !== ZERO, ErrorCode.InvalidAddress, `'${variableName}' is not expected to be 0x0`);
  },
  areThereDuplicatedStrings(variableName: string, addresses: string[]): void {
    const result = addresses.length === new Set(addresses).size;
    this.assert(result, ErrorCode.DuplicatedStrings, `There are duplicates in ${variableName} array.`);
  },
  isLessThanMax64BytesDate(variableName: string, value: Date): void {
    this.assert(value <= MAX_64_BYTES_DATE, ErrorCode.TooFar, `${variableName} date is too far in the future`);
  },
  isPercentage(variableName: string, value: BigNumber): void {
    this.assert(
      value.isLessThanOrEqualTo(MAX_PERCENTAGE),
      ErrorCode.InvalidData,
      `${variableName} is not expected to be greater than 100%`,
    );
  },
  isFutureDate(value: Date, message: string): void {
    this.assert(value >= new Date(), ErrorCode.TooEarly, message);
  },
  isPastDate(value: Date, message: string): void {
    this.assert(value <= new Date(), ErrorCode.TooFar, message);
  },
  isNotDateZero(value: Date, message: string): void {
    this.assert(value !== new Date(0), ErrorCode.InvalidData, message);
  },
  isBigNumberZero(value: BigNumber, message: string): void {
    this.assert(value.isEqualTo(BIG_NUMBER_ZERO), ErrorCode.InvalidData, message);
  },
  isBigNumberGreaterThanZero(value: BigNumber, message: string): void {
    this.assert(value >= BIG_NUMBER_ZERO, ErrorCode.InvalidData, message);
  },
  areValidArrayLengths(value: any[][], message: string) {
    // eslint-disable-line
    this.assert(
      value.every((x: any[]) => {
        // eslint-disable-line
        return x.length === value[0].length;
      }),
      ErrorCode.MismatchedArrayLength,
      message,
    );
  },
  // eslint-enable no-any
  isValidVersion(version: string) {
    this.assert(
      /^(\d+\.)(\d+\.)(\d+)$/.test(version),
      ErrorCode.InvalidVersion,
      'Invalid package version. Right format: major.minor.patch',
    );
  },
  isValidPartition(partition: Partition) {
    this.assert(partition === Partition.Unlocked, ErrorCode.InvalidPartition, 'Invalid Partition');
  },
};

export default assert;
