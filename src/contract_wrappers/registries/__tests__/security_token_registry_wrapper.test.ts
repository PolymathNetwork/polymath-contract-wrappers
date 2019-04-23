// PolymathRegistryWrapper test
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';
import { SecurityTokenRegistryContract, PolyTokenEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod } from '../../../../test_utils/mocked_methods';
import ContractWrapper from '../../contract_wrapper';
import { dateToBigNumber, stringToBytes32 } from '../../../utils/convert';
import SecurityTokenRegistryWrapper from '../security_token_registry_wrapper';

describe('SecurityTokenRegistryWrapper', () => {
  // Declare PolyMathRegistryWrapper object
  let target: SecurityTokenRegistryWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: SecurityTokenRegistryContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(SecurityTokenRegistryContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new SecurityTokenRegistryWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ContractWrapper', async () => {
      expect(target instanceof ContractWrapper).toBe(true);
    });
  });

  describe('Pause Unpause', () => {
    test('should call to pause', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    });

    test('should call to unpause', async () => {
      const mockedParams = {
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    test('should call to transfer ownership', async () => {
      const newOwner = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        newOwner,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    test('should call to reclaim ERC20 tokens', async () => {
      const tokenContract = '0x0123456789012345678901234567890123456789';
      const mockedParams = {
        tokenContract,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    });
  });

  describe('GetTickersByOwner', () => {
    test('should call getTickersByOwner', async () => {
      // Address expected
      const expectedResult = [stringToBytes32('123')];
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
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTickersByOwner).once();
      verify(mockedMethod.callAsync(ownerAddress)).once();
    });
  });

  describe('GetSecurityTokenData', () => {
    test('should call getSecurityTokenData', async () => {
      const expectedResult = {
        ticker: 'TICK',
        owner: '0x0123456789012345678901234567890123456789',
        tokenDetails: 'Details',
        deployedAt: new Date(0),
      };

      const expectedSCResult = ['TICK', '0x0123456789012345678901234567890123456789', 'Details', new BigNumber(0)];

      const securityTokenAddress = '0x0123456789012345678901234567890123456789';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getSecurityTokenData).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(securityTokenAddress)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.getSecurityTokenData({ securityTokenAddress });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getSecurityTokenData).once();
      verify(mockedMethod.callAsync(securityTokenAddress)).once();
    });
  });

  describe('GetTokensByOwner', () => {
    test('should call getTokensByOwner', async () => {
      // Address expected
      const expectedResult = ['0x0123456789012345678901234567890123456789'];
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
      const expectedResult = {
        owner: '0x0123456789012345678901234567890123456789',
        registrationDate: new Date(0),
        expiryDate: new Date(0),
        tokenName: 'tokenName',
        status: true,
      };

      const expectedSCResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(0),
        new BigNumber(0),
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
      const result = await target.getTickerDetails({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(expectedResult);
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
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTickerRegistrationFee).once();
      verify(mockedMethod.callAsync()).once();
    });
  });

  describe('RegisterTicker', () => {
    test('should call to Register Ticker', async () => {
      const owner = '0x0123456789012345678901234567890123456789';
      const ticker = 'TICK';
      const tokenName = 'TICKER';
      const mockedParams = {
        owner,
        ticker,
        tokenName,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.registerTicker).thenReturn(instance(mockedMethod));
      // Stub the request
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
    });
  });

  describe('TransferTickerOwnership', () => {
    test('should call to TransferTickerOwnership', async () => {
      const newOwner = '0x0123456789012345678901234567890123456789';
      const ticker = 'TICK';
      const mockedParams = {
        newOwner,
        ticker,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    });
  });

  describe('GenerateSecurityToken', () => {
    test('should call to GenerateSecurityToken', async () => {
      const ticker = 'TICK';
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
      const expectedResult = Promise.resolve;
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
    });
  });

  describe('Get Security Token Information', () => {
    test('should call to getSecurityTokenAddress', async () => {
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
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getSecurityTokenLaunchFee).once();
      verify(mockedMethod.callAsync()).once();
    });

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
    test('should call to getTickerDetails for unavailable ticker', async () => {
      const expectedResult = false;

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
      const result = await target.isTickerAvailable({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });

    test('should call to getTickerDetails for available ticker', async () => {
      const expectedResult = true;

      const expectedSCResult = ['', new BigNumber(0), new BigNumber(0), '', false];

      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.isTickerAvailable({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });
  });

  describe('IsTickerRegisteredByCurrentIssuer', () => {
    test('should call to getTickerDetails and check current user', async () => {
      const expectedResult = true;

      const expectedSCResult = [
        '0x0123456789012345678901234567890123456789',
        new BigNumber(1),
        new BigNumber(1),
        'tokenName',
        true,
      ];

      const tokenName = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      const expectedAddrResult = ['0x0123456789012345678901234567890123456789'];

      when(mockedWrapper.getAvailableAddressesAsync()).thenResolve(expectedAddrResult);

      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(tokenName)).thenResolve(expectedSCResult);
      // Real call
      const result = await target.isTickerRegisteredByCurrentIssuer({ tokenName });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(tokenName)).once();
    });
  });

  describe('IsTokenLaunched', () => {
    test('should call check if token launched', async () => {
      const expectedResult = true;

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
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });

    test('should call to getTickerDetails for available ticker', async () => {
      const expectedResult = true;

      const expectedSCResult = ['', new BigNumber(0), new BigNumber(0), '', false];

      const ticker = 'TICK';
      // Mocked method
      const mockedMethod = mock(MockedCallMethod);
      // Stub the method
      when(mockedContract.getTickerDetails).thenReturn(instance(mockedMethod));
      // Stub the request
      when(mockedMethod.callAsync(ticker)).thenResolve(expectedSCResult);

      // Real call
      const result = await target.isTickerAvailable({ tokenName: ticker });
      // Result expectation
      expect(result).toEqual(expectedResult);
      // Verifications
      verify(mockedContract.getTickerDetails).once();
      verify(mockedMethod.callAsync(ticker)).once();
    });
  });

  describe('RemoveTicker', () => {
    test('should call to remove ticker', async () => {
      // Mocked parameters
      const mockedParams = {
        ticker: 'TICK',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    });
  });

  describe('IsSecurityToken', () => {
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
      // Mocked parameters
      const fee = new BigNumber(1);
      const mockedParams = {
        newFee: fee,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    });

    test('should send the transaction to change security token launch fee', async () => {
      // Mocked parameters
      const fee = new BigNumber(1);
      const mockedParams = {
        newFee: fee,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
    });
  });
  describe('ChangeExpiryLimit', () => {
    test('should call to ChangeExpiryLimit', async () => {
      const newExpiry = new Date(2025, 1);
      const date1 = dateToBigNumber(newExpiry);
      const mockedParams = {
        newExpiry: date1,
        txData: {},
        safetyFactor: 10,
      };
      const realParams = {
        newExpiry,
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.changeExpiryLimit).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(mockedParams.newExpiry, mockedParams.txData, mockedParams.safetyFactor),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.changeExpiryLimit(realParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.changeExpiryLimit).once();
      verify(
        mockedMethod.sendTransactionAsync(mockedParams.newExpiry, mockedParams.txData, mockedParams.safetyFactor),
      ).once();
    });
  });

  describe('ModifyTicker', () => {
    test('should call to ModifyTicker', async () => {
      const owner = '0x0123456789012345678901234567890123456789';
      const ticker = 'TICK';
      const tokenName = 'Security';
      const registrationDate = new Date(2020, 1);
      const expiryDate = new Date(2025, 1);
      const status = false;
      const date1 = dateToBigNumber(registrationDate);
      const date2 = dateToBigNumber(expiryDate);
      const mockedParams = {
        owner,
        ticker,
        tokenName,
        registrationDate: date1,
        expiryDate: date2,
        status,
        txData: {},
        safetyFactor: 10,
      };
      const realParams = {
        owner,
        ticker,
        tokenName,
        registrationDate,
        expiryDate,
        status,
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = Promise.resolve;
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
          mockedParams.registrationDate,
          mockedParams.expiryDate,
          mockedParams.status,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifyTicker(realParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifyTicker).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.tokenName,
          mockedParams.registrationDate,
          mockedParams.expiryDate,
          mockedParams.status,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('ModifySecurityToken', () => {
    test('should call to ModifySecurityToken', async () => {
      const name = 'Security';
      const ticker = 'TICK';
      const owner = '0x0123456789012345678901234567890123456789';
      const securityToken = '0x0123456789012345678901234567890123456789';
      const tokenDetails = 'Token Details';
      const deployedAt = new Date(2020, 1);

      const date1 = dateToBigNumber(deployedAt);
      const mockedParams = {
        name,
        ticker,
        owner,
        securityToken,
        tokenDetails,
        deployedAt: date1,
        txData: {},
        safetyFactor: 10,
      };
      const realParams = {
        name,
        ticker,
        owner,
        securityToken,
        tokenDetails,
        deployedAt,
        txData: {},
        safetyFactor: 10,
      };

      const expectedResult = Promise.resolve;
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.modifySecurityToken).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.owner,
          mockedParams.securityToken,
          mockedParams.tokenDetails,
          mockedParams.deployedAt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.modifySecurityToken(realParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.modifySecurityToken).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.owner,
          mockedParams.ticker,
          mockedParams.owner,
          mockedParams.securityToken,
          mockedParams.tokenDetails,
          mockedParams.deployedAt,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });

  describe('Set Protocol Version', () => {
    test('should send transaction to set protocol version', async () => {
      // Mocked parameters
      const fee = new BigNumber(1);
      const mockedParams = {
        STFactoryAddress: '0x0123456789012345678901234567890123456789',
        major: 1,
        minor: 1,
        patch: 1,
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
      const expectedResult = [1];
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
    test('should call to updatePolyTokenAddress', async () => {
      const mockedParams = {
        newAddress: '0x0123456789012345678901234567890123456789',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = Promise.resolve;
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
