export declare const assert: {
    isValidSubscriptionToken(variableName: string, subscriptionToken: string): void;
    isBigNumber(variableName: string, value: import("bignumber.js").BigNumber): void;
    isValidBaseUnitAmount(variableName: string, value: import("bignumber.js").BigNumber): void;
    isString(variableName: string, value: string): void;
    isFunction(variableName: string, value: any): void;
    isHexString(variableName: string, value: string): void;
    isETHAddressHex(variableName: string, value: string): void;
    doesBelongToStringEnum(variableName: string, value: string, stringEnum: any): void;
    hasAtMostOneUniqueValue(value: any[], errMsg: string): void;
    isNumber(variableName: string, value: number): void;
    isBoolean(variableName: string, value: boolean): void;
    isWeb3Provider(variableName: string, value: any): void;
    doesConformToSchema(variableName: string, value: any, schema: import("jsonschema").Schema, subSchemas?: import("jsonschema").Schema[] | undefined): void;
    isWebUri(variableName: string, value: any): void;
    isUri(variableName: string, value: any): void;
    assert(condition: boolean, message: string): void;
    typeAssertionMessage(variableName: string, type: string, value: any): string;
};
//# sourceMappingURL=assert.d.ts.map