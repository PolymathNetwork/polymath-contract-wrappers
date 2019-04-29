import { assert as sharedAssert } from '@0x/assert';
import * as _ from 'lodash';
import { BigNumber } from '@0x/utils';

const ZERO = '0x0000000000000000000000000000000000000000';

const assert = {
  ...sharedAssert,
  isValidSubscriptionToken(variableName: string, subscriptionToken: string): void {
    const uuidRegex = new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$');
    const isValid = uuidRegex.test(subscriptionToken);
    sharedAssert.assert(isValid, `Expected ${variableName} to be a valid subscription token`);
  },
  isETHAddressHexArray(variableName: string, arr: string[]): void {
    _.map(arr, address => {
      assert.isETHAddressHex(variableName, address);
    });
  },
  isAddressNotZero(address: string): void {
    sharedAssert.assert(address !== ZERO, `Invalid address ${address}`);
  },
  isAddressArrayNotZero(addresses: string[]): void {
    _.map(addresses, address => {
      this.isAddressNotZero(address);
    });
  },
  checkDuplicateAddresses(addresses: string[]): void {
    const result = _.filter(addresses, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
    sharedAssert.assert(result.length > 0, `Duplicate exclude address ${result.toString}`);
  },
  checkWithholdingTax(withholding: BigNumber): void {
    const bn = new BigNumber(10 ** 18);
    sharedAssert.assert(withholding <= bn, 'Incorrect withholding tax');
  },
  checkWithholdingArrayTax(withholdings: BigNumber[]): void {
    _.map(withholdings, withholding => {
      this.checkWithholdingTax(withholding);
    });
  },
};

export default assert;
