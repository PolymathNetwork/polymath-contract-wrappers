// ModuleFactoryWrapper test
import {mock, instance, reset, when, verify, objectContaining} from 'ts-mockito';
import {
  ModuleFactoryContract,
  BigNumber,
  Web3Wrapper,
  EtherDividendCheckpointEvents,
} from '@polymathnetwork/abi-wrappers';
import {getMockedPolyResponse, MockedCallMethod, MockedSendMethod} from '../../../test_utils/mocked_methods';
import ContractFactory from '../../../factories/contractFactory';
import {
  bytes32ToString,
  parseModuleTypeValue,
  stringArrayToBytes32Array,
  stringToBytes32,
  weiToValue
} from '../../../utils/convert';
import ModuleFactoryWrapper from '../module_factory_wrapper';
import ContractWrapper from '../../contract_wrapper';
import {FULL_DECIMALS, ModuleType} from '../../../types';

describe('ModuleFactoryWrapper', () => {
  let target: ModuleFactoryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ModuleFactoryContract;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ModuleFactoryContract);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ModuleFactoryWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('owner', () => {
    test('should call to owner', async () => {
      const expectedResult = '0x0123456789012345678901234567890123456789';
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


  describe('Name', () => {
    test('should get name', async () => {
      // Address expected
      const expectedResult = stringToBytes32('Name');
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.name).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.name();
      // Result expectation
      expect(result).toBe(bytes32ToString(expectedResult));
      // Verifications
      verify(mockedContract.name).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Title', () => {
    test('should get title', async () => {
      // Address expected
      const expectedResult = 'Title';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.title).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.title();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.title).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Description', () => {
    test('should get description', async () => {
      // Address expected
      const expectedResult = 'Description';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.description).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.description();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.description).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('IsCostInPoly', () => {
    test('should get isCostInPoly', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isCostInPoly).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.isCostInPoly();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isCostInPoly).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Version', () => {
    test('should get version', async () => {
      // Address expected
      const expectedResult = 'Version';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.version).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.version();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.version).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetTypes', () => {
    test('should get types', async () => {
      // Address expected
      const expectedResult = [new BigNumber(ModuleType.STO), new BigNumber(ModuleType.Dividends)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTypes).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTypes();
      // Result expectation
      expect(result).toEqual(expectedResult.map(parseModuleTypeValue));
      // Verifications
      verify(mockedContract.getTypes).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getTags', () => {
    test('should get tags', async () => {
      // Address expected
      const expectedResult = stringArrayToBytes32Array(['Tag1', 'Tag2']);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTags).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTags();
      // Result expectation
      expect(stringArrayToBytes32Array(result)).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTags).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('changeSetupCost', () => {
    test.todo('should fail as changeSetupCost is 0');
    test('should send the transaction to changeSetupCost', async () => {
      // Mocked parameters
      const mockedParams = {
        setupCost: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeSetupCost).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
          mockedMethod.sendTransactionAsync(objectContaining(mockedParams.setupCost), mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Real call
      const result = await target.changeSetupCost(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.changeSetupCost).once();
      verify(
          mockedMethod.sendTransactionAsync(objectContaining(mockedParams.setupCost), mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('setupCost', () => {
    test('should get setupCost', async () => {
      // Address expected
      const expectedResult = new BigNumber(100);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.setupCost).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.setupCost();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.setupCost).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getUpperSTVersionBounds', () => {
    test('should get UpperSTVersionBounds', async () => {
      // Address expected
      const expectedResult = [new BigNumber(1), new BigNumber(2)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getUpperSTVersionBounds).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getUpperSTVersionBounds();
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getUpperSTVersionBounds).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getLowerSTVersionBounds', () => {
    test('should get LowerSTVersionBounds', async () => {
      // Address expected
      const expectedResult = [new BigNumber(1), new BigNumber(2)];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLowerSTVersionBounds).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getLowerSTVersionBounds();
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getLowerSTVersionBounds).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('setupCostInPoly', () => {
    test('should get setupCostInPoly', async () => {
      // Address expected
      const expectedResult = new BigNumber(100);
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setupCostInPoly).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.setupCostInPoly();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.setupCostInPoly).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to ModuleFactoryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: EtherDividendCheckpointEvents.EtherDividendDeposited,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'OwnershipTransferred', 'ChangeSetupCost', 'ChangeCostType', 'GenerateModuleFromFactory', 'ChangeSTVersionBound', encountered: EtherDividendDeposited`,
        ),
      );
    });
  });
});
