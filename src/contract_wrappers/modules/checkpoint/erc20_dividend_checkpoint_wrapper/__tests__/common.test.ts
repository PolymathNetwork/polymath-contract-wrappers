// ERC20DividendCheckpointWrapper test
import { mock, instance, reset, when, verify, objectContaining } from 'ts-mockito';
import {
  ERC20DividendCheckpointContract_3_0_0,
  ISecurityTokenContract_3_0_0,
  ERC20DetailedContract_3_0_0,
  BigNumber,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { getMockedPolyResponse, MockedCallMethod, MockedSendMethod } from '../../../../../test_utils/mocked_methods';
import ERC20DividendCheckpointCommon from '../common';
import ContractFactory from '../../../../../factories/contractFactory';
import { DividendCheckpointCommon } from '../../dividend_checkpoint_wrapper';
import { dateToBigNumber, stringToBytes32, valueToWei } from '../../../../../utils/convert';
import { ContractVersion } from '../../../../../types';

describe('ERC20 Dividend Checkpoint Common', () => {
  // we extend the class to be able to instance it, using the 3.0.0 ERC20DividendCheckpoint contract since it has all common functionality
  class FakeERC20DividendCheckpoint extends ERC20DividendCheckpointCommon {
    public contract: Promise<ERC20DividendCheckpointContract_3_0_0>;

    public contractVersion!: ContractVersion;

    public constructor(
      web3Wrapper: Web3Wrapper,
      contract: Promise<ERC20DividendCheckpointContract_3_0_0>,
      contractFactory: ContractFactory,
    ) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  let target: FakeERC20DividendCheckpoint;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DividendCheckpointContract_3_0_0;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: ISecurityTokenContract_3_0_0;
  let mockedERC20DetailedContract: ERC20DetailedContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DividendCheckpointContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(ISecurityTokenContract_3_0_0);
    mockedERC20DetailedContract = mock(ERC20DetailedContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeERC20DividendCheckpoint(
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
    reset(mockedERC20DetailedContract);
  });

  describe('Types', () => {
    test('should extend DividendCheckpoint', async () => {
      expect(target instanceof DividendCheckpointCommon).toBe(true);
    });
  });

  describe('DividendTokens', () => {
    test('should get dividendTokens', async () => {
      // Address expected
      const expectedResult = '0x2222222222222222222222222222222222222222';
      const mockedParams = {
        dividendIndex: 2,
      };
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.dividendTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.dividendIndex)))).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.dividendTokens(mockedParams);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.dividendTokens).once();
      verify(mockedMethod.callAsync(objectContaining(new BigNumber(mockedParams.dividendIndex)))).once();
    });
  });

  describe('Create Dividend', () => {
    test('should createDividend', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const token = '0x9999999999999999999999999999999999999999';

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

      const expectedBalanceOfResult = new BigNumber(100);
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).thenResolve(expectedBalanceOfResult);

      const expectedDividendContractAddress = '0x4444444444444444444444444444444444444444';
      when(mockedContract.address).thenReturn(expectedDividendContractAddress);

      const expectedAllowanceResult = new BigNumber(100);
      const mockedAllowanceMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.allowance).thenReturn(instance(mockedAllowanceMethod));
      when(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).thenResolve(
        expectedAllowanceResult,
      );

      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        amount: new BigNumber(10),
        token,
        name: 'Name',
        txData: {},
        safetyFactor: 10,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).times(2);
      verify(mockedERC20DetailedContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).once();
      verify(mockedERC20DetailedContract.allowance).once();
      verify(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).once();
      verify(mockedContractFactory.getERC20DetailedContract(token)).twice();
      verify(mockedERC20DetailedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.totalSupply).once();
    });
  });

  describe('Create Dividend with Checkpoint', () => {
    test('should createDividendWithCheckpoint', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const checkpointId = 2;
      const token = '0x9999999999999999999999999999999999999999';

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

      const expectedBalanceOfResult = new BigNumber(100);
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).thenResolve(expectedBalanceOfResult);

      const expectedDividendContractAddress = '0x4444444444444444444444444444444444444444';
      when(mockedContract.address).thenReturn(expectedDividendContractAddress);

      const expectedAllowanceResult = new BigNumber(100);
      const mockedAllowanceMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.allowance).thenReturn(instance(mockedAllowanceMethod));
      when(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).thenResolve(
        expectedAllowanceResult,
      );

      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

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
        amount: new BigNumber(10),
        token,
        name: 'Name',
        checkpointId,
        txData: {},
        safetyFactor: 10,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          objectContaining(new BigNumber(checkpointId)),
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          objectContaining(new BigNumber(checkpointId)),
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
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
      verify(mockedWrapper.getAvailableAddressesAsync()).times(2);
      verify(mockedERC20DetailedContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).once();
      verify(mockedERC20DetailedContract.allowance).once();
      verify(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).once();
      verify(mockedContractFactory.getERC20DetailedContract(token)).twice();
      verify(mockedERC20DetailedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync(objectContaining(new BigNumber(checkpointId)))).once();
      verify(mockedSecurityTokenContract.totalSupplyAt).once();
    });
  });

  describe('Create Dividend with Checkpoint and Exclusions', () => {
    test('should createDividendWithCheckpointAndExclusions', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x5555555555555555555555555555555555555555';
      const checkpointId = 2;
      const token = '0x9999999999999999999999999999999999999999';

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

      const expectedBalanceOfResult = new BigNumber(100);
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).thenResolve(expectedBalanceOfResult);

      const expectedDividendContractAddress = '0x4444444444444444444444444444444444444444';
      when(mockedContract.address).thenReturn(expectedDividendContractAddress);

      const expectedAllowanceResult = new BigNumber(100);
      const mockedAllowanceMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.allowance).thenReturn(instance(mockedAllowanceMethod));
      when(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).thenResolve(
        expectedAllowanceResult,
      );

      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

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
        amount: new BigNumber(10),
        token,
        name: 'Name',
        checkpointId,
        excluded: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        txData: {},
        safetyFactor: 10,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          objectContaining(new BigNumber(checkpointId)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          objectContaining(new BigNumber(checkpointId)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
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
      verify(mockedWrapper.getAvailableAddressesAsync()).times(2);
      verify(mockedERC20DetailedContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).once();
      verify(mockedERC20DetailedContract.allowance).once();
      verify(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).once();
      verify(mockedContractFactory.getERC20DetailedContract(token)).twice();
      verify(mockedERC20DetailedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
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
      const token = '0x9999999999999999999999999999999999999999';
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

      const expectedBalanceOfResult = new BigNumber(100);
      const mockedBalanceOfAddressMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.balanceOf).thenReturn(instance(mockedBalanceOfAddressMethod));
      when(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).thenResolve(expectedBalanceOfResult);

      const expectedDividendContractAddress = '0x4444444444444444444444444444444444444444';
      when(mockedContract.address).thenReturn(expectedDividendContractAddress);

      const expectedAllowanceResult = new BigNumber(100);
      const mockedAllowanceMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.allowance).thenReturn(instance(mockedAllowanceMethod));
      when(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).thenResolve(
        expectedAllowanceResult,
      );

      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      const expectedDecimalsResult = new BigNumber(18);
      const mockedDecimalsMethod = mock(MockedCallMethod);
      when(mockedERC20DetailedContract.decimals).thenReturn(instance(mockedDecimalsMethod));
      when(mockedDecimalsMethod.callAsync()).thenResolve(expectedDecimalsResult);
      when(mockedContractFactory.getERC20DetailedContract(token)).thenResolve(instance(mockedERC20DetailedContract));

      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      const mockedParams = {
        maturity: new Date(2030, 1),
        expiry: new Date(2035, 1),
        amount: new BigNumber(10),
        token,
        name: 'Name',
        checkpointId: undefined,
        excluded: ['0x9999999999999999999999999999999999999999', '0x8888888888888888888888888888888888888888'],
        txData: {},
        safetyFactor: 10,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
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
          mockedParams.token,
          objectContaining(valueToWei(mockedParams.amount, expectedDecimalsResult)),
          mockedParams.excluded,
          objectContaining(stringToBytes32(mockedParams.name)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedContract.securityToken).twice();
      verify(mockedGetSecurityTokenAddressMethod.callAsync()).twice();
      verify(mockedContractFactory.getSecurityTokenContract(expectedSecurityTokenAddress)).twice();
      verify(mockedWrapper.getAvailableAddressesAsync()).times(2);
      verify(mockedERC20DetailedContract.balanceOf).once();
      verify(mockedBalanceOfAddressMethod.callAsync(expectedOwnerResult)).once();
      verify(mockedERC20DetailedContract.allowance).once();
      verify(mockedAllowanceMethod.callAsync(expectedOwnerResult, expectedDividendContractAddress)).once();
      verify(mockedContractFactory.getERC20DetailedContract(token)).twice();
      verify(mockedERC20DetailedContract.decimals).once();
      verify(mockedDecimalsMethod.callAsync()).once();
      verify(mockedSecurityTokenTotalSupplyMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.totalSupply).once();
      function verifyBalanceOf(addr: string) {
        verify(mockedSecurityTokenBalanceOfMethod.callAsync(addr)).once();
      }
      when(mockedSecurityTokenContract.balanceOf).thenReturn(instance(mockedSecurityTokenBalanceOfMethod));
      excluded.map(verifyBalanceOf);
    });
  });
});
