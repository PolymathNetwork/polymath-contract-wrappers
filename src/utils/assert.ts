import { assert as sharedAssert } from '@0x/assert';
import * as _ from 'lodash';

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
};

export default assert;
