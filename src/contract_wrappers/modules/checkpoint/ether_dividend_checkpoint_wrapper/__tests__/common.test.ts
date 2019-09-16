// EtherDividendCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  EtherDividendCheckpointContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import EtherDividendCheckpointCommon from '../common';
import ContractFactory from '../../../../../factories/contractFactory';
import { DividendCheckpointCommon } from '../../dividend_checkpoint_wrapper';
import { dateToBigNumber, stringToBytes32, valueToWei } from '../../../../../utils/convert';

describe('EtherDividendCheckpointWrapper', () => {
  // EtherDividend Wrapper is used as contract target here as DividendCheckpoint is abstract
  let target: EtherDividendCheckpointCommon;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: EtherDividendCheckpointContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(EtherDividendCheckpointContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new EtherDividendCheckpointCommon(
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
    test('should extend DividendCheckpoint', async () => {
      expect(target instanceof DividendCheckpointCommon).toBe(true);
    });
  });
  describe('Create Dividend', () => {
    test('should createDividend', async () => {
      const expectedDecimalsResult = new BigNumber(18);
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

      const expectedTotalSupplyResult = new BigNumber(1000);
      const mockedSecurityTokenTotalSupplyMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenTotalSupplyMethod.callAsync()).thenResolve(expectedTotalSupplyResult);
      when(mockedSecurityTokenContract.totalSupply).thenReturn(instance(mockedSecurityTokenTotalSupplyMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      when(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).thenResolve(new BigNumber(200));

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividend).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividend(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividend).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
      verify(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.totalSupply).once();
    });
  });

  describe('Create Dividend with Checkpoint', () => {
    test('should createDividendWithCheckpoint', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const checkpointId = 2;
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
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      const expectedTotalSupplyResult = new BigNumber(1000);
      const mockedSecurityTokenTotalSupplyMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenTotalSupplyMethod.callAsync(objectContaining(new BigNumber(checkpointId)))).thenResolve(
        expectedTotalSupplyResult,
      );
      when(mockedSecurityTokenContract.totalSupplyAt).thenReturn(instance(mockedSecurityTokenTotalSupplyMethod));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      when(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).thenResolve(new BigNumber(200));

      // Mock security token currentCheckpointId
      const expectedCurrentCheckpointResult = new BigNumber(checkpointId + 1);
      // Mocked method
      const mockedCurrentCheckpointMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedSecurityTokenContract.currentCheckpointId).thenReturn(instance(mockedCurrentCheckpointMethod));
      // Stub the request
      when(mockedCurrentCheckpointMethod.callAsync()).thenResolve(expectedCurrentCheckpointResult);

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        checkpointId,
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividendWithCheckpoint).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividendWithCheckpoint(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividendWithCheckpoint).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedCurrentCheckpointMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.currentCheckpointId).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
      verify(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync(objectContaining(new BigNumber(checkpointId)))).once();
      verify(mockedSecurityTokenContract.totalSupplyAt).once();
    });
  });

  describe('Create Dividend with Checkpoint and Exclusions', () => {
    test('should createDividendWithCheckpointAndExclusions', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const checkpointId = 2;
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
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      const excluded = ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'];
      const expectedTotalSupplyResult = new BigNumber(1000);
      const mockedSecurityTokenTotalSupplyMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenTotalSupplyMethod.callAsync(objectContaining(new BigNumber(checkpointId)))).thenResolve(
        expectedTotalSupplyResult,
      );
      when(mockedSecurityTokenContract.totalSupplyAt).thenReturn(instance(mockedSecurityTokenTotalSupplyMethod));

      const expectedSecurityTokenBalanceOfResult = new BigNumber(10);
      const mockedSecurityTokenBalanceOfMethod = mock(MockedCallMethod);
      function whenBalanceOf(addr: string) {
        when(
          mockedSecurityTokenBalanceOfMethod.callAsync(addr, objectContaining(new BigNumber(checkpointId))),
        ).thenResolve(expectedSecurityTokenBalanceOfResult);
      }
      when(mockedSecurityTokenContract.balanceOfAt).thenReturn(instance(mockedSecurityTokenBalanceOfMethod));
      excluded.map(whenBalanceOf);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      when(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).thenResolve(new BigNumber(200));

      // Mock security token currentCheckpointId
      const expectedCurrentCheckpointResult = new BigNumber(checkpointId + 1);
      // Mocked method
      const mockedCurrentCheckpointMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedSecurityTokenContract.currentCheckpointId).thenReturn(instance(mockedCurrentCheckpointMethod));
      // Stub the request
      when(mockedCurrentCheckpointMethod.callAsync()).thenResolve(expectedCurrentCheckpointResult);

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        checkpointId,
        excluded: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividendWithCheckpointAndExclusions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividendWithCheckpointAndExclusions(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividendWithCheckpointAndExclusions).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          objectContaining(new BigNumber(checkpointId)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedCurrentCheckpointMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.currentCheckpointId).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
      verify(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync(objectContaining(new BigNumber(checkpointId)))).once();
      verify(mockedSecurityTokenContract.totalSupplyAt).once();
      function verifyBalanceOf(addr: string) {
        verify(
          mockedSecurityTokenBalanceOfMethod.callAsync(addr, objectContaining(new BigNumber(checkpointId))),
        ).once();
      }
      excluded.map(verifyBalanceOf);
      verify(mockedSecurityTokenContract.balanceOfAt).times(excluded.length);
    });
  });

  describe('Create Dividend with Exclusions', () => {
    test('should createDividendWithExclusions', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
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
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      const excluded = ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'];
      const expectedTotalSupplyResult = new BigNumber(1000);
      const mockedSecurityTokenTotalSupplyMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenTotalSupplyMethod.callAsync()).thenResolve(expectedTotalSupplyResult);
      when(mockedSecurityTokenContract.totalSupply).thenReturn(instance(mockedSecurityTokenTotalSupplyMethod));

      const expectedSecurityTokenBalanceOfResult = new BigNumber(10);
      const mockedSecurityTokenBalanceOfMethod = mock(MockedCallMethod);
      function whenBalanceOf(addr: string) {
        when(mockedSecurityTokenBalanceOfMethod.callAsync(addr)).thenResolve(expectedSecurityTokenBalanceOfResult);
      }
      when(mockedSecurityTokenContract.balanceOf).thenReturn(instance(mockedSecurityTokenBalanceOfMethod));
      excluded.map(whenBalanceOf);

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      when(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).thenResolve(new BigNumber(200));

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        name: 'Name',
        checkpointId: undefined,
        excluded: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        value: new BigNumber(100),
        txData: {},
        safetyFactor: 10,
      };
      const txPayableData = {
        ...{},
        value: valueToWei(mockedParams.value, expectedDecimalsResult),
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.createDividendWithExclusions).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.createDividendWithExclusions(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.createDividendWithExclusions).once();
      verify(
        mockedMethod.sendTransactionAsync(
          objectContaining(dateToBigNumber(mockedParams.maturity)),
          objectContaining(dateToBigNumber(mockedParams.expiry)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          objectContaining(txPayableData),
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
      verify(mockedWrapper.getBalanceInWeiAsync(expectedOwnerResult)).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.totalSupply).once();
      function verifyBalanceOf(addr: string) {
        verify(mockedSecurityTokenBalanceOfMethod.callAsync(addr)).once();
      }
      verify(mockedSecurityTokenContract.balanceOf).times(excluded.length);
      excluded.map(verifyBalanceOf);
    });
  });  
});
