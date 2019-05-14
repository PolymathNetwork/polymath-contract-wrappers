// SecurityTokenWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import {
  SecurityTokenContract,
  PolyTokenEvents,
  FeatureRegistryContract,
  ModuleFactoryContract,
} from '@polymathnetwork/abi-wrappers';
import ERC20TokenWrapper from '../erc20_wrapper';
import { Features, ModuleType, ModuleName } from '../../../types';
import SecurityTokenWrapper from '../security_token_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  stringToBytes32,
  stringArrayToBytes32Array,
  bytes32ArrayToStringArray,
  bytes32ToString,
  numberToBigNumber,
  dateToBigNumber,
} from '../../../utils/convert';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';

describe('SecurityTokenWrapper', () => {
  // Declare SecurityTokenWrapper object
  let target: SecurityTokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: SecurityTokenContract;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(SecurityTokenContract);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new SecurityTokenWrapper(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ERC20TokenWrapper', async () => {
      expect(target instanceof ERC20TokenWrapper).toBe(true);
    });
  });

  describe('currentCheckpointId', () => {
    test('should call to currentCheckpointId', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.currentCheckpointId).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.currentCheckpointId();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.currentCheckpointId).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('granularity', () => {
    test('should call to granularity', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.granularity).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.granularity();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.granularity).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('controller', () => {
    test('should call to controller', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.controller).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.controller();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.controller).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('polyToken', () => {
    test('should call to polyToken', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.polyToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.polyToken();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.polyToken).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('polymathRegistry', () => {
    test('should call to polymathRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.polymathRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.polymathRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.polymathRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('controllerDisabled', () => {
    test('should call to controllerDisabled', async () => {
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.controllerDisabled).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.controllerDisabled();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.controllerDisabled).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('owner', () => {
    test('should call to owner', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.owner();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('mintingFrozen', () => {
    test('should call to mintingFrozen', async () => {
      const expectedResult = false;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.mintingFrozen).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.mintingFrozen();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.mintingFrozen).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('moduleRegistry', () => {
    test('should call to moduleRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.moduleRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.moduleRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.moduleRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('featureRegistry', () => {
    test('should call to featureRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.featureRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.featureRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.featureRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('securityTokenRegistry', () => {
    test('should call to securityTokenRegistry', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.securityTokenRegistry).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.securityTokenRegistry();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.securityTokenRegistry).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('tokenDetails', () => {
    test('should call to tokenDetails', async () => {
      const expectedResult = 'string';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.tokenDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.tokenDetails();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.tokenDetails).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('transfersFrozen', () => {
    test('should call to transfersFrozen', async () => {
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.transfersFrozen).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.transfersFrozen();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transfersFrozen).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getModulesByName', () => {
    test('should call to getModulesByName', async () => {
      const expectedResult = true;
      const mockedParams = {
        moduleName: ModuleName.GeneralPermissionManager,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByName).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(stringToBytes32(mockedParams.moduleName))).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByName(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByName).once();
      verify(mockedMethod.callAsync(stringToBytes32(mockedParams.moduleName))).once();
    });
  });

  describe('getInvestors', () => {
    test('should call to getInvestors', async () => {
      const expectedResult = ['string', 'string'];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestors();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInvestors).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getInvestorsAt', () => {
    test('should call to getInvestorsAt', async () => {
      const expectedResult = ['string', 'string'];
      const mockedParams = {
        checkpointId: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestorsAt).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getInvestorsAt(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInvestorsAt).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).once();
    });
  });

  describe('iterateInvestors', () => {
    test('should call to iterateInvestors', async () => {
      const expectedResult = ['string', 'string'];
      const mockedParams = {
        start: new Date(),
        end: new Date(),
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.iterateInvestors).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          objectContaining(dateToBigNumber(mockedParams.start)),
          objectContaining(dateToBigNumber(mockedParams.end)),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.iterateInvestors(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.iterateInvestors).once();
      verify(
        mockedMethod.callAsync(
          objectContaining(dateToBigNumber(mockedParams.start)),
          objectContaining(dateToBigNumber(mockedParams.end)),
        ),
      ).once();
    });
  });

  describe('getInvestorCount', () => {
    test('should call to getInvestorCount', async () => {
      const expectedResult = new BigNumber(0);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getInvestorCount).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getInvestorCount();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getInvestorCount).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('checkPermission', () => {
    test.todo('should fail as modudelegateAddressle is not an Eth address');
    test.todo('should fail as moduleAddress is not an Eth address');

    test('should call to checkPermission', async () => {
      const expectedResult = true;
      const mockedParams = {
        delegateAddress: '0x1111111111111111111111111111111111111111',
        moduleAddress: '0x1111111111111111111111111111111111111111',
        permission: 'string',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.checkPermission).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.delegateAddress,
          mockedParams.moduleAddress,
          stringToBytes32(mockedParams.permission),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.checkPermission(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.checkPermission).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.delegateAddress,
          mockedParams.moduleAddress,
          stringToBytes32(mockedParams.permission),
        ),
      ).once();
    });
  });

  describe('getCheckpointTimes', () => {
    test('should call to getCheckpointTimes', async () => {
      const expectedResult = new BigNumber(0);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getCheckpointTimes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getCheckpointTimes();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getCheckpointTimes).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('totalSupplyAt', () => {
    test('should call to totalSupplyAt', async () => {
      const expectedResult = new BigNumber(1);
      const mockedParams = {
        checkpointId: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.totalSupplyAt).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.totalSupplyAt(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.totalSupplyAt).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.checkpointId)))).once();
    });
  });

  describe('balanceOfAt', () => {
    test.todo('should fail as investor is not an Eth address');

    test('should call to balanceOfAt', async () => {
      const expectedResult = new BigNumber(1);
      const mockedParams = {
        investor: '0x1111111111111111111111111111111111111111',
        checkpointId: 1,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.balanceOfAt).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.checkpointId))),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.balanceOfAt(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.balanceOfAt).once();
      verify(
        mockedMethod.callAsync(mockedParams.investor, objectContaining(numberToBigNumber(mockedParams.checkpointId))),
      ).once();
    });
  });

  describe('getVersion', () => {
    test('should call to getVersion', async () => {
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getVersion).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getVersion();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getVersion).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getModulesByType', () => {
    test('should call to getModulesByType', async () => {
      const expectedResult = ['string'];
      const mockedParams = {
        type: ModuleType.Burn,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModulesByType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.type)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModulesByType(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getModulesByType).once();
      verify(mockedMethod.callAsync(mockedParams.type)).once();
    });
  });

  describe('getModule', () => {
    test.todo('should fail as moduleAddress is not an Eth address');

    test('should call to getModule', async () => {
      const expectedString = '0x123';
      const expectedNumber = [1, 2];
      const expectedResult = [
        bytes32ToString(expectedString),
        'stringstringstring',
        'stringstringstring',
        true,
        expectedNumber,
      ];
      const mockedParams = {
        moduleAddress: '0x1111111111111111111111111111111111111111',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getModule).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.moduleAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getModule(mockedParams);
      // Result expectation
      expect(result.name).toEqual(expectedString);
      expect(result.address).toBe(expectedResult[1]);
      expect(result.factoryAddress).toBe(expectedResult[2]);
      expect(result.archived).toBe(expectedResult[3]);
      expect(result.types).toEqual(expectedNumber);
      // Verifications
      verify(mockedContract.getModule).once();
      verify(mockedMethod.callAsync(mockedParams.moduleAddress)).once();
    });
  });
});
