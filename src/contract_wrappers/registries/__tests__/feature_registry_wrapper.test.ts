// PolymathRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { FeatureRegistryContract, PolyTokenEvents, FeatureRegistryEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import {Contracts, Features} from '../../../types';
import ContractWrapper from '../../contract_wrapper';
import FeatureRegistryWrapper from '../feature_registry_wrapper';

describe('FeatureRegistryWrapper', () => {
    // Declare PolyMathRegistryWrapper object
    let target: FeatureRegistryWrapper;
    let mockedWrapper: Web3Wrapper;
    let mockedContract: FeatureRegistryContract;

    beforeAll(() => {
        mockedWrapper = mock(Web3Wrapper);
        mockedContract = mock(FeatureRegistryContract);

        const myContractPromise = Promise.resolve(instance(mockedContract));
        target = new FeatureRegistryWrapper(instance(mockedWrapper), myContractPromise);
    });

    afterEach(() => {
        reset(mockedWrapper);
        reset(mockedContract);
    });

    describe('Types', () => {
        test('should extend ContractWrapper', async () => {
            expect(target instanceof ContractWrapper).toBe(true);
        });
    });

    describe('GetFeatureStatus', () => {
        test('should get the feature status for the given name key', async () => {
            // Address expected
            const expectedResult = true;
            // Contract requested
            const featureName = Features.CustomModulesAllowed.toString();
            // Mocked method
            const mockedMethod = mock(MockedCallMethod);
            // Stub the method
            when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
            // Stub the request
            when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

            // Real call
            const result = await target.getFeatureStatus({nameKey: featureName});
            // Result expectation
            expect(result).toBe(expectedResult);
            // Verifications
            verify(mockedContract.getFeatureStatus).once();
            verify(mockedMethod.callAsync(featureName)).once();
        });

        test('should get the feature status for the CustomModulesAllowed name key', async () => {
            // Address expected
            const expectedResult = true;
            // Contract requested
            const featureName = Features.CustomModulesAllowed.toString();
            // Mocked method
            const mockedMethod = mock(MockedCallMethod);
            // Stub the method
            when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
            // Stub the request
            when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

            // Real call
            const result = await target.getCustomModulesAllowedStatus();
            // Result expectation
            expect(result).toBe(expectedResult);
            // Verifications
            verify(mockedContract.getFeatureStatus).never();
            verify(mockedMethod.callAsync(featureName)).once();
        });

        test('should get the feature status for the FreezeMintingAllowed name key', async () => {
            // Address expected
            const expectedResult = true;
            // Contract requested
            const featureName = Features.FreezeMintingAllowed.toString();
            // Mocked method
            const mockedMethod = mock(MockedCallMethod);
            // Stub the method
            when(mockedContract.getFeatureStatus).thenReturn(instance(mockedMethod));
            // Stub the request
            when(mockedMethod.callAsync(featureName)).thenResolve(expectedResult);

            // Real call
            const result = await target.getFreezeMintingAllowedStatus();
            // Result expectation
            expect(result).toBe(expectedResult);
            // Verifications
            verify(mockedContract.getFeatureStatus).once();
            verify(mockedMethod.callAsync(featureName)).once();
        });



        describe('SetFeatureStatus', () => {
            test('should send the transaction to set the feature status', async () => {
                // Mocked parameters
                const mockedParams = {
                    nameKey: Features.CustomModulesAllowed,
                    newStatus: true,
                    txData: {},
                    safetyFactor: 10,
                };
                const expectedResult = Promise.resolve;
                // Mocked method
                const mockedMethod = mock(MockedSendMethod);
                // Stub the method
                when(mockedContract.setFeatureStatus).thenReturn(instance(mockedMethod));
                // Stub the request
                when(
                    mockedMethod.sendTransactionAsync(
                        mockedParams.nameKey,
                        mockedParams.newStatus,
                        mockedParams.txData,
                        mockedParams.safetyFactor,
                    ),
                ).thenResolve(expectedResult);

                // Real call
                const result = await target.setFeatureStatus(mockedParams);

                // Result expectation
                expect(result).toBe(expectedResult);
                // Verifications
                verify(mockedContract.setFeatureStatus).once();
                verify(
                    mockedMethod.sendTransactionAsync(
                        mockedParams.nameKey,
                        mockedParams.newStatus,
                        mockedParams.txData,
                        mockedParams.safetyFactor,
                    ),
                ).never();
            });
        });
    });
        describe('SubscribeAsync', () => {
            test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
                // Mocked parameters
                const mockedParams = {
                    eventName: PolyTokenEvents.Transfer,
                    indexFilterValues: {},
                    callback: () => {
                    },
                    isVerbose: false,
                };

                // Real call
                await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
                    new Error(
                        `Expected eventName to be one of: 'ChangeFeatureStatus', 'OwnershipRenounced', 'OwnershipTransferred', encountered: Transfer`,
                    ),
                );
            });
        });
});
