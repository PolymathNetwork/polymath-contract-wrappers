import { ethersUtils } from '@polymathnetwork/abi-wrappers';
import { dateToBigNumber, numberToBigNumber } from './convert';
import { InvestorTransferData } from '../contract_wrappers/tokens/security_token_wrapper/common';

function splitInvestorDataIntoArrays(investorsData: InvestorTransferData[]) {
  const investorAddresses = investorsData.map(i => i.investorAddress);
  const fromTimes = investorsData.map(i => dateToBigNumber(i.canSendAfter).toString());
  const toTimes = investorsData.map(i => dateToBigNumber(i.canReceiveAfter).toString());
  const expiryTimes = investorsData.map(i => dateToBigNumber(i.expiryTime).toString());
  return { investorAddresses, fromTimes, toTimes, expiryTimes };
}

function getTypedData(networkId: number, securityTokenAddress: string, reason: string) {
  // Using EIP720 to check signed acknowledgment
  // https://github.com/PolymathNetwork/polymath-core/blob/master/contracts/libraries/TokenLib.sol
  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Acknowledgment: [{ name: 'text', type: 'string' }],
    },
    primaryType: 'Acknowledgment',
    domain: {
      name: 'Polymath',
      chainId: networkId,
      verifyingContract: securityTokenAddress,
    },
    message: {
      text: `I acknowledge that ${reason} is a permanent and irrevocable change`,
    },
  };
  return typedData;
}

export function getFreezeIssuanceTypedData(networkId: number, securityTokenAddress: string) {
  return getTypedData(networkId, securityTokenAddress, 'freezing Issuance');
}

export function getDisableControllerTypedData(networkId: number, securityTokenAddress: string) {
  return getTypedData(networkId, securityTokenAddress, 'disabling controller');
}

export function getHashedTransferData(
  tmAddress: string,
  investorsData: InvestorTransferData[],
  validFrom: Date,
  validTo: Date,
  nonce: number,
) {
  const { investorAddresses, fromTimes, toTimes, expiryTimes } = splitInvestorDataIntoArrays(investorsData);

  const types = ['address', 'address[]', 'uint256[]', 'uint256[]', 'uint256[]', 'uint256', 'uint256', 'uint256'];
  const values = [
    tmAddress,
    investorAddresses,
    fromTimes,
    toTimes,
    expiryTimes,
    dateToBigNumber(validFrom).toString(),
    dateToBigNumber(validTo).toString(),
    numberToBigNumber(nonce).toString(),
  ];
  return ethersUtils.solidityKeccak256(types, values);
}

export function encodeSignedTransferData(
  tmAddress: string,
  investorsData: InvestorTransferData[],
  validFrom: Date,
  validTo: Date,
  nonce: number,
  signature: string,
) {
  const { investorAddresses, fromTimes, toTimes, expiryTimes } = splitInvestorDataIntoArrays(investorsData);

  const packedData = ethersUtils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'uint256[]', 'uint256[]', 'bytes'],
    [investorAddresses, fromTimes, toTimes, expiryTimes, signature],
  );
  const encodedData = ethersUtils.defaultAbiCoder.encode(
    ['address', 'uint256', 'uint256', 'uint256', 'bytes'],
    [
      tmAddress,
      numberToBigNumber(nonce).toString(),
      dateToBigNumber(validFrom).toString(),
      dateToBigNumber(validTo).toString(),
      packedData,
    ],
  );
  return encodedData;
}
