// VolumeRestrictionTransferManagerWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { VolumeRestrictionTMContract, SecurityTokenContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../../test_utils/mocked_methods';
import { Features, RestrictionTypes } from '../../../../types';
import ContractWrapper from '../../../contract_wrapper';
import ModuleWrapper from '../../module_wrapper';
import ContractFactory from '../../../../factories/contractFactory';
import VolumeRestrictionTransferManagerWrapper from '../volume_restriction_transfer_manager_wrapper';
import {
  bigNumberToDate,
  numberToBigNumber,
  dateToBigNumber,
  dateArrayToBigNumberArray,
} from '../../../../utils/convert';

describe('VolumeRestrictionTransferManagerWrapper', () => {
  let target: VolumeRestrictionTransferManagerWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: VolumeRestrictionTMContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(VolumeRestrictionTMContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new VolumeRestrictionTransferManagerWrapper(
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

  describe('verifyTransfer', () => {
    test('should verify Transfer', async () => {
      const mockedParams = {
        from: '0x1111111111111111111111111111111111111111',
        to: '0x2222222222222222222222222222222222222222',
        amount: new BigNumber(10),
        data: 'Data',
        isTransfer: false,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.verifyTransfer).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(mockedParams.amount),
          mockedParams.data,
          mockedParams.isTransfer,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.verifyTransfer(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.verifyTransfer).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.from,
          mockedParams.to,
          objectContaining(mockedParams.amount),
          mockedParams.data,
          mockedParams.isTransfer,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('individualRestriction', () => {
    test('should get individualRestriction', async () => {
      const mockedParams = {
        holder: '0x1111111111111111111111111111111111111111',
      };
      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(5);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.individualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.holder)).thenResolve(expectedResult);

      // Real call
      const result = await target.individualRestriction(mockedParams);
      // Result expectation
      expect(result.allowedTokens).toEqual(allowedTokens);
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionTypes.Percentage);
      // Verifications
      verify(mockedContract.individualRestriction).once();
      verify(mockedMethod.callAsync(mockedParams.holder)).once();
    });
  });

  describe('defaultRestriction', () => {
    test('should get defaultRestriction', async () => {
      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(5);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.defaultRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.defaultRestriction();
      // Result expectation
      expect(result.allowedTokens).toEqual(allowedTokens);
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionTypes.Percentage);
      // Verifications
      verify(mockedContract.defaultRestriction).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('defaultDailyRestriction', () => {
    test('should get defaultDailyRestriction', async () => {
      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(5);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.defaultDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.defaultDailyRestriction();
      // Result expectation
      expect(result.allowedTokens).toEqual(allowedTokens);
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionTypes.Percentage);
      // Verifications
      verify(mockedContract.defaultDailyRestriction).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('exemptAddresses', () => {
    test('should get exemptAddresses', async () => {
      const mockedParams = {
        index: 1,
      };
      // Address expected
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.exemptAddresses).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).thenResolve(expectedResult);

      // Real call
      const result = await target.exemptAddresses(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.exemptAddresses).once();
      verify(mockedMethod.callAsync(objectContaining(numberToBigNumber(mockedParams.index)))).once();
    });
  });

  describe('individualDailyRestriction', () => {
    test('should get individualDailyRestriction', async () => {
      const mockedParams = {
        holder: '0x1111111111111111111111111111111111111111',
      };
      // Address expected
      const allowedTokens = new BigNumber(1);
      const startTime = new BigNumber(2);
      const rollingPeriodInDays = new BigNumber(3);
      const endTime = new BigNumber(4);
      const restrictionType = new BigNumber(5);
      const expectedResult = [allowedTokens, startTime, rollingPeriodInDays, endTime, restrictionType];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.individualDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(mockedParams.holder)).thenResolve(expectedResult);

      // Real call
      const result = await target.individualDailyRestriction(mockedParams);
      // Result expectation
      expect(result.allowedTokens).toEqual(allowedTokens);
      expect(result.startTime).toEqual(bigNumberToDate(startTime));
      expect(result.rollingPeriodInDays).toEqual(rollingPeriodInDays.toNumber());
      expect(result.endTime).toEqual(bigNumberToDate(endTime));
      expect(result.restrictionType).toEqual(RestrictionTypes.Percentage);
      // Verifications
      verify(mockedContract.individualDailyRestriction).once();
      verify(mockedMethod.callAsync(mockedParams.holder)).once();
    });
  });

  describe('changeExemptWalletList', () => {
    test('should changeExemptWalletList', async () => {
      const mockedParams = {
        wallet: '0x7777777777777777777777777777777777777777',
        change: true,
        txData: {},
        safetyFactor: 10,
      };

      const expectedExemptResult = [
        '0x2222222222222222222222222222222222222222',
        '0x2222222222222222222222222222222222222222',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedExemptMethod));
      when(mockedExemptMethod.callAsync()).thenResolve(expectedExemptResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeExemptWalletList).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.change,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeExemptWalletList(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddress).once();
      verify(mockedExemptMethod.callAsync()).once();
      verify(mockedContract.changeExemptWalletList).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.wallet,
          mockedParams.change,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('addIndividualRestriction', () => {
    test('should addIndividualRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 1;
      const mockedParams = {
        rollingPeriodInDays: 1,
        holder: '0x7777777777777777777777777777777777777777',
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedExemptResult = [
        '0x7777777777777777777777777777777777777777',
        '0x2222222222222222222222222222222222222222',
      ];
      const mockedExemptMethod = mock(MockedCallMethod);
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedExemptMethod));
      when(mockedExemptMethod.callAsync()).thenResolve(expectedExemptResult);

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddress).once();
      verify(mockedExemptMethod.callAsync()).once();
      verify(mockedContract.addIndividualRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
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
    });
  });

  describe('addIndividualDailyRestriction', () => {
    test('should addIndividualDailyRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 1;
      const mockedParams = {
        rollingPeriodInDays: 1,
        holder: '0x7777777777777777777777777777777777777777',
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addIndividualDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holder,
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
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
    });
  });

  describe('addIndividualDailyRestrictionMulti', () => {
    test('should addIndividualDailyRestrictionMulti', async () => {
      const allowedTokens = [new BigNumber(0), new BigNumber(0)];
      const startTimes = [new Date(2020, 1), new Date(2020, 2)];
      const endTimes = [new Date(2021, 1), new Date(2021, 2)];
      const restrictionTypes = [1, 1];
      const mockedParams = {
        holders: ['0x7777777777777777777777777777777777777777', '0x8888888888888888888888888888888888888888'],
        allowedTokens,
        startTimes,
        endTimes,
        restrictionTypes,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addIndividualDailyRestrictionMulti).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          mockedParams.allowedTokens,
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addIndividualDailyRestrictionMulti(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addIndividualDailyRestrictionMulti).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.holders,
          mockedParams.allowedTokens,
          objectContaining(dateArrayToBigNumberArray(mockedParams.startTimes)),
          objectContaining(dateArrayToBigNumberArray(mockedParams.endTimes)),
          mockedParams.restrictionTypes,
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
    });
  });

  describe('addDefaultRestriction', () => {
    test('should addDefaultRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 1;
      const mockedParams = {
        rollingPeriodInDays: 1,
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addDefaultRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addDefaultRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addDefaultRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(numberToBigNumber(mockedParams.rollingPeriodInDays)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
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
    });
  });

  describe('addDefaultDailyRestriction', () => {
    test('should addDefaultDailyRestriction', async () => {
      const allowedTokens = new BigNumber(1);
      const startTime = new Date(2020, 1);
      const endTime = new Date(2021, 1);
      const restrictionType = 1;
      const mockedParams = {
        allowedTokens,
        startTime,
        endTime,
        restrictionType,
        txData: {},
        safetyFactor: 10,
      };

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.addDefaultDailyRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.addDefaultDailyRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.addDefaultDailyRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.allowedTokens,
          objectContaining(dateToBigNumber(mockedParams.startTime)),
          objectContaining(dateToBigNumber(mockedParams.endTime)),
          mockedParams.restrictionType,
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
    });
  });

  describe('removeIndividualRestriction', () => {
    test('should removeIndividualRestriction', async () => {
      const mockedParams = {
        holder: '0x5555555555555555555555555555555555555555',
        txData: {},
        safetyFactor: 10,
      };

      const expectedIndividualResult = [
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
        new BigNumber(1),
      ];
      const mockedIndividualMethod = mock(MockedCallMethod);
      when(mockedContract.individualRestriction).thenReturn(instance(mockedIndividualMethod));
      when(mockedIndividualMethod.callAsync(mockedParams.holder)).thenResolve(expectedIndividualResult);

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

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeIndividualRestriction).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.holder, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeIndividualRestriction(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.individualRestriction).once();
      verify(mockedIndividualMethod.callAsync(mockedParams.holder)).once();
      verify(mockedContract.removeIndividualRestriction).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.holder, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).once();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('getExemptAddress', () => {
    test('should getExemptAddress', async () => {
      // Address expected
      const expectedResult = [
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
      ];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getExemptAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getExemptAddress();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExemptAddress).once();
      verify(mockedMethod.callAsync()).once();
    });
  });
});
