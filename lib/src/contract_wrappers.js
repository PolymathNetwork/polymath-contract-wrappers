"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var polymath_contract_artifacts_1 = require("polymath-contract-artifacts");
var web3_wrapper_1 = require("@0x/web3-wrapper");
var _ = require("lodash");
var polymath_registry_wrapper_1 = require("./contract_wrappers/polymath_registry_wrapper");
var contract_wrappers_config_schema_1 = require("./schemas/contract_wrappers_config_schema");
var assert_1 = require("./utils/assert");
var contract_addresses_1 = require("./utils/contract_addresses");
/**
 * The ContractWrappers class contains smart contract wrappers helpful when building on Polymath ecosystem.
 */
var ContractWrappers = /** @class */ (function () {
    /**
     * Instantiates a new ContractWrappers instance.
     * @param   provider    The Provider instance you would like the contract-wrappers library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the ContractWrappers class.
     */
    function ContractWrappers(provider, config) {
        var _this = this;
        assert_1.assert.isWeb3Provider('provider', provider);
        assert_1.assert.doesConformToSchema('config', config, contract_wrappers_config_schema_1.ContractWrappersConfigSchema);
        var txDefaults = {
            gasPrice: config.gasPrice,
        };
        this._web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider, txDefaults);
        var artifactsArray = [
            polymath_contract_artifacts_1.PolymathRegistry,
        ];
        _.forEach(artifactsArray, function (artifact) {
            _this._web3Wrapper.abiDecoder.addABI(artifact.abi);
        });
        var contractAddresses = _.isUndefined(config.contractAddresses)
            ? contract_addresses_1._getDefaultContractAddresses(config.networkId)
            : config.contractAddresses;
        this.polymathRegistry = new polymath_registry_wrapper_1.PolymathRegistryWrapper(this._web3Wrapper, config.networkId, contractAddresses.polymathRegistry);
    }
    /**
     * Get the provider instance currently used by contract-wrappers
     * @return  Web3 provider instance
     */
    ContractWrappers.prototype.getProvider = function () {
        return this._web3Wrapper.getProvider();
    };
    return ContractWrappers;
}());
exports.ContractWrappers = ContractWrappers;
//# sourceMappingURL=contract_wrappers.js.map