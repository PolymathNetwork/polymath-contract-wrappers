// BlacklistTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  BlacklistTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import ContractFactory from '../../../../../factories/contractFactory';
import { ModuleCommon } from '../../../module_wrapper';
import {
  bytes32ArrayToStringArray,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberArrayToBigNumberArray,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueToWei,
  weiToValue,
} from '../../../../../utils/convert';
import { Partition, ContractVersion, Subscribe, GetLogs } from '../../../../../types';
import BlacklistTransferManagerCommon from '../common';

describe('BlacklistTransferManagerWrapper', () => {

  class FakeBlacklistTransferManager extends BlacklistTransferManagerCommon {
    public contract: Promise<BlacklistTransferManagerContract_3_0_0>;

    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe

    public getLogsAsync!: GetLogs;

    public constructor(web3Wrapper: Web3Wrapper, contract: Promise<BlacklistTransferManagerContract_3_0_0>, contractFactory: ContractFactory) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  let target: FakeBlacklistTransferManager;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: BlacklistTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(BlacklistTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeBlacklistTransferManager(
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
      expect(target instanceof ModuleCommon).toBe(true);
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

  describe('blacklists', () => {
    test.todo('should fail as blacklists name is an empty string');

    test('should call to blacklists', async () => {
      const startTime = new Date(2030, 1);
      const expectedStartTime = dateToBigNumber(startTime);
      const endTime = new Date(2031, 1);
      const expectedEndTime = dateToBigNumber(endTime);
      const expectedRepeatPeriodTime = new BigNumber(100);
      const expectedResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];
      const mockedParams = {
        blacklistName: 'Blacklist',
      };

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.blacklistName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.blacklists(mockedParams);
      // Result expectation
      expect(result.startTime).toEqual(startTime);
      expect(result.endTime).toEqual(endTime);
      expect(result.repeatPeriodTime).toEqual(expectedResult[2].toNumber());

      // Verifications
      verify(mockedContract.blacklists).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.blacklistName)))).once();
    });
  });

  describe('addBlacklistType', () => {
    test('should call addBlacklistType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const blacklistName = 'Blacklist1';
      const expectedStartTime = new BigNumber(0);
      const expectedEndTime = new BigNumber(0);
      const expectedRepeatPeriodTime = new BigNumber(0);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];
      const mockedGetBlacklistParams = {
        blacklistName,
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetBlacklistMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistMethod));
      // Stub the request
      when(
        mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).thenResolve(expectedGetBlacklistResult);

      const mockedParams = {
        startTime: new Date(2030, 1),
        endTime: new Date(2031, 1),
        blacklistName,
        repeatPeriodTime: 366,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addBlacklistType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          objectContaining(new BigNumber(mockedParams.repeatPeriodTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addBlacklistType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addBlacklistType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          objectContaining(new BigNumber(mockedParams.repeatPeriodTime)),
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
      verify(mockedContract.blacklists).once();
      verify(
        mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).once();
    });
  });

  describe('addBlacklistTypeMulti', () => {
    test('should call addBlacklistTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const blacklistNames = ['Blacklist1', 'Blacklist2'];
      const expectedStartTime = new BigNumber(0);
      const expectedEndTime = new BigNumber(0);
      const expectedRepeatPeriodTime = new BigNumber(0);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedGetBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistsMethod));
      // Stub the request
      for (let i = 0; i < blacklistNames.length; i += 1) {
        when(mockedGetBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).thenResolve(
          expectedGetBlacklistResult,
        );
      }

      const mockedParams = {
        startTimes: [new Date(2030, 1), new Date(2030, 1)],
        endTimes: [new Date(2031, 1), new Date(2031, 1)],
        blacklistNames,
        repeatPeriodTimes: [366, 366],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addBlacklistTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.repeatPeriodTimes)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addNewBlacklistTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addBlacklistTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.repeatPeriodTimes)),
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
      verify(mockedContract.blacklists).times(blacklistNames.length);
      for (let i = 0; i < blacklistNames.length; i += 1) {
        verify(mockedGetBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).once();
      }
    });
  });

  describe('modifyBlacklistType', () => {
    test('should call modifyBlacklistType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const blacklistName = 'Blacklist1';
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];
      const mockedGetBlacklistParams = {
        blacklistName,
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetBlacklistMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistMethod));
      // Stub the request
      when(
        mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).thenResolve(expectedGetBlacklistResult);

      const mockedParams = {
        startTime: new Date(2030, 1),
        endTime: new Date(2031, 1),
        blacklistName,
        repeatPeriodTime: 366,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyBlacklistType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          objectContaining(new BigNumber(mockedParams.repeatPeriodTime)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyBlacklistType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyBlacklistType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          objectContaining(new BigNumber(mockedParams.repeatPeriodTime)),
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
      verify(mockedContract.blacklists).once();
      verify(
        mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).once();
    });
  });

  describe('modifyBlacklistTypeMulti', () => {
    test('should call modifyBlacklistTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const blacklistNames = ['Blacklist1', 'Blacklist2'];
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedGetBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistsMethod));
      // Stub the request
      for (let i = 0; i < blacklistNames.length; i += 1) {
        when(mockedGetBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).thenResolve(
          expectedGetBlacklistResult,
        );
      }

      const mockedParams = {
        startTimes: [new Date(2030, 1), new Date(2030, 1)],
        endTimes: [new Date(2031, 1), new Date(2031, 1)],
        blacklistNames,
        repeatPeriodTimes: [366, 366],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyBlacklistTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.repeatPeriodTimes)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyBlacklistTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyBlacklistTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
          objectContaining(numberArrayToBigNumberArray(mockedParams.repeatPeriodTimes)),
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
      verify(mockedContract.blacklists).times(blacklistNames.length);
      for (let i = 0; i < blacklistNames.length; i += 1) {
        verify(mockedGetBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).once();
      }
    });
  });

  describe('deleteBlacklistType', () => {
    test('should call deleteBlacklistType', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const blacklistName = 'Blacklist1';
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];
      const mockedGetBlacklistParams = {
        blacklistName,
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetBlacklistMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistMethod));
      // Stub the request
      when(
        mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).thenResolve(expectedGetBlacklistResult);

      const expectedGetListOfAddressesResult: string[] = [];

      // Mocked method
      const mockedGetListOfAddressesMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedGetListOfAddressesMethod));
      // Stub the request
      when(mockedGetListOfAddressesMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).thenResolve(
        expectedGetListOfAddressesResult,
      );

      const mockedParams = {
        blacklistName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteBlacklistType).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.deleteBlacklistType(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteBlacklistType).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
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
      verify(mockedContract.blacklists).once();
      verify(
        mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).once();
      verify(mockedContract.getListOfAddresses).once();
      // Stub the request
      verify(mockedGetListOfAddressesMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).once();
    });
  });

  describe('deleteBlacklistTypeMulti', () => {
    test('should call deleteBlacklistTypeMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const blacklistNames = ['Blacklist1', 'Blacklist2'];
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedGetBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistsMethod));
      // Stub the request
      for (let i = 0; i < blacklistNames.length; i += 1) {
        when(mockedGetBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).thenResolve(
          expectedGetBlacklistResult,
        );
      }

      const expectedGetListOfAddressesResult: string[] = [];

      // Mocked method
      const mockedGetListOfAddressesMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedGetListOfAddressesMethod));
      // Stub the request
      for (let i = 0; i < blacklistNames.length; i += 1) {
        when(
          mockedGetListOfAddressesMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i]))),
        ).thenResolve(expectedGetListOfAddressesResult);
      }

      const mockedParams = {
        startTimes: [new Date(2030, 1), new Date(2030, 1)],
        endTimes: [new Date(2031, 1), new Date(2031, 1)],
        blacklistNames,
        repeatPeriodTimes: [366, 366],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteBlacklistTypeMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.deleteBlacklistTypeMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteBlacklistTypeMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
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
      verify(mockedContract.blacklists).times(blacklistNames.length);
      for (let i = 0; i < blacklistNames.length; i += 1) {
        verify(mockedGetBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).once();
      }
      verify(mockedContract.getListOfAddresses).times(blacklistNames.length);
      // Stub the request
      for (let i = 0; i < blacklistNames.length; i += 1) {
        verify(mockedGetListOfAddressesMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).once();
      }
    });
  });

  describe('addInvestorToBlacklist', () => {
    test('should call addInvestorToBlacklist', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddress = '0x4444444444444444444444444444444444444444';
      const blacklistName = 'Blacklist1';
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedBlacklistsMethod));
      // Stub the request
      when(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).thenResolve(
        expectedGetBlacklistResult,
      );

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist2', 'Blacklist3']);
      const mockedGetBlacklistNamesToUserParams = {
        user: expectedBlacklistInvestorAddress,
      };
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request
      when(mockedGetBlacklistNamesToUserMethod.callAsync(mockedGetBlacklistNamesToUserParams.user)).thenResolve(
        expectedGetBlacklistNamesToUserResult,
      );

      const mockedParams = {
        userAddress: expectedBlacklistInvestorAddress,
        blacklistName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addInvestorToBlacklist).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addInvestorToBlacklist(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addInvestorToBlacklist).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddress,
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
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
      verify(mockedContract.blacklists).once();
      verify(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).once();
      verify(mockedContract.getBlacklistNamesToUser).once();
      verify(mockedGetBlacklistNamesToUserMethod.callAsync(mockedGetBlacklistNamesToUserParams.user)).once();
    });
  });

  describe('addInvestorToBlacklistMulti', () => {
    test('should call addInvestorToBlacklistMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddresses = [
        '0x0123456789012345678901234567890123456789',
        '0x2222222222222222222222222222222222222222',
        '0x9999999999999999999999999999999999999999',
      ];
      const blacklistName = 'Blacklist1';
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedBlacklistsMethod));

      when(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).thenResolve(
        expectedGetBlacklistResult,
      );

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist2', 'Blacklist3']);
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request

      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        when(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).thenResolve(
          expectedGetBlacklistNamesToUserResult,
        );
      }

      const mockedParams = {
        userAddresses: expectedBlacklistInvestorAddresses,
        blacklistName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addInvestorToBlacklistMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addInvestorToBlacklistMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addInvestorToBlacklistMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringToBytes32(mockedParams.blacklistName)),
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
      verify(mockedContract.blacklists).times(expectedBlacklistInvestorAddresses.length);
      verify(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).times(
        expectedBlacklistInvestorAddresses.length,
      );
      verify(mockedContract.getBlacklistNamesToUser).times(expectedBlacklistInvestorAddresses.length);
      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        verify(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).once();
      }
    });
  });

  describe('addMultiInvestorToBlacklistMulti', () => {
    test('should call addMultiInvestorToBlacklistMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddresses = [
        '0x0123456789012345678901234567890123456789',
        '0x2222222222222222222222222222222222222222',
        '0x9999999999999999999999999999999999999999',
      ];
      const blacklistNames = ['Blacklist1', 'Blacklist4', 'Blacklist5'];
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedBlacklistsMethod));
      for (let i = 0; i < blacklistNames.length; i += 1) {
        when(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).thenResolve(
            expectedGetBlacklistResult,
        );
      }

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist2', 'Blacklist3']);
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request

      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        when(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).thenResolve(
          expectedGetBlacklistNamesToUserResult,
        );
      }

      const mockedParams = {
        userAddresses: expectedBlacklistInvestorAddresses,
        blacklistNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addMultiInvestorToBlacklistMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addMultiInvestorToBlacklistMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addMultiInvestorToBlacklistMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.userAddresses,
          objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
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
      verify(mockedContract.blacklists).times(expectedBlacklistInvestorAddresses.length);
      for (let i = 0; i < blacklistNames.length; i += 1) {
        verify(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).once();
      }
      verify(mockedContract.getBlacklistNamesToUser).times(expectedBlacklistInvestorAddresses.length);
      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        verify(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).once();
      }
    });
  });

  describe('addInvestorToNewBlacklist', () => {
    test('should call addInvestorToNewBlacklist', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const investor = '0x9999999999999999999999999999999999999999';
      const blacklistName = 'Blacklist1';
      const expectedStartTime = new BigNumber(0);
      const expectedEndTime = new BigNumber(0);
      const expectedRepeatPeriodTime = new BigNumber(0);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];
      const mockedGetBlacklistParams = {
        blacklistName,
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

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Mocked method
      const mockedGetBlacklistMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedGetBlacklistMethod));
      // Stub the request
      when(
          mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).thenResolve(expectedGetBlacklistResult);

      const mockedParams = {
        startTime: new Date(2030, 1),
        endTime: new Date(2031, 1),
        blacklistName,
        repeatPeriodTime: 366,
        investor,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addInvestorToNewBlacklist).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
          mockedMethod.sendTransactionAsync(
              objectContaining(dateToBigNumber(mockedParams.startTime)),
              objectContaining(dateToBigNumber(mockedParams.endTime)),
              objectContaining(stringToBytes32(mockedParams.blacklistName)),
              objectContaining(new BigNumber(mockedParams.repeatPeriodTime)),
              mockedParams.investor,
              mockedParams.txData,
              mockedParams.safetyFactor,
          ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addInvestorToNewBlacklist(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addInvestorToNewBlacklist).once();
      verify(
          mockedMethod.sendTransactionAsync(
              objectContaining(dateToBigNumber(mockedParams.startTime)),
              objectContaining(dateToBigNumber(mockedParams.endTime)),
              objectContaining(stringToBytes32(mockedParams.blacklistName)),
              objectContaining(new BigNumber(mockedParams.repeatPeriodTime)),
              mockedParams.investor,
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
      verify(mockedContract.blacklists).once();
      verify(
          mockedGetBlacklistMethod.callAsync(objectContaining(stringToBytes32(mockedGetBlacklistParams.blacklistName))),
      ).once();
    });
  });


  describe('deleteInvestorFromBlacklist', () => {
    test('should call deleteInvestorFromBlacklist', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddress = '0x4444444444444444444444444444444444444444';
      const blacklistName = 'Blacklist1';
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedBlacklistsMethod));
      // Stub the request
      when(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).thenResolve(
          expectedGetBlacklistResult,
      );

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist1', 'Blacklist2']);
      const mockedGetBlacklistNamesToUserParams = {
        user: expectedBlacklistInvestorAddress,
      };
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request
      when(mockedGetBlacklistNamesToUserMethod.callAsync(mockedGetBlacklistNamesToUserParams.user)).thenResolve(
          expectedGetBlacklistNamesToUserResult,
      );

      const mockedParams = {
        userAddress: expectedBlacklistInvestorAddress,
        blacklistName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteInvestorFromBlacklist).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
          mockedMethod.sendTransactionAsync(
              mockedParams.userAddress,
              objectContaining(stringToBytes32(mockedParams.blacklistName)),
              mockedParams.txData,
              mockedParams.safetyFactor,
          ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.deleteInvestorFromBlacklist(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteInvestorFromBlacklist).once();
      verify(
          mockedMethod.sendTransactionAsync(
              mockedParams.userAddress,
              objectContaining(stringToBytes32(mockedParams.blacklistName)),
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
      verify(mockedContract.blacklists).once();
      verify(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistName)))).once();
      verify(mockedContract.getBlacklistNamesToUser).once();
      verify(mockedGetBlacklistNamesToUserMethod.callAsync(mockedGetBlacklistNamesToUserParams.user)).once();
    });
  });

  describe('deleteMultiInvestorsFromBlacklistMulti', () => {
    test('should call deleteMultiInvestorsFromBlacklistMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddresses = [
        '0x0123456789012345678901234567890123456789',
        '0x2222222222222222222222222222222222222222',
        '0x9999999999999999999999999999999999999999',
      ];
      const blacklistNames = ['Blacklist1', 'Blacklist2', 'Blacklist3'];
      const expectedStartTime = dateToBigNumber(new Date(2030, 1));
      const expectedEndTime = dateToBigNumber(new Date(2031, 1));
      const expectedRepeatPeriodTime = new BigNumber(366);
      const expectedGetBlacklistResult = [expectedStartTime, expectedEndTime, expectedRepeatPeriodTime];

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

      // Mocked method
      const mockedBlacklistsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.blacklists).thenReturn(instance(mockedBlacklistsMethod));
      for (let i = 0; i < blacklistNames.length; i += 1) {
        when(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).thenResolve(
            expectedGetBlacklistResult,
        );
      }

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist1','Blacklist2', 'Blacklist3']);
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request

      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        when(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).thenResolve(
            expectedGetBlacklistNamesToUserResult,
        );
      }

      const mockedParams = {
        userAddresses: expectedBlacklistInvestorAddresses,
        blacklistNames,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteMultiInvestorsFromBlacklistMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
          mockedMethod.sendTransactionAsync(
              mockedParams.userAddresses,
              objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
              mockedParams.txData,
              mockedParams.safetyFactor,
          ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.deleteMultiInvestorsFromBlacklistMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteMultiInvestorsFromBlacklistMulti).once();
      verify(
          mockedMethod.sendTransactionAsync(
              mockedParams.userAddresses,
              objectContaining(stringArrayToBytes32Array(mockedParams.blacklistNames)),
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
      verify(mockedContract.blacklists).times(expectedBlacklistInvestorAddresses.length);
      for (let i = 0; i < blacklistNames.length; i += 1) {
        verify(mockedBlacklistsMethod.callAsync(objectContaining(stringToBytes32(blacklistNames[i])))).once();
      }
      verify(mockedContract.getBlacklistNamesToUser).times(expectedBlacklistInvestorAddresses.length);
      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        verify(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).once();
      }
    });
  });

  describe('deleteInvestorFromAllBlacklist', () => {
    test('should call deleteInvestorFromBlacklist', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddress = '0x4444444444444444444444444444444444444444';

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

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist1', 'Blacklist2']);
      const mockedGetBlacklistNamesToUserParams = {
        user: expectedBlacklistInvestorAddress,
      };
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request
      when(mockedGetBlacklistNamesToUserMethod.callAsync(mockedGetBlacklistNamesToUserParams.user)).thenResolve(
          expectedGetBlacklistNamesToUserResult,
      );

      const mockedParams = {
        investor: expectedBlacklistInvestorAddress,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteInvestorFromAllBlacklist).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
          mockedMethod.sendTransactionAsync(
              mockedParams.investor,
              mockedParams.txData,
              mockedParams.safetyFactor,
          ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.deleteInvestorFromAllBlacklist(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteInvestorFromAllBlacklist).once();
      verify(
          mockedMethod.sendTransactionAsync(
              mockedParams.investor,
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
      verify(mockedContract.getBlacklistNamesToUser).once();
      verify(mockedGetBlacklistNamesToUserMethod.callAsync(mockedGetBlacklistNamesToUserParams.user)).once();
    });
  });

  describe('deleteInvestorsFromAllBlacklistMulti', () => {
    test('should call deleteInvestorsFromAllBlacklistMulti', async () => {
      const expectedOwnerResult = '0x8888888888888888888888888888888888888888';
      const expectedBlacklistInvestorAddresses = [
        '0x0123456789012345678901234567890123456789',
        '0x2222222222222222222222222222222222222222',
        '0x9999999999999999999999999999999999999999',
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

      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expectedGetBlacklistNamesToUserResult = stringArrayToBytes32Array(['Blacklist1','Blacklist2', 'Blacklist3']);
      // Mocked method
      const mockedGetBlacklistNamesToUserMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedGetBlacklistNamesToUserMethod));
      // Stub the request

      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        when(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).thenResolve(
            expectedGetBlacklistNamesToUserResult,
        );
      }

      const mockedParams = {
        investors: expectedBlacklistInvestorAddresses,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.deleteInvestorFromAllBlacklistMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
          mockedMethod.sendTransactionAsync(
              mockedParams.investors,
              mockedParams.txData,
              mockedParams.safetyFactor,
          ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.deleteInvestorFromAllBlacklistMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.deleteInvestorFromAllBlacklistMulti).once();
      verify(
          mockedMethod.sendTransactionAsync(
              mockedParams.investors,
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
      verify(mockedContract.getBlacklistNamesToUser).times(expectedBlacklistInvestorAddresses.length);
      for (let i = 0; i < expectedBlacklistInvestorAddresses.length; i += 1) {
        verify(mockedGetBlacklistNamesToUserMethod.callAsync(expectedBlacklistInvestorAddresses[i])).once();
      }
    });
  });

  describe('getListOfAddresses', () => {
    test.todo('should fail as blacklist name is an empty string');

    test('should call to getListOfAddresses', async () => {
      const expectedResult = [
        '0x8888888888888888888888888888888888888888',
        '0x9999999999999999999999999999999999999999',
      ];
      const mockedParams = {
        blacklistName: 'Blacklist1',
      };

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getListOfAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.blacklistName)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.getListOfAddresses(mockedParams);
      // Result expectation
      expect(result).toEqual(expectedResult);

      // Verifications
      verify(mockedContract.getListOfAddresses).once();
      verify(mockedMethod.callAsync(objectContaining(stringToBytes32(mockedParams.blacklistName)))).once();
    });
  });

  describe('getBlacklistNamesToUser', () => {
    test('should call to getBlacklistNamesToUser', async () => {
      const expectedResult = stringArrayToBytes32Array(['Blacklist1', 'Blacklist2']);
      const mockedParams = {
        user: '0x8888888888888888888888888888888888888888',
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getBlacklistNamesToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.user)).thenResolve(expectedResult);

      // Real call
      const result = await target.getBlacklistNamesToUser(mockedParams);
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));

      // Verifications
      verify(mockedContract.getBlacklistNamesToUser).once();
      verify(mockedMethod.callAsync(mockedParams.user)).once();
    });
  });

  describe('getAllBlacklists', () => {
    test('should call to getAllBlacklists', async () => {
      const expectedResult = stringArrayToBytes32Array(['Blacklist1', 'Blacklist2']);

      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllBlacklists).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllBlacklists();
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));

      // Verifications
      verify(mockedContract.getAllBlacklists).once();
      verify(mockedMethod.callAsync()).once();
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
});
