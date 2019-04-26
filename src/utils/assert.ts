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
  checkValidWhitelist64ByteDates(canSendAfter: Date, canReceiveAfter: Date, expiryTime: Date) : void {
    const max64BitTime = new Date(18446744073709);
    sharedAssert.assert(max64BitTime >= canSendAfter, 'From: time too far in the future');
    sharedAssert.assert(max64BitTime >= canReceiveAfter, 'To: time too far in the future');
    sharedAssert.assert(max64BitTime >= expiryTime, 'Expiry: time too far in the future');
  },
  checkValidWhitelist64ByteArrayDatesAndLengths(canSendAfters: Date[], canReceiveAfters: Date[], expiryTimes: Date[], canBuyFromSTO: boolean[]) : void {
    sharedAssert.assert(canSendAfters.length === canReceiveAfters.length,
        'Array lengths for canSendAfters and canReceiveAfters passed in are not the same');
    sharedAssert.assert(canSendAfters.length === expiryTimes.length,
        'Array lengths for canSendAfters and expiryTimes passed in are not the same');
    sharedAssert.assert(canSendAfters.length === canBuyFromSTO.length,
        'Array lengths for canSendAfters and canBuyFromSTO passed in are not the same');
    for(let i=0; i < canSendAfters.length; i+1){
      this.checkValidWhitelist64ByteDates(canSendAfters[i], canReceiveAfters[i], expiryTimes[i]);
    }
  },
  checkAddManualApprovalConditions(to: string, expiryTime: Date, allowance: BigNumber): void {
    assert.isAddressNotZero(to);
    assert.assert(expiryTime > new Date(), 'ExpiryTime must be in the future');
    assert.assert(allowance.isGreaterThan(new BigNumber(0)), 'Allowance must be greater than 0');
  },
  checkAddManualApprovalMultiConditions(from: string[], to: string[], allowances: BigNumber[], expiryTimes: Date[], descriptions: string[]): void {
    sharedAssert.assert(from.length === to.length,
        'Array lengths for from address and to address passed in are not the same');
    sharedAssert.assert(from.length === allowances.length,
        'Array lengths for from address and allowances passed in are not the same');
    sharedAssert.assert(from.length === expiryTimes.length,
        'Array lengths for from address and expiryTimes passed in are not the same');
    sharedAssert.assert(from.length === descriptions.length,
        'Array lengths for from address and descriptions passed in are not the same');
    for(let i=0; i < to.length; i+1){
      this.checkAddManualApprovalConditions(to[i], expiryTimes[i], allowances[i]);
    }
  },
  checkModifyManualApprovalConditions(to: string, expiryTime: Date, ): void {
    assert.isAddressNotZero(to);
    assert.assert(expiryTime > new Date(), 'ExpiryTime must be in the future');
  },
  checkModifyManualApprovalMultiConditions(from: string[], to: string[], changeAllowances: BigNumber[], expiryTimes: Date[], descriptions: string[]): void {
    sharedAssert.assert(from.length === to.length,
        'Array lengths for from address and to address passed in are not the same');
    sharedAssert.assert(from.length === changeAllowances.length,
        'Array lengths for from address and allowances passed in are not the same');
    sharedAssert.assert(from.length === expiryTimes.length,
        'Array lengths for from address and expiryTimes passed in are not the same');
    sharedAssert.assert(from.length === descriptions.length,
        'Array lengths for from address and descriptions passed in are not the same');
    for(let i=0; i < to.length; i+1){
      this.checkModifyManualApprovalConditions(to[i], expiryTimes[i]);
    }
  },

};

export default assert;
