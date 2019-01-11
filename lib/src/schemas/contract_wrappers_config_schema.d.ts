export declare const ContractWrappersConfigSchema: {
    id: string;
    properties: {
        networkId: {
            type: string;
        };
        gasPrice: {
            $ref: string;
        };
        contractAddresses: {
            type: string;
            properties: {
                polymathRegistry: {
                    $ref: string;
                };
            };
        };
        blockPollingIntervalMs: {
            type: string;
        };
    };
    type: string;
    required: string[];
};
//# sourceMappingURL=contract_wrappers_config_schema.d.ts.map