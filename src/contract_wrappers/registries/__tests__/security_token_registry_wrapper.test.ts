// SecurityTokenRegistryWrapper test
import { instance, mock, reset, verify, when, objectContaining } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import {
  SecurityTokenRegistryContract,
  PolyTokenEvents,
  SecurityTokenContract,
  PolyTokenContract,
} from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../../contract_wrapper';
import SecurityTokenRegistryWrapper from '../security_token_registry_wrapper';
import ContractFactory from '../../../factories/contractFactory';
import {
  dateToBigNumber,
  bytes32ArrayToStringArray,
  stringArrayToBytes32Array,
  weiToValue,
  valueToWei,
} from '../../../utils/convert';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';
import { FULL_DECIMALS } from '../../../types';

describe('SecurityTokenRegistryWrapper', () => {
  let target: SecurityTokenRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: SecurityTokenRegistryContract;
  let mockedContractFactory: ContractFactory;
  let mockedSecurityTokenContract: SecurityTokenContract;
  let mockedPolyTokenContract: PolyTokenContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(SecurityTokenRegistryContract);
    mockedContractFactory = mock(ContractFactory);
    mockedSecurityTokenContract = mock(SecurityTokenContract);
    mockedPolyTokenContract = mock(PolyTokenContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new SecurityTokenRegistryWrapper(
      instance(mockedWrapper),
      myContractPromise,
      instance(mockedContractFactory),
    );
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedSecurityTokenContract);
    reset(mockedPolyTokenContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('Pause/Unpause', () => {
    test('should call to pause', async () => {
      // Pause Result expected
      const expectedPauseResult = false;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

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
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.isPaused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should call to unpause', async () => {
      // Pause Result expected
      const expectedPauseResult = true;
      // Mocked method
      const mockedPauseMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedPauseMethod));
      // Stub the request
      when(mockedPauseMethod.callAsync()).thenResolve(expectedPauseResult);

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

      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.isPaused).once();
      verify(mockedPauseMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should call to isPaused', async () => {
      // Address expected
      const expectedResult = false;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isPaused).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.isPaused();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isPaused).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('Ownership', () => {
    test.todo('should fail as newOwner is not an Eth address');

    test('should call to transfer ownership', async () => {
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
      const newOwner = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        newOwner,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferOwnership).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.sendTransactionAsync(newOwner, mockedParams.txData, mockedParams.safetyFactor)).thenResolve(
        expectedResult,
      );

      // Real call
      const result = await target.transferOwnership(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferOwnership).once();
      verify(mockedMethod.sendTransactionAsync(newOwner, mockedParams.txData, mockedParams.safetyFactor)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should call owner', async () => {
      // Address expected
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

  describe('ReclaimERC20', () => {
    test.todo('should fail as tokenContract is not an Eth address');

    test('should call to reclaim ERC20 tokens', async () => {
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
      // Params and result expected
      const tokenContract = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        tokenContract,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.reclaimERC20).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.tokenContract, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.reclaimERC20(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.reclaimERC20).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.tokenContract, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('GetTickersByOwner', () => {
    test.todo('should call getTickersByOwner with default owner address');

    test('should call getTickersByOwner with given owner address', async () => {
      // Params and result expected
      const expectedTickers = ['TICK1', 'TICK2'];
      const expectedResult = stringArrayToBytes32Array(expectedTickers);
      const ownerAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickersByOwner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ownerAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTickersByOwner({ owner: ownerAddress });
      // Result expectation
      expect(result).toEqual(bytes32ArrayToStringArray(expectedResult));
      // Verifications
      verify(mockedContract.getTickersByOwner).once();
      verify(mockedMethod.callAsync(ownerAddress)).once();
    });
  });

  describe('GetSecurityTokenData', () => {
    test.todo('should fail as securityTokenAddress is not an Eth address');

    test('should call getSecurityTokenData', async () => {
      // Params and result expected
      const expectedDeployedDate = new Date(2019, 1);
      const expectedResult = [
        'TICK',
        '0x0123456789012345678901234567890123456789',
        'Details',
        dateToBigNumber(expectedDeployedDate),
      ];
      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSecurityTokenData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(securityTokenAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getSecurityTokenData({ securityTokenAddress });
      // Result expectation
      expect(result.ticker).toBe(expectedResult[0]);
      expect(result.owner).toBe(expectedResult[1]);
      expect(result.tokenDetails).toBe(expectedResult[2]);
      expect(result.deployedAt).toEqual(expectedDeployedDate);
      // Verifications
      verify(mockedContract.getSecurityTokenData).once();
      verify(mockedMethod.callAsync(securityTokenAddress)).once();
    });
  });

  describe('GetTokensByOwner', () => {
    test.todo('should call getTokensByOwner with default owner address');

    test('should call getTokensByOwner', async () => {
      // Address expected
      const expectedResult = [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
      ];
      const ownerAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTokensByOwner).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ownerAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokensByOwner({ owner: ownerAddress });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTokensByOwner).once();
      verify(mockedMethod.callAsync(ownerAddress)).once();
    });
  });

  describe('GetTickerDetails', () => {
    test('should call getTickerDetails', async () => {
      const expectedRegistrationDate = new Date(2019, 1);
      const expectedexpiryDate = new Date(2020, 1);
      const expectedResult = [
        '0x0123456789012345678901234567890123456789',
        dateToBigNumber(expectedRegistrationDate),
        dateToBigNumber(expectedexpiryDate),
        'tokenName',
        true,
      ];

      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedResult);

      // Real call
      const result = await target.getTickerDetails({ tokenName: ticker });
      // Result expectation
      expect(result.owner).toBe(expectedResult[0]);
      expect(result.registrationDate).toEqual(expectedRegistrationDate);
      expect(result.expiryDate).toEqual(expectedexpiryDate);
      expect(result.tokenName).toBe(expectedResult[3]);
      expect(result.status).toBe(expectedResult[4]);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });
  });

  describe('GetTickerRegistrationFee', () => {
    test('should call getTickerRegistrationFee', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerRegistrationFee).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getTickerRegistrationFee();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.getTickerRegistrationFee).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('RegisterTicker', () => {
    test.todo('should fail as given owner is not an Eth address');

    test.todo('should fail as default owner is not an Eth address');

    test.todo('should call to registerTicker with default owner');

    test('should call to registerTicker with given owner', async () => {
      const ticker = 'TICK';
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      // Get Ticker Details
      const expectedTickerDetailsResult = ['', new BigNumber(0), new BigNumber(0), '', false];
      const mockedGetTickerDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedGetTickerDetailsMethod));
      when(mockedGetTickerDetailsMethod.callAsync(ticker)).thenResolve(expectedTickerDetailsResult);

      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get ticker registration fee
      const expectedTickerRegistrationFeeResult = valueToWei(new BigNumber(10), FULL_DECIMALS);
      const mockedTickerRegistrationFeeMethod = mock(MockedCallMethod);
      when(mockedContract.getTickerRegistrationFee).thenReturn(instance(mockedTickerRegistrationFeeMethod));
      when(mockedTickerRegistrationFeeMethod.callAsync()).thenResolve(expectedTickerRegistrationFeeResult);

      // Get Poly Balance
      const polyBalance = valueToWei(new BigNumber(100), FULL_DECIMALS);
      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedPolyTokenBalanceOfMethod = mock(MockedCallMethod);
      when(mockedPolyTokenBalanceOfMethod.callAsync(expectedOwnerResult)).thenResolve(polyBalance);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedPolyTokenBalanceOfMethod));

      const owner = '0x0123456789012345678901234567890123456789';
      const tokenName = 'TICKER';
      const mockedParams = {
        owner,
        ticker,
        tokenName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      const mockedMethod = mock(MockedSendMethod);
      when(mockedContract.registerTicker).thenReturn(instance(mockedMethod));

      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.tokenName,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.registerTicker(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.registerTicker).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.tokenName,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.getTickerDetails).once();
      verify(mockedGetTickerDetailsMethod.callAsync(ticker)).once();
      verify(mockedContract.getTickerRegistrationFee).once();
      verify(mockedTickerRegistrationFeeMethod.callAsync()).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedPolyTokenBalanceOfMethod.callAsync(expectedOwnerResult)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
      verify(mockedContractFactory.getPolyTokenContract()).once();
    });
  });

  describe('TransferTickerOwnership', () => {
    test.todo('should fail as newOwner is not an Eth address');

    test('should call to transferTickerOwnership', async () => {
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const securityTokenAddress = '0x5555555555555555555555555555555555555555';
      const newOwner = '0x2222222222222222222222222222222222222222';
      const ticker = 'TICK';

      // Setup get Security Token Address
      const mockedGetSecurityTokenAddressMethod = mock(MockedCallMethod);
      when(mockedContract.getSecurityTokenAddress).thenReturn(instance(mockedGetSecurityTokenAddressMethod));
      when(mockedGetSecurityTokenAddressMethod.callAsync(ticker)).thenResolve(securityTokenAddress);

      // Setup mocked owner from security token registry with expectedTickerDetailsResult status = true
      when(mockedContractFactory.getSecurityTokenContract(securityTokenAddress)).thenResolve(
        instance(mockedSecurityTokenContract),
      );
      const mockedSecurityTokenOwnerMethod = mock(MockedCallMethod);
      when(mockedSecurityTokenOwnerMethod.callAsync()).thenResolve(newOwner);
      when(mockedSecurityTokenContract.owner).thenReturn(instance(mockedSecurityTokenOwnerMethod));

      const expectedTickerDetailsResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1735689600),
        new BigNumber(1735689605),
        'ticker',
        true,
      ];
      // Mocked method
      const mockedGetTickerDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedGetTickerDetailsMethod));
      // Stub the request
      when(mockedGetTickerDetailsMethod.callAsync(ticker)).thenResolve(expectedTickerDetailsResult);
      // Mock web3 wrapper
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      const mockedParams = {
        newOwner,
        ticker,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.transferTickerOwnership).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.newOwner,
          mockedParams.ticker,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.transferTickerOwnership(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.transferTickerOwnership).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.newOwner,
          mockedParams.ticker,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.getTickerDetails).once();
      verify(mockedGetTickerDetailsMethod.callAsync(ticker)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedContract.getSecurityTokenAddress).once();
      verify(mockedGetSecurityTokenAddressMethod.callAsync(ticker)).once();
      verify(mockedContractFactory.getSecurityTokenContract(securityTokenAddress)).once();
      verify(mockedSecurityTokenOwnerMethod.callAsync()).once();
      verify(mockedSecurityTokenContract.owner).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
    });
  });

  describe('GenerateSecurityToken', () => {
    test('should call to GenerateSecurityToken', async () => {
      const ticker = 'TICK';
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);

      const expectedTickerDetailsResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1735689600),
        new BigNumber(1735689605),
        'ticker',
        false,
      ];

      const mockedGetTickerDetailsMethod = mock(MockedCallMethod);
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedGetTickerDetailsMethod));
      when(mockedGetTickerDetailsMethod.callAsync(ticker)).thenResolve(expectedTickerDetailsResult);

      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);

      // Get Security token launch fee
      const expectedLaunchFeeResult = valueToWei(new BigNumber(10), FULL_DECIMALS);
      const mockedLaunchFeeMethod = mock(MockedCallMethod);
      when(mockedContract.getSecurityTokenLaunchFee).thenReturn(instance(mockedLaunchFeeMethod));
      when(mockedLaunchFeeMethod.callAsync()).thenResolve(expectedLaunchFeeResult);

      // Get ERC20 Allowance
      const erc20Allowance = valueToWei(new BigNumber(100), FULL_DECIMALS);
      when(mockedContractFactory.getPolyTokenContract()).thenResolve(instance(mockedPolyTokenContract));
      const mockedPolyTokenBalanceOfMethod = mock(MockedCallMethod);
      when(mockedPolyTokenBalanceOfMethod.callAsync(expectedOwnerResult)).thenResolve(erc20Allowance);
      when(mockedPolyTokenContract.balanceOf).thenReturn(instance(mockedPolyTokenBalanceOfMethod));

      const name = 'Security';
      const details = 'Token Details';
      const divisible = true;
      const mockedParams = {
        name,
        ticker,
        details,
        divisible,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.generateSecurityToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          mockedParams.ticker,
          mockedParams.details,
          mockedParams.divisible,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.generateSecurityToken(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.generateSecurityToken).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          mockedParams.ticker,
          mockedParams.details,
          mockedParams.divisible,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.getTickerDetails).once();
      verify(mockedGetTickerDetailsMethod.callAsync(ticker)).once();
      verify(mockedContract.getSecurityTokenLaunchFee).once();
      verify(mockedLaunchFeeMethod.callAsync()).once();
      verify(mockedPolyTokenBalanceOfMethod.callAsync(expectedOwnerResult)).once();
      verify(mockedPolyTokenContract.balanceOf).once();
      verify(mockedContractFactory.getPolyTokenContract()).twice();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).twice();
    });
  });

  describe('GetSecurityTokenLaunchFee', () => {
    test('should call to getSecurityTokenLaunchFee', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSecurityTokenLaunchFee).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getSecurityTokenLaunchFee();
      // Result expectation
      expect(result).toEqual(weiToValue(expectedResult, FULL_DECIMALS));
      // Verifications
      verify(mockedContract.getSecurityTokenLaunchFee).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetSecurityTokenAddress', () => {
    test('should call to getSecurityTokenAddress', async () => {
      // Expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSecurityTokenAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedResult);

      // Real call
      const result = await target.getSecurityTokenAddress(ticker);
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getSecurityTokenAddress).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });
  });

  describe('IsTickerAvailable', () => {
    test('should return false as ticker is registered and deployed', async () => {
      const expectedResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1),
        new BigNumber(1),
        'tokenName',
        true,
      ];
      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedResult);

      // Real call
      const result = await target.isTickerAvailable({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(false);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });

    test.todo('should return false as ticker is registered and not expired');

    test('should return true as ticker is not registered', async () => {
      const expectedResult = ['', new BigNumber(0), new BigNumber(0), '', false];
      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedResult);

      // Real call
      const result = await target.isTickerAvailable({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(true);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });

    test.todo('should return true as ticker is registered and not deployed but it is expired');
  });

  describe('IsTickerRegisteredByCurrentIssuer', () => {
    test('should call to getTickerDetails and return true', async () => {
      const ownerAddress = '0x0123456789012345678901234567890123456789';
      const expectedResult = [ownerAddress, new BigNumber(1), new BigNumber(1), 'tokenName', true];
      const tokenName = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      const expectedAddrResult = [ownerAddress];

      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve(expectedAddrResult);

      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(tokenName)).thenResolve(expectedResult);
      // Real call
      const result = await target.isTickerRegisteredByCurrentIssuer({ tokenName });
      // Result expectation
      expect(result).toEqual(true);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(tokenName)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test.todo('should return false as ticker is not registered');

    test.todo('should return false as ticker is registered and not deployed but it is expired');

    test.todo('should return false as ticker is registered and deployed');

    test('should return false as ticker is registered by a different owner', async () => {
      const ownerAddress = '0x0123456789012345678901234567890123456789';
      const expectedResult = [ownerAddress, new BigNumber(1), new BigNumber(1), 'tokenName', true];
      const tokenName = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      const expectedAddrResult = ['0x1111111111111111111111111111111111111111'];

      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve(expectedAddrResult);

      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(tokenName)).thenResolve(expectedResult);
      // Real call
      const result = await target.isTickerRegisteredByCurrentIssuer({ tokenName });
      // Result expectation
      expect(result).toEqual(false);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(tokenName)).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('IsTokenLaunched', () => {
    test('should call to getTickerDetails and return true as token is deployed', async () => {
      const expectedSCResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1),
        new BigNumber(1),
        'tokenName',
        true,
      ];
      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.isTokenLaunched({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(true);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });

    test('should call to getTickerDetails and return false as token is not deployed', async () => {
      const expectedSCResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1),
        new BigNumber(1),
        'tokenName',
        false,
      ];
      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.isTokenLaunched({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(false);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });
  });

  describe('RemoveTicker', () => {
    test('should call to remove ticker', async () => {
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
      const ticker = 'TICK';
      const expectedTickerDetailsResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1735689600),
        new BigNumber(1735689605),
        'ticker',
        false,
      ];
      // Mocked method
      const mockedGetTickerDetailsMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedGetTickerDetailsMethod));
      // Stub the request
      when(mockedGetTickerDetailsMethod.callAsync(ticker)).thenResolve(expectedTickerDetailsResult);
      // Mocked parameters
      const mockedParams = {
        ticker: 'TICK',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.removeTicker).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.ticker, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.removeTicker(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.removeTicker).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.ticker, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getTickerDetails).once();
      verify(mockedGetTickerDetailsMethod.callAsync(ticker)).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('IsSecurityToken', () => {
    test.todo('should fail as securityTokenAddress is not an Eth address');

    test('should call to isSecurityToken', async () => {
      // Address expected
      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      const expectedResult = true;
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.isSecurityToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(securityTokenAddress)).thenResolve(expectedResult);

      // Real call
      const result = await target.isSecurityToken({ securityTokenAddress });
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.isSecurityToken).once();
      verify(mockedMethod.callAsync(securityTokenAddress)).once();
    });
  });

  describe('Change fees', () => {
    test('should send the transaction to change ticker registration fee', async () => {
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
      // Address expected
      const expectedTickerRegistrationResult = new BigNumber(1);
      // Mocked method
      const mockedTickerRegistrationMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerRegistrationFee).thenReturn(instance(mockedTickerRegistrationMethod));
      // Stub the request
      when(mockedTickerRegistrationMethod.callAsync()).thenResolve(expectedTickerRegistrationResult);
      // Mocked parameters
      const fee = new BigNumber(2);
      const mockedParams = {
        newFee: fee,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeTickerRegistrationFee).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newFee, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeTickerRegistrationFee(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeTickerRegistrationFee).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newFee, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getTickerRegistrationFee).once();
      verify(mockedTickerRegistrationMethod.callAsync()).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });

    test('should send the transaction to change security token launch fee', async () => {
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
      // Address expected
      const expectedSecurityTokenResult = new BigNumber(1);
      // Mocked method
      const mockedSecurityTokenMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSecurityTokenLaunchFee).thenReturn(instance(mockedSecurityTokenMethod));
      // Stub the request
      when(mockedSecurityTokenMethod.callAsync()).thenResolve(expectedSecurityTokenResult);
      // Mocked parameters
      const fee = new BigNumber(2);
      const mockedParams = {
        newFee: fee,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeSecurityLaunchFee).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newFee, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeSecurityLaunchFee(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeSecurityLaunchFee).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newFee, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.getSecurityTokenLaunchFee).once();
      verify(mockedSecurityTokenMethod.callAsync()).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ChangeExpiryLimit', () => {
    test('should call to ChangeExpiryLimit', async () => {
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
      const mockedParams = {
        newExpiry: new BigNumber(15 * 60 * 60 * 24),
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeExpiryLimit).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newExpiry, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeExpiryLimit(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeExpiryLimit).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newExpiry, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifyTicker', () => {
    test.todo('should fail as owner is not an Eth address');

    test('should call to ModifyTicker', async () => {
      // Owner Address expected
      const expectedOwnerResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedOwnerMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.owner).thenReturn(instance(mockedOwnerMethod));
      // Stub the request
      when(mockedOwnerMethod.callAsync()).thenResolve(expectedOwnerResult);
      // Mock web3 wrapper owner
      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve([expectedOwnerResult]);
      const owner = '0x0123456789012345678901234567890123456789';
      const ticker = 'TICK';
      const tokenName = 'Security';
      const registrationDate = new Date(2020, 1);
      const expiryDate = new Date(2025, 1);
      const status = false;
      const mockedParams = {
        owner,
        ticker,
        tokenName,
        registrationDate,
        expiryDate,
        status,
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifyTicker).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.tokenName,
          objectContaining(dateToBigNumber(registrationDate)),
          objectContaining(dateToBigNumber(expiryDate)),
          mockedParams.status,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyTicker(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyTicker).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.tokenName,
          objectContaining(dateToBigNumber(registrationDate)),
          objectContaining(dateToBigNumber(expiryDate)),
          mockedParams.status,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('ModifySecurityToken', () => {
    test.todo('should fail as owner is not an Eth address');

    test.todo('should fail as securityToken is not an Eth address');

    test('should call to ModifySecurityToken', async () => {
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
      const name = 'Security';
      const ticker = 'TICK';
      const owner = '0x5555555555555555555555555555555555555555';
      const securityToken = '0x0123456789012345678901234567890123456789';
      const tokenDetails = 'Token Details';
      const deployedAt = new Date(2020, 1);

      const mockedParams = {
        name,
        ticker,
        owner,
        securityToken,
        tokenDetails,
        deployedAt,
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifySecurityToken).thenReturn(instance(mockedMethod));
      // Stub the request

      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          mockedParams.ticker,
          mockedParams.owner,
          mockedParams.securityToken,
          mockedParams.tokenDetails,
          objectContaining(dateToBigNumber(mockedParams.deployedAt)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifySecurityToken(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifySecurityToken).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.name,
          mockedParams.ticker,
          mockedParams.owner,
          mockedParams.securityToken,
          mockedParams.tokenDetails,
          objectContaining(dateToBigNumber(mockedParams.deployedAt)),
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('SetProtocolVersion', () => {
    test.todo('should fail as STFactoryAddress is not an Eth address');

    test('should send transaction to set protocol version', async () => {
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
      // Mocked parameters
      const mockedParams = {
        STFactoryAddress: '0x0123456789012345678901234567890123456789',
        major: 1,
        minor: 2,
        patch: 3,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.setProtocolVersion).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.STFactoryAddress,
          mockedParams.major,
          mockedParams.minor,
          mockedParams.patch,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.setProtocolVersion(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.setProtocolVersion).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.STFactoryAddress,
          mockedParams.major,
          mockedParams.minor,
          mockedParams.patch,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('GetSTFactoryAddress', () => {
    test('should call to getSTFactoryAddress', async () => {
      // Address expected
      const expectedResult = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSTFactoryAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getSTFactoryAddress();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getSTFactoryAddress).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetProtocolVersion', () => {
    test('should call to getProtocolVersion', async () => {
      // Address expected
      const expectedResult = [1, 2, 3];
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getProtocolVersion).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getProtocolVersion();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getProtocolVersion).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('GetExpiryLimit', () => {
    test('should call to getExpiryLimit', async () => {
      // Address expected
      const expectedResult = new BigNumber(1);
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getExpiryLimit).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync()).thenResolve(expectedResult);

      // Real call
      const result = await target.getExpiryLimit();
      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getExpiryLimit).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('UpdatePolyTokenAddress', () => {
    test.todo('should fail as newAddress is not an Eth address');

    test('should call to updatePolyTokenAddress', async () => {
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
      const mockedParams = {
        newAddress: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.updatePolyTokenAddress).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.updatePolyTokenAddress(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.updatePolyTokenAddress).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newAddress, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
      verify(mockedContract.owner).once();
      verify(mockedOwnerMethod.callAsync()).once();
      verify(mockedWrapper.getAvailableAddressesAsync()).once();
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
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
          `Expected eventName to be one of: 'Pause', 'Unpause', 'TickerRemoved', 'ChangeExpiryLimit', 'ChangeSecurityLaunchFee', 'ChangeTickerRegistrationFee', 'OwnershipTransferred', 'ChangeTickerOwnership', 'NewSecurityToken', 'RegisterTicker', encountered: Transfer`,
        ),
      );
    });
  });
});
