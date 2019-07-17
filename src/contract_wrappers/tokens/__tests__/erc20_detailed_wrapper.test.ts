// PolymathRegistryWrapper test
import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ERC20DetailedContract, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import ERC20TokenWrapper from '../erc20_wrapper';
import ERC20DetailedTokenWrapper from '../erc20_detailed_wrapper';

describe('ERC20DetailedTokenWrapper', () => {
  // Declare ERC20DetailedTokenWrapper object
  let target: ERC20DetailedTokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DetailedContract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DetailedContract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new ERC20DetailedTokenWrapper(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('Types', () => {
    test('should extend ERC20TokenWrapper', async () => {
      expect(target instanceof ERC20TokenWrapper).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to SecurityTokenRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: SecurityTokenRegistryEvents.ChangeExpiryLimit,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(`Expected eventName to be one of: 'Transfer', 'Approval', encountered: ChangeExpiryLimit`),
      );
    });
  });
});
