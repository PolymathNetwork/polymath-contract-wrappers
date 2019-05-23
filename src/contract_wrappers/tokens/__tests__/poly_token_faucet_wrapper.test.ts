// PolymathRegistryWrapper test
import { BigNumber } from '@0x/utils';
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { PolyTokenFaucetContract } from '@polymathnetwork/abi-wrappers';
import ContractWrapper from '../../contract_wrapper';
import PolyTokenFaucetWrapper from '../poly_token_faucet_wrapper';
import { MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';

describe('PolyTokenFaucetWrapper', () => {
  // Declare PolyTokenFaucetWrapper object
  let target: PolyTokenFaucetWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: PolyTokenFaucetContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(PolyTokenFaucetContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new PolyTokenFaucetWrapper(instance(mockedWrapper), myContractPromise);
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

  describe('getTokens', () => {
    test.todo('should fail as recipient is not an Eth address');
    test.todo('should fail as recipient is an 0x0 Eth address');
    test.todo('should fail as amount is exceed 1 million tokens');
    test('should send the transaction to getTokens', async () => {
      // Mocked parameters
      const mockedParams = {
        amount: new BigNumber(1),
        recipient: '0x1111111111111111111111111111111111111111',
        txData: {},
        safetyFactor: 10,
      };
      const expectedResult = getMockedPolyResponse();
      // Mocked method
      const mockedMethod = mock(MockedSendMethod);
      // Stub the method
      when(mockedContract.getTokens).thenReturn(instance(mockedMethod));
      // Stub the request
      when(
        mockedMethod.sendTransactionAsync(
          mockedParams.amount,
          mockedParams.recipient,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).thenResolve(expectedResult);

      // Real call
      const result = await target.getTokens(mockedParams);

      // Result expectation
      expect(result).toBe(expectedResult);
      // Verifications
      verify(mockedContract.getTokens).once();
      verify(
        mockedMethod.sendTransactionAsync(
          mockedParams.amount,
          mockedParams.recipient,
          mockedParams.txData,
          mockedParams.safetyFactor,
        ),
      ).once();
    });
  });
});
