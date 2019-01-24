export const ContractWrappersConfigSchema = {
  id: '/IContractWrappersConfig',
  properties: {
    networkId: {
      type: 'number',
    },
    gasPrice: { $ref: '/numberSchema' },
    contractAddresses: {
      type: 'object',
      properties: {
        polymathRegistry: { $ref: '/addressSchema' },
      },
    },
    blockPollingIntervalMs: { type: 'number' },
  },
  type: 'object',
  required: ['networkId'],
};
