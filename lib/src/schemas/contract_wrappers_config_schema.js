"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractWrappersConfigSchema = {
    id: '/ContractWrappersConfig',
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
//# sourceMappingURL=contract_wrappers_config_schema.js.map