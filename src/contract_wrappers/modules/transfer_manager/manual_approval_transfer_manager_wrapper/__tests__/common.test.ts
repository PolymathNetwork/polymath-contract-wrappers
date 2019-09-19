// ManualApprovalTransferManager test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  ManualApprovalTransferManagerContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  PolyTokenEvents_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import ContractFactory from '../../../../../factories/contractFactory';
import ModuleWrapper from '../../../module_wrapper';
import {
  bigNumberToDate,
  bytes32ToString,
  dateArrayToBigNumberArray,
  dateToBigNumber,
  numberToBigNumber,
  stringArrayToBytes32Array,
  stringToBytes32,
  valueToWei,
  valueArrayToWeiArray,
  weiToValue,
} from '../../../../../utils/convert';
import ManualApprovarTransferManagerCommon from '../common';

describe('ManualApprovalTransferManagerWrapper', () => {
  let target: ManualApprovarTransferManagerCommon;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ManualApprovalTransferManagerContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ManualApprovalTransferManagerContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ManualApprovarTransferManagerCommon(
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
    test('should extend ManualApprovarTransferManagerCommon', async () => {
      expect(target instanceof ManualApprovarTransferManagerCommon).toBe(true);
    });
  });

  describe('Paused', () => {
    test('should get isPaused', async () => {
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

  describe('Pause/Unpause', () => {
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

  describe('Approvals', () => {
    test('should get approvals', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';

      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);

      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityDecimalsMethod));

      const expiryTime = new BigNumber(1893499200);
      // Address expected
      const expectedResult = [
        '0x4444444444444444444444444444444444444444',
        '0x2222222222222222222222222222222222222222',
        new BigNumber(10),
        expiryTime,
        'description',
      ];
      const params = {
        index: 3,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.approvals).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.index)))).thenResolve(expectedResult);

      // Real call
      const result = await target.approvals(params);
      // Result expectation
      expect(result.from).toEqual(expectedResult[0]);
      expect(result.to).toEqual(expectedResult[1]);
      expect(result.allowance).toEqual(valueToWei(expectedResult[2] as BigNumber, expectedDecimalsResult));
      expect(result.expiryTime).toEqual(bigNumberToDate(expiryTime));
      expect(result.description).toEqual(expectedResult[4]);
      // Verifications
      verify(mockedContract.approvals).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(params.index)))).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Add Manual Approval', () => {
    test('should addManualApproval', async () => {
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expiryTime = new BigNumber(1);
      const from = '0x4444444444444444444444444444444444444444';
      const to = '0x2222222222222222222222222222222222222222';
      const expectedGetApprovalDetailsResult = [new BigNumber(0), expiryTime, stringToBytes32('description')];
      // Mocked method
      const mockedGetApprovalDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedGetApprovalDetailsMethod));
      // Stub the request
      when(mockedGetApprovalDetailsMethod.callAsync(from, to)).thenResolve(expectedGetApprovalDetailsResult);

      const mockedParams = {
        from,
        to,
        allowance: new BigNumber(10),
        expiryTime: new Date(2032, 1),
        description: 'description',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addManualApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(valueToWei(mockedParams.allowance, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          objectContaining(stringToBytes32(mockedParams.description)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addManualApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addManualApproval).once();
      verify(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(valueToWei(mockedParams.allowance, expectedDecimalsResult)),
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          objectContaining(stringToBytes32(mockedParams.description)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getApprovalDetails).once();
      verify(mockedGetApprovalDetailsMethod.callAsync(from, to)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('Add Manual Approval Multi', () => {
    test('should addManualApprovalMulti', async () => {
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expiryTime = new BigNumber(1);
      const from = ['0x4444444444444444444444444444444444444444', '0x2222222222222222222222222222222222222222'];
      const to = ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'];
      const expectedGetApprovalDetailsResult = [new BigNumber(0), expiryTime, stringToBytes32('description')];
      // Mocked method
      const mockedGetApprovalDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedGetApprovalDetailsMethod));
      // Stub the request
      for (let i = 0; i < from.length; i += 1) {
        when(mockedGetApprovalDetailsMethod.callAsync(from[i], to[i])).thenResolve(expectedGetApprovalDetailsResult);
      }

      const mockedParams = {
        from,
        to,
        allowances: [new BigNumber(10), new BigNumber(20)],
        expiryTimes: [new Date(2032, 1), new Date(2033, 1)],
        descriptions: ['description', 'description2'],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addManualApprovalMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(valueArrayToWeiArray(mockedParams.allowances, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.expiryTimes)),
          objectContaining(stringArrayToBytes32Array(mockedParams.descriptions)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addManualApprovalMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addManualApprovalMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(valueArrayToWeiArray(mockedParams.allowances, expectedDecimalsResult)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.expiryTimes)),
          objectContaining(stringArrayToBytes32Array(mockedParams.descriptions)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(4);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getApprovalDetails).times(from.length);
      for (let i = 0; i < from.length; i += 1) {
        verify(mockedGetApprovalDetailsMethod.callAsync(from[i], to[i])).once();
      }
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).times(3);
      verify(mockedSecurityTokenContract.decimals).times(3);
    });
  });

  describe('Modify Manual Approval', () => {
    test('should modifyManualApproval', async () => {
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expiryTime = new BigNumber(1925035200);
      const from = '0x4444444444444444444444444444444444444444';
      const to = '0x2222222222222222222222222222222222222222';
      const expectedGetApprovalDetailsResult = [new BigNumber(100), expiryTime, stringToBytes32('description')];
      // Mocked method
      const mockedGetApprovalDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedGetApprovalDetailsMethod));
      // Stub the request
      when(mockedGetApprovalDetailsMethod.callAsync(from, to)).thenResolve(expectedGetApprovalDetailsResult);

      const mockedParams = {
        from,
        to,
        expiryTime: new Date(2032, 1),
        changeInAllowance: new BigNumber(5),
        description: 'description',
        increase: true,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyManualApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          objectContaining(valueToWei(mockedParams.changeInAllowance, expectedDecimalsResult)),
          objectContaining(stringToBytes32(mockedParams.description)),
          mockedParams.increase,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyManualApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyManualApproval).once();
      verify(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(dateToBigNumber(mockedParams.expiryTime)),
          objectContaining(valueToWei(mockedParams.changeInAllowance, expectedDecimalsResult)),
          objectContaining(stringToBytes32(mockedParams.description)),
          mockedParams.increase,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getApprovalDetails).once();
      verify(mockedGetApprovalDetailsMethod.callAsync(from, to)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('Modify Manual Approval Multi', () => {
    test('should modifyManualApprovalMulti', async () => {
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expiryTime = new BigNumber(1925035200);
      const from = ['0x4444444444444444444444444444444444444444', '0x2222222222222222222222222222222222222222'];
      const to = ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'];
      const expectedGetApprovalDetailsResult = [new BigNumber(100), expiryTime, stringToBytes32('description')];
      // Mocked method
      const mockedGetApprovalDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedGetApprovalDetailsMethod));
      for (let i = 0; i < from.length; i += 1) {
        when(mockedGetApprovalDetailsMethod.callAsync(from[i], to[i])).thenResolve(expectedGetApprovalDetailsResult);
      }

      const mockedParams = {
        from,
        to,
        expiryTimes: [new Date(2032, 1), new Date(2033, 1)],
        changedAllowances: [new BigNumber(5), new BigNumber(7)],
        descriptions: ['description4', 'description3'],
        increase: [true, false],
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyManualApprovalMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(dateArrayToBigNumberArray(mockedParams.expiryTimes)),
          objectContaining(valueArrayToWeiArray(mockedParams.changedAllowances, expectedDecimalsResult)),
          objectContaining(stringArrayToBytes32Array(mockedParams.descriptions)),
          mockedParams.increase,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyManualApprovalMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyManualApprovalMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          from,
          to,
          objectContaining(dateArrayToBigNumberArray(mockedParams.expiryTimes)),
          objectContaining(valueArrayToWeiArray(mockedParams.changedAllowances, expectedDecimalsResult)),
          objectContaining(stringArrayToBytes32Array(mockedParams.descriptions)),
          mockedParams.increase,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(4);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(4);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(4);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getApprovalDetails).times(from.length);
      for (let i = 0; i < from.length; i += 1) {
        verify(mockedGetApprovalDetailsMethod.callAsync(from[i], to[i])).once();
      }
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).times(3);
      verify(mockedSecurityTokenContract.decimals).times(3);
    });
  });

  describe('Revoke Manual Approval', () => {
    test('should revokeManualApproval', async () => {
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expiryTime = new BigNumber(1925035200);
      const from = '0x4444444444444444444444444444444444444444';
      const to = '0x2222222222222222222222222222222222222222';
      const expectedGetApprovalDetailsResult = [new BigNumber(100), expiryTime, stringToBytes32('description')];
      // Mocked method
      const mockedGetApprovalDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedGetApprovalDetailsMethod));
      // Stub the request
      when(mockedGetApprovalDetailsMethod.callAsync(from, to)).thenResolve(expectedGetApprovalDetailsResult);

      const mockedParams = {
        from,
        to,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.revokeManualApproval).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(from, to, mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.revokeManualApproval(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.revokeManualApproval).once();
      verify(mockedMethod.sendTransactionAsync(from, to, mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getApprovalDetails).once();
      verify(mockedGetApprovalDetailsMethod.callAsync(from, to)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Revoke Manual Approval Multi', () => {
    test('should revokeManualApprovalMulti', async () => {
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

      const expectedDecimalsResult = new BigNumber(18);
      const mockedSecurityTokenDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityTokenDecimalsMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const expiryTime = new BigNumber(1925035200);
      const from = ['0x4444444444444444444444444444444444444444', '0x2222222222222222222222222222222222222222'];
      const to = ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'];
      const expectedGetApprovalDetailsResult = [new BigNumber(100), expiryTime, stringToBytes32('description')];
      // Mocked method
      const mockedGetApprovalDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedGetApprovalDetailsMethod));
      for (let i = 0; i < from.length; i += 1) {
        when(mockedGetApprovalDetailsMethod.callAsync(from[i], to[i])).thenResolve(expectedGetApprovalDetailsResult);
      }

      const mockedParams = {
        from,
        to,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.revokeManualApprovalMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(from, to, mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.revokeManualApprovalMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.revokeManualApprovalMulti).once();
      verify(mockedMethod.sendTransactionAsync(from, to, mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).times(3);
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).times(3);
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).times(3);
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContract.getApprovalDetails).times(from.length);
      for (let i = 0; i < from.length; i += 1) {
        verify(mockedGetApprovalDetailsMethod.callAsync(from[i], to[i])).once();
      }
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).twice();
      verify(mockedSecurityTokenContract.decimals).twice();
    });
  });

  describe('Get Active Approvals To User', () => {
    test('should getActiveApprovalsToUser', async () => {
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

      const expiryTimes = [new BigNumber(1925035200), new BigNumber(1925035201)];
      const user = '0x4444444444444444444444444444444444444444';
      const descriptions = [stringToBytes32('description'), stringToBytes32('description')];
      const expectedResult = [
        ['0x4444444444444444444444444444444444444444', '0x2222222222222222222222222222222222222222'],
        ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'],
        [new BigNumber(100), new BigNumber(101)],
        expiryTimes,
        descriptions,
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getActiveApprovalsToUser).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(user)).thenResolve(expectedResult);

      const mockedParams = {
        user,
      };
      // Real call
      const result = await target.getActiveApprovalsToUser(mockedParams);
      // Result expectation
      for (let i = 0; i < expectedResult[0].length; i += 1) {
        expect(result[i].from).toEqual(expectedResult[0][i]);
        expect(result[i].to).toEqual(expectedResult[1][i]);
        expect(result[i].allowance).toEqual(weiToValue(expectedResult[2][i] as BigNumber, expectedDecimalsResult));
        expect(result[i].expiryTime).toEqual(bigNumberToDate(expiryTimes[i]));
        expect(result[i].description).toEqual(bytes32ToString(descriptions[i]));
      }

      // Verifications
      verify(mockedContract.getActiveApprovalsToUser).once();
      verify(mockedMethod.callAsync(user)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('Get Approval Details', () => {
    test('should getApprovalDetails', async () => {
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

      const expiryTime = new BigNumber(1925035200);
      const from = '0x4444444444444444444444444444444444444444';
      const to = '0x2222222222222222222222222222222222222222';
      const description = stringToBytes32('description');
      const expectedResult = [new BigNumber(100), expiryTime, description];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getApprovalDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(from, to)).thenResolve(expectedResult);

      const mockedParams = {
        from,
        to,
      };
      // Real call
      const result = await target.getApprovalDetails(mockedParams);
      // Result expectation
      expect(result.from).toEqual(from);
      expect(result.to).toEqual(to);
      expect(result.allowance).toEqual(weiToValue(expectedResult[0] as BigNumber, expectedDecimalsResult));
      expect(result.expiryTime).toEqual(bigNumberToDate(expiryTime));
      expect(result.description).toEqual(bytes32ToString(description));

      // Verifications
      verify(mockedContract.getApprovalDetails).once();
      verify(mockedMethod.callAsync(from, to)).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityTokenDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('GetTotalApprovalsLength', () => {
    test('should getTotalApprovalsLength', async () => {
      // Address expected
      const expectedResult = new BigNumber(20);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTotalApprovalsLength).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTotalApprovalsLength();
      // Result expectation
      expect(result).toBe(expectedResult.toNumber());
      // Verifications
      verify(mockedContract.getTotalApprovalsLength).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Get All Approvals', () => {
    test('should getAllApprovals', async () => {
      const expectedDecimalsResult = new BigNumber(18);
      // Security Token Address expected
      const expectedSecurityTokenAddress = '0x3333333333333333333333333333333333333333';

      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.securityToken).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync()).thenResolve(expectedSecurityTokenAddress);

      when(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityDecimalsMethod = mock(MockedCallMethod);
      when(mockedSecurityDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedSecurityTokenContract.decimals).thenReturn(instance(mockedSecurityDecimalsMethod));

      const expiryTimes = [new BigNumber(1925035200), new BigNumber(1925035201)];
      const descriptions = [stringToBytes32('description'), stringToBytes32('description')];
      const expectedResult = [
        ['0x4444444444444444444444444444444444444444', '0x2222222222222222222222222222222222222222'],
        ['0x3333333333333333333333333333333333333333', '0x5555555555555555555555555555555555555555'],
        [new BigNumber(100), new BigNumber(101)],
        expiryTimes,
        descriptions,
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getAllApprovals).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getAllApprovals();
      // Result expectation
      for (let i = 0; i < expectedResult[0].length; i += 1) {
        expect(result[i].from).toEqual(expectedResult[0][i]);
        expect(result[i].to).toEqual(expectedResult[1][i]);
        expect(result[i].allowance).toEqual(weiToValue(expectedResult[2][i] as BigNumber, expectedDecimalsResult));
        expect(result[i].expiryTime).toEqual(bigNumberToDate(expiryTimes[i]));
        expect(result[i].description).toEqual(bytes32ToString(descriptions[i]));
      }

      // Verifications
      verify(mockedContract.getAllApprovals).once();
      verify(mockedMethod.callAsync()).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedSecurityDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.decimals).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to ManualApprovalTransferManager', async () => {
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
          `Expected eventName to be one of: 'AddManualApproval', 'ModifyManualApproval', 'RevokeManualApproval', 'Pause', 'Unpause', encountered: Transfer`,
        ),
      );
    });
  });
});
