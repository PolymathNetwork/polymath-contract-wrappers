// LockUpTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  LockUpTransferManagerContract,
  ISecurityTokenContract,
  PolyTokenEvents,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import LockUpTransferManagerWrapper from '../lock_up_transfer_manager_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import ModuleWrapper from '../../module_wrapper';
import {
  bytes32ArrayToStringArray,
  dateToBigNumber,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueToWei,
  weiToValue,
} from '../../../../utils/convert';

describe('LockUpTransferManagerWrapper', () => {
  let target: LockUpTransferManagerWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: LockUpTransferManagerContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(LockUpTransferManagerContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new LockUpTransferManagerWrapper(
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

  describe('paused', () => {
    test('should get Paused', async () => {
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.paused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.paused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('pause/unpause', () => {
    test('should call to pause', async () => {
      // Pause Result expected
      const expectedPauseResult = false;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
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

      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.pause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.pause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.pause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.paused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
    });

    test('should call to unpause', async () => {
      // Pause Result expected
      const expectedPauseResult = true;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.paused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
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

      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.unpause).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.unpause(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.unpause).once();
      verify(mockedMethod.sendTransactionAsync(mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.paused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('lockups', () => {
    test.todo('should fail as lockup name is an empty string');

    test('should call to lockups', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      const expectedLockupAmount = valueToWei(new BigNumber(1), expectedDecimalsResult);
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
      expect(result.lockUpPeriodSeconds).toBe(expectedResult[2]);
      expect(result.releaseFrequencySeconds).toBe(expectedResult[3]);

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
      expect(result.lockUpPeriodSeconds).toBe(expectedResult[2]);
      expect(result.releaseFrequencySeconds).toBe(expectedResult[3]);
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
      const expectedLockupAmount = valueToWei(new BigNumber(2), expectedDecimalsResult);
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const expectedLockUpPeriodSeconds = new BigNumber(3600);
      const expectedReleaseFrequencySeconds = new BigNumber(60);
      const expectedUnlockedAmount = new BigNumber(1);
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
      expect(result[0].lockupName).toEqual(expectedResult[0][0]);
      for (let i = 0; i < result.length; i += 1) {
        expect(result[1].lockupName).toEqual(bytes32ArrayToStringArray(expectedNames));
        expect(result[i].lockupAmount).toEqual(weiToValue(expectedLockupAmount, expectedDecimalsResult));
        expect(result[i].startTime).toEqual(startTime);
        expect(result[i].lockUpPeriodSeconds).toBe(expectedResult[2]);
        expect(result[i].releaseFrequencySeconds).toBe(expectedResult[3]);
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
        eventName: PolyTokenEvents.Transfer,
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
