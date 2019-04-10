// PolymathRegistryWrapper test
import '../test_types/web3-fake-provider';
import '../test_types/web3';
import '../src/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as FakeProvider from 'web3-fake-provider';
import {PolymathRegistryWrapper} from '../src/contract_wrappers/registries/polymath_registry_wrapper';
import {Contracts} from '../src';
import { PolymathRegistryContract} from "@polymathnetwork/abi-wrappers";
import { PolymathRegistry} from "@polymathnetwork/contract-artifacts";
import SpyInstance = jest.SpyInstance;

describe('PolyMathRegistryWrapper getAddressTests', () => {
    // Declare PolyMathRegistryWrapper object
    let polyMathRegistry: PolymathRegistryWrapper;
    let getWrapperAddressSpy: SpyInstance;
    beforeAll(async () => {
        const provider = new FakeProvider();
        const web3Wrapper = new Web3Wrapper(provider);

        const polyMathReg = '0x54d04c6c037329cf5b6f1eb4a70f42b8d98bc6fd';
        const polymathContract: PolymathRegistryContract = new PolymathRegistryContract(
            PolymathRegistry.abi,
            // (address) ? address : await this._getDefaultPolymathRegistryAddress(), //for optional address
            polyMathReg,
            web3Wrapper.getProvider(),
            web3Wrapper.getContractDefaults(),
        );

        const myContractPromise = new Promise<PolymathRegistryContract>((resolve) => {
            resolve(polymathContract);
        });
        polyMathRegistry = new PolymathRegistryWrapper(web3Wrapper, myContractPromise);
        getWrapperAddressSpy = jest.spyOn(polyMathRegistry, 'getAddress');
    });

    afterEach(async () => {
        getWrapperAddressSpy.mockClear();
    });

    test('PolyToken Contract Name used as an argument to getAddress when calling getPolyTokenAddress',
        async () => {
            polyMathRegistry.getPolyTokenAddress();
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe(Contracts.PolyToken);
        });

    test('Module Registry Contract Name used as an argument to getAddress when calling getModuleRegistryAddress',
        async () => {
            polyMathRegistry.getModuleRegistryAddress();
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe(Contracts.ModuleRegistry);
    });

    test('Feature Registry Name used as an argument to getAddress when calling getFeatureRegistryAddress',
        async () => {
            polyMathRegistry.getFeatureRegistryAddress();
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe(Contracts.FeatureRegistry);
    });

    test('ST Registry Name used as an argument to getAddress when calling getSecurityTokenRegistryAddress',
        async () => {
            polyMathRegistry.getSecurityTokenRegistryAddress();
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe(Contracts.SecurityTokenRegistry);
    });

    test('Poly Usd Oracle Name used as an argument to getAddress when calling getPolyUsdOracleAddress',
        async () => {
            polyMathRegistry.getPolyUsdOracleAddress();
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe(Contracts.PolyUsdOracle);
    });

    test('Eth Usd Oracle Name used as an argument to getAddress when calling getEthUsdOracleAddress',
        async () => {
            polyMathRegistry.getEthUsdOracleAddress();
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe(Contracts.EthUsdOracle);
    });

    test('Contract name used as an argument to getAddress when calling getAddress overload',
        async () => {
            polyMathRegistry.getAddress({contractName: 'contractName'});
            // Confirm that the mocked getAddress function was called once
            expect(getWrapperAddressSpy).toHaveBeenCalledTimes(1);
            // Confirm that the right contract name was used
            expect(getWrapperAddressSpy.mock.calls[0][0].contractName).toBe('contractName');
        });
});
