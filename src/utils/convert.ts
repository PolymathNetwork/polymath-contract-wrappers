import { ethers } from 'ethers';
import { BigNumber } from '@0x/utils';

export function bytes32ToString(value: string) {
  return ethers.utils.toUtf8String(value);
}

export function stringToBytes32(value: string) {
  return ethers.utils.formatBytes32String(value);
}

export function bigNumberToDate(value: BigNumber) {
  var date = new Date(0);
  date.setUTCSeconds(value.toNumber());
  return date;
}

export function dateToBigNumber(value: Date) {
  return new BigNumber(parseInt((value.getTime() / 1000).toFixed(0)))
}

export function numberToBigNumber(value: number) {
  return new BigNumber(value)
}

export function bigNumberToNumber(value: BigNumber) {
  return value.toNumber();
}

export function dateArrayToBigNumberArray(value: Date[]) {
  return value.map<BigNumber>((x) => {
    return dateToBigNumber(x);
  });
}
