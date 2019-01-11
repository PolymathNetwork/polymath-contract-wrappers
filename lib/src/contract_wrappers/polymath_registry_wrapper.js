"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var polymath_abi_wrappers_1 = require("polymath-abi-wrappers");
var polymath_contract_artifacts_1 = require("polymath-contract-artifacts");
var assert_1 = require("../utils/assert");
var _ = require("lodash");
var contract_addresses_1 = require("../utils/contract_addresses");
var contract_wrapper_1 = require("./contract_wrapper");
/**
 * This class includes the functionality related to interacting with the PolymathRegistry contract.
 */
var PolymathRegistryWrapper = /** @class */ (function (_super) {
    __extends(PolymathRegistryWrapper, _super);
    /**
     * Instantiate PolymathRegistryWrapper
     * @param web3Wrapper Web3Wrapper instance to use
     * @param networkId Desired networkId
     * @param address The address of the PolymathRegistry contract. If undefined, will
     * default to the known address corresponding to the networkId.
     */
    function PolymathRegistryWrapper(web3Wrapper, networkId, address) {
        var _this = _super.call(this, web3Wrapper, networkId) || this;
        _this.abi = polymath_contract_artifacts_1.PolymathRegistry.abi;
        _this.address = _.isUndefined(address) ? contract_addresses_1._getDefaultContractAddresses(networkId).polymathRegistry : address;
        return _this;
    }
    PolymathRegistryWrapper.prototype.getAddress = function (contractName) {
        return __awaiter(this, void 0, void 0, function () {
            var PolymathRegistryContractInstance, addresse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isString('contractName', contractName);
                        PolymathRegistryContractInstance = this._getPolymathRegistryContract();
                        return [4 /*yield*/, PolymathRegistryContractInstance.getAddress.callAsync(contractName)];
                    case 1:
                        addresse = _a.sent();
                        return [2 /*return*/, addresse];
                }
            });
        });
    };
    PolymathRegistryWrapper.prototype._getPolymathRegistryContract = function () {
        if (!_.isUndefined(this._polymathRegistryContractIfExists)) {
            return this._polymathRegistryContractIfExists;
        }
        var contractInstance = new polymath_abi_wrappers_1.PolymathRegistryContract(this.abi, this.address, this._web3Wrapper.getProvider(), this._web3Wrapper.getContractDefaults());
        this._polymathRegistryContractIfExists = contractInstance;
        return this._polymathRegistryContractIfExists;
    };
    return PolymathRegistryWrapper;
}(contract_wrapper_1.ContractWrapper));
exports.PolymathRegistryWrapper = PolymathRegistryWrapper;
//# sourceMappingURL=polymath_registry_wrapper.js.map