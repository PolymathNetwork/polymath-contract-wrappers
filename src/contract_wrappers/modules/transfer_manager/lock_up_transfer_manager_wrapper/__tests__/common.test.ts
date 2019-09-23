// LockUpTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  LockUpTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  PolyTokenEvents_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import ModuleWrapper from '../../../module_wrapper';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import ContractFactory from '../../../../../factories/contractFactory';
import {
  bytes32ArrayToStringArray,
  bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberArrayToBigNumberArray,
  numberToBigNumber,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueArrayToWeiArray,
  valueToWei,
  weiToValue,
} from '../../../../../utils/convert';
import { Partition } from '../../../../../types';
import LockUpTransferManagerCommon from '../common';

describe('LockUpTransferManagerWrapper', () => {
  let target: LockUpTransferManagerCommon;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: LockUpTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(LockUpTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new LockUpTransferManagerCommon(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
    reset(mockedSecurityTokenContract);
  });

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof ModuleWrapper).toBe(true);
    });
  });

  describe('lockups', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to lockups', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = new BigNumber(1);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
      ];
      const mockedParams = {
        lockupName: 'LockupDetails',
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.lockups).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.lockups(mockedParams);
      // Result expectation
      expect(result.lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
      expect(result.startTime).toEqual(startTime);
      expect(result.lockUpPeriodSeconds).toBe(expectedResult[2].toNumber());
      expect(result.releaseFrequencySeconds).toBe(expectedResult[3].toNumber());

      // Verifications
      verify(mockedContract.lockups).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getLockUp', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to getLockups', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(2), expectedDecimalsResult);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(1);
      const expectedResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedParams = {
        lockupName: 'LockupDetails',
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getLockUp(mockedParams);
      // Result expectation
      expect(result.lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
      expect(result.startTime).toEqual(startTime);
      expect(result.lockUpPeriodSeconds).toBe(expectedResult[2].toNumber());
      expect(result.releaseFrequencySeconds).toBe(expectedResult[3].toNumber());
      expect(result.unlockedAmount).toEqual(weiToValue(expectedUnlockedAmount, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getLockUp).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getAllLockUpData', () => {
    test('should call to getAllLockupData', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedNames = stringArrayToBytes32Array(['Lockup1', 'Lockup2']);
      const expectedLockupAmount = valueToWei(new BigNumber(50), expectedDecimalsResult);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const expectedResult = [
        expectedNames,
        [expectedLockupAmount, expectedLockupAmount],
        [expectedStartTime, expectedStartTime],
        [expectedLockUpPeriodSeconds, expectedLockUpPeriodSeconds],
        [expectedReleaseFrequencySeconds, expectedReleaseFrequencySeconds],
        [expectedUnlockedAmount, expectedUnlockedAmount],
      ];

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllLockupData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllLockupData();
      // Result expectation
      for (let i = 0; i < result.length; i += 1) {
        expect(result[i].lockupName).toEqual(bytes32ToString(expectedNames[i]));
        expect(result[i].lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
        expect(result[i].startTime).toEqual(startTime);
        expect(result[i].lockUpPeriodSeconds).toBe(expectedLockUpPeriodSeconds.toNumber());
        expect(result[i].releaseFrequencySeconds).toBe(expectedReleaseFrequencySeconds.toNumber());
        expect(result[i].unlockedAmount).toEqual(weiToValue(expectedUnlockedAmount, expectedDecimalsResult));
      }

      // Verifications
      verify(mockedContract.getAllLockupData).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getListOfAddresses', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to getListOfAddresses', async () => {
      const expectedResult = [
        '0x8888888888888888888888888888888888888888',
        '0x9999999999999999999999999999999999999999',
      ];
      const mockedParams = {
        lockupName: 'LockupDetails',
      };

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getListOfAddresses(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.getListOfAddresses).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.lockupName)))).once();
    });
  });

  describe('getAllLockups', () => {
    test('should call to getAllLockups', async () => {
      const expectedResult = stringArrayToBytes32Array(['Lock1', 'Lock2']);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllLockups).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllLockups();
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));

      // Verifications
      verify(mockedContract.getAllLockups).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('getLockupsNamesToUser', () => {
    test('should call to getLockupsNamesToUser', async () => {
      const expectedResult = stringArrayToBytes32Array(['Lock1', 'Lock2']);
      const mockedParams = {
        user: '0x8888888888888888888888888888888888888888',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockupsNamesToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getLockupsNamesToUser(mockedParams);
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));

      // Verifications
      verify(mockedContract.getLockupsNamesToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
    });
  });

  describe('getLockedTokenToUser', () => {
    test('should call to getLockedTokenToUser', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedResult = new BigNumber(100);
      const mockedParams = {
        user: '0x8888888888888888888888888888888888888888',
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockedTokenToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getLockedTokenToUser(mockedParams);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getLockedTokenToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('getTokensByPartition', () => {
    test('should call to getTokensByPartition', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedResult = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const mockedParams = {
        partition: Partition.Unlocked,
        tokenHolder: '0x8888888888888888888888888888888888888888',
        additionalBalance: new BigNumber(10),
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensByPartition).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.partition,
          mockedParams.tokenHolder,
          objectContaining(valueToWei(mockedParams.additionalBalance, expectedDecimalsResult)),
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensByPartition(mockedParams);
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, expectedDecimalsResult));

      // Verifications
      verify(mockedContract.getTokensByPartition).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.partition,
          mockedParams.tokenHolder,
          objectContaining(valueToWei(mockedParams.additionalBalance, expectedDecimalsResult)),
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('addNewLockUpType', () => {
    test('should call addNewLockUpType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupName = 'Lockup1';
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = new BigNumber(0);
      const expectedLockUpPeriodSeconds = new BigNumber(0);
      const expectedReleaseFrequencySeconds = new BigNumber(0);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupName,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      when(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).thenResolve(expectedGetLockupResult);

      const mockedParams = {
        lockupAmount: new BigNumber(100),
        startTime: new Date(2030, 1),
        lockUpPeriodSeconds: 3600,
        releaseFrequenciesSeconds: 60,
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addNewLockUpType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberToBigNumber(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewLockUpType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addNewLockUpType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberToBigNumber(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).thrice();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).thrice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thrice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).once();
      verify(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).once();
    });
  });

  describe('addNewLockUpTypeMulti', () => {
    test('should call addNewLockUpTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupNames = ['Lockup1', 'Lockup2'];
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = new BigNumber(0);
      const expectedLockUpPeriodSeconds = new BigNumber(0);
      const expectedReleaseFrequencySeconds = new BigNumber(0);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupNames,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedGetLockupResult,
        );
      }

      const mockedParams = {
        lockupAmounts: [new BigNumber(100), new BigNumber(200)],
        startTimes: [new Date(2030, 1), new Date(2030, 1)],
        lockUpPeriodSeconds: [3600, 3600],
        releaseFrequenciesSeconds: [60, 60],
        lockupNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addNewLockUpTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewLockUpTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addNewLockUpTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(4);
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).thrice();
      verify(mockedSecurityTokenContract.decimals).thrice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).times(mockedGetLockupParams.lockupNames.length);
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
      }
    });
  });

  describe('addLockUpByName', () => {
    test('should call addLockUpByName', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedLockUpInvestorAddress = '0x4444444444444444444444444444444444444444';
      const lockupName = 'Lockup3';
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(10), expectedDecimalsResult);
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupName,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      when(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).thenResolve(expectedGetLockupResult);

      const expectedGetLockupsNamesToUserResult = stringArrayToBytes32Array(['Lockup1', 'Lockup2']);
      const mockedGetLockupsNamesToUserParams = {
        user: expectedLockUpInvestorAddress,
      };
      // Mocked method
      const mockedGetLockupsNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockupsNamesToUser).thenReturn(instance(mockedGetLockupsNamesToUserMethod));
      // Stub the request
      when(mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.user)).thenResolve(
        expectedGetLockupsNamesToUserResult,
      );

      const mockedParams = {
        userAddress: expectedLockUpInvestorAddress,
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addLockUpByName).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addLockUpByName(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addLockUpByName).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).once();
      verify(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).once();
      verify(mockedContract.getLockupsNamesToUser).once();
      verify(mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.user)).once();
    });
  });

  describe('addLockUpByNameMulti', () => {
    test('should call addLockUpByNameMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedLockUpInvestorAddresses = [
        '0x0123456789012345678901234567890123456789',
        '0x2222222222222222222222222222222222222222',
      ];
      const lockupNames = ['Lockup1', 'Lockup2'];
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedGetLockupResult,
        );
      }

      const expectedGetLockupsNamesToUserResult = stringArrayToBytes32Array(['Lockup3', 'Lockup4']);
      const mockedGetLockupsNamesToUserParams = {
        userAddresses: expectedLockUpInvestorAddresses,
      };
      // Mocked method
      const mockedGetLockupsNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockupsNamesToUser).thenReturn(instance(mockedGetLockupsNamesToUserMethod));
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(
          mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.userAddresses[i]),
        ).thenResolve(expectedGetLockupsNamesToUserResult);
      }

      const mockedParams = {
        lockupNames,
        userAddresses: expectedLockUpInvestorAddresses,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addLockUpByNameMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addLockUpByNameMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addLockUpByNameMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).times(lockupNames.length);
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
      }
      verify(mockedContract.getLockupsNamesToUser).times(lockupNames.length);
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.userAddresses[i])).once();
      }
    });
  });

  describe('addNewLockUpToUser', () => {
    test('should call addNewLockUpToUser', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupName = 'Lockup1';
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = new BigNumber(0);
      const expectedLockUpPeriodSeconds = new BigNumber(0);
      const expectedReleaseFrequencySeconds = new BigNumber(0);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupName,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      when(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).thenResolve(expectedGetLockupResult);

      const mockedParams = {
        userAddress: '0x5555555555555555555555555555555555555555',
        lockupAmount: new BigNumber(100),
        startTime: new Date(2030, 1),
        lockUpPeriodSeconds: 3600,
        releaseFrequenciesSeconds: 60,
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addNewLockUpToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberToBigNumber(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewLockUpToUser(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addNewLockUpToUser).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberToBigNumber(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).thrice();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).thrice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thrice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).once();
      verify(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).once();
    });
  });

  describe('addNewLockUpToUserMulti', () => {
    test('should call addNewLockUpToUserMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupNames = ['Lockup1', 'Lockup2'];
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(0), expectedDecimalsResult);
      const expectedStartTime = new BigNumber(0);
      const expectedLockUpPeriodSeconds = new BigNumber(0);
      const expectedReleaseFrequencySeconds = new BigNumber(0);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupNames,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedGetLockupResult,
        );
      }

      const mockedParams = {
        userAddresses: ['0x5555555555555555555555555555555555555555', '0x6666666666666666666666666666666666666666'],
        lockupAmounts: [new BigNumber(100), new BigNumber(200)],
        startTimes: [new Date(2030, 1), new Date(2030, 1)],
        lockUpPeriodSeconds: [3600, 3600],
        releaseFrequenciesSeconds: [60, 60],
        lockupNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addNewLockUpToUserMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewLockUpToUserMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addNewLockUpToUserMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(4);
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).thrice();
      verify(mockedSecurityTokenContract.decimals).thrice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).times(mockedGetLockupParams.lockupNames.length);
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
      }
    });
  });

  describe('removeLockUpFromUser', () => {
    test('should call removeLockUpFromUser', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedLockUpInvestorAddress = '0x4444444444444444444444444444444444444444';
      const lockupName = 'Lockup3';

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedGetLockupsNamesToUserResult = stringArrayToBytes32Array(['Lockup1', 'Lockup2', 'Lockup3']);
      const mockedGetLockupsNamesToUserParams = {
        user: expectedLockUpInvestorAddress,
      };
      // Mocked method
      const mockedGetLockupsNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockupsNamesToUser).thenReturn(instance(mockedGetLockupsNamesToUserMethod));
      // Stub the request
      when(mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.user)).thenResolve(
        expectedGetLockupsNamesToUserResult,
      );

      const mockedParams = {
        userAddress: expectedLockUpInvestorAddress,
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeLockUpFromUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeLockUpFromUser(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeLockUpFromUser).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockupsNamesToUser).once();
      verify(mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.user)).once();
    });
  });

  describe('removeLockUpFromUserMulti', () => {
    test('should call removeLockUpFromUserMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedLockUpInvestorAddresses = [
        '0x0123456789012345678901234567890123456789',
        '0x2222222222222222222222222222222222222222',
      ];
      const lockupNames = ['Lockup1', 'Lockup2'];

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );

      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedGetLockupsNamesToUserResult = stringArrayToBytes32Array(['Lockup1', 'Lockup2', 'Lockup3']);
      const mockedGetLockupsNamesToUserParams = {
        userAddresses: expectedLockUpInvestorAddresses,
      };
      // Mocked method
      const mockedGetLockupsNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockupsNamesToUser).thenReturn(instance(mockedGetLockupsNamesToUserMethod));
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(
          mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.userAddresses[i]),
        ).thenResolve(expectedGetLockupsNamesToUserResult);
      }

      const mockedParams = {
        lockupNames,
        userAddresses: expectedLockUpInvestorAddresses,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeLockUpFromUserMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeLockUpFromUserMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeLockUpFromUserMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockupsNamesToUser).times(lockupNames.length);
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupsNamesToUserMethod.callAsync(mockedGetLockupsNamesToUserParams.userAddresses[i])).once();
      }
    });
  });

  describe('removeLockUpType', () => {
    test('should call removeLockUpType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupName = 'Lockup1';
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const expectedStartTime = dateToBigNumber(new Date(2018, 1));
      const expectedLockUpPeriodSeconds = new BigNumber(1);
      const expectedReleaseFrequencySeconds = new BigNumber(1);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupName,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      when(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).thenResolve(expectedGetLockupResult);

      const expectedListOfAddressesResult: string[] = [];

      const mockedListOfAddressesParams = {
        lockupName,
      };

      // Mocked method
      const mockedListOfAddressesMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedListOfAddressesMethod));
      // Stub the request
      when(
        mockedListOfAddressesMethod.callAsync(
          objectContaining(stringToBytes32(mockedListOfAddressesParams.lockupName)),
        ),
      ).thenResolve(expectedListOfAddressesResult);

      const mockedParams = {
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeLockupType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeLockupType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeLockupType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).once();
      verify(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).once();
      verify(mockedContract.getListOfAddresses).once();
      // Stub the request
      verify(
        mockedListOfAddressesMethod.callAsync(
          objectContaining(stringToBytes32(mockedListOfAddressesParams.lockupName)),
        ),
      ).once();
    });
  });

  describe('removeLockupTypeMulti', () => {
    test('should call removeLockupTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupNames = ['Lockup1', 'Lockup2'];
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const expectedStartTime = dateToBigNumber(new Date(2018, 1));
      const expectedLockUpPeriodSeconds = new BigNumber(1);
      const expectedReleaseFrequencySeconds = new BigNumber(1);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupNames,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));

      const expectedListOfAddressesResult: string[] = [];
      // Mocked method
      const mockedListOfAddressesMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedListOfAddressesMethod));

      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedGetLockupResult,
        );
        when(mockedListOfAddressesMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedListOfAddressesResult,
        );
      }

      const mockedParams = {
        lockupNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeLockupTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeLockupTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeLockupTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).thrice();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).thrice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thrice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).times(mockedGetLockupParams.lockupNames.length);
      verify(mockedContract.getListOfAddresses).times(mockedGetLockupParams.lockupNames.length);
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
        verify(mockedListOfAddressesMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
      }
    });
  });

  describe('modifyLockUpType', () => {
    test('should call modifyLockUpType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupName = 'Lockup1';
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupName,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      when(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).thenResolve(expectedGetLockupResult);

      const mockedParams = {
        lockupAmount: new BigNumber(200),
        startTime: new Date(2031, 1),
        lockUpPeriodSeconds: 3600,
        releaseFrequenciesSeconds: 60,
        lockupName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyLockUpType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberToBigNumber(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyLockUpType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyLockUpType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueToWei(mockedParams.lockupAmount, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberToBigNumber(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringToBytes32(mockedParams.lockupName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).thrice();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).thrice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thrice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).once();
      verify(
        mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(mockedGetLockupParams.lockupName))),
      ).once();
    });
  });

  describe('modifyLockUpTypeMulti', () => {
    test('should call modifyLockUpTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const lockupNames = ['Lockup1', 'Lockup2'];
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(100), expectedDecimalsResult);
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(0);
      const expectedGetLockupResult = [
        expectedLockupAmount,
        expectedStartTime,
        expectedLockUpPeriodSeconds,
        expectedReleaseFrequencySeconds,
        expectedUnlockedAmount,
      ];
      const mockedGetLockupParams = {
        lockupNames,
      };

      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetLockupMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getLockUp).thenReturn(instance(mockedGetLockupMethod));
      // Stub the request
      for (let i = 0; i < lockupNames.length; i += 1) {
        when(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).thenResolve(
          expectedGetLockupResult,
        );
      }

      const mockedParams = {
        lockupAmounts: [new BigNumber(200), new BigNumber(400)],
        startTimes: [new Date(2031, 1), new Date(2031, 1)],
        lockUpPeriodSeconds: [3600, 3600],
        releaseFrequenciesSeconds: [60, 60],
        lockupNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyLockUpTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),

          objectContaining(numberArrayToBigNumberArray(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyLockUpTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyLockUpTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(valueArrayToWeiArray(mockedParams.lockupAmounts, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.lockUpPeriodSeconds)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.releaseFrequenciesSeconds)),
          objectContaining(stringArrayToBytes32Array(mockedParams.lockupNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(4);
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).thrice();
      verify(mockedSecurityTokenContract.decimals).thrice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getLockUp).times(mockedGetLockupParams.lockupNames.length);
      for (let i = 0; i < lockupNames.length; i += 1) {
        verify(mockedGetLockupMethod.callAsync(objectContaining(stringToBytes32(lockupNames[i])))).once();
      }
    });
  });

  describe('verifyTransfer', () => {
    test('should verify Transfer', async () => {
      const statusCode = new BigNumber(2);
      const expectedResult = [statusCode, '0x1111111111111111111111111111111111111111'];
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';
      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);
      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        amount: new BigNumber(10),
        data: 'Data',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);

      // Result expectation
      expect(result.transferResult).toBe(statusCode.toNumber());
      expect(result.address).toBe(expectedResult[1]);
      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.callAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.data,
        ),
      ).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to LockUpTransferManager', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: PolyTokenEvents_3_0_0.Transfer,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'AddLockUpToUser', 'RemoveLockUpFromUser', 'ModifyLockUpType', 'AddNewLockUpType', 'RemoveLockUpType', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
