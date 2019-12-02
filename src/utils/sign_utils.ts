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
