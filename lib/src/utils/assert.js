"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@0x/assert");
exports.assert = __assign({}, assert_1.assert, { isValidSubscriptionToken: function (variableName, subscriptionToken) {
        var uuidRegex = new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$');
        var isValid = uuidRegex.test(subscriptionToken);
        assert_1.assert.assert(isValid, "Expected " + variableName + " to be a valid subscription token");
    } });
//# sourceMappingURL=assert.js.map