// PolymathRegistryWrapper test
import { mock, instance, reset, when, verify } from 'ts-mockito';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { DetailedERC20Contract, SecurityTokenRegistryEvents } from '@polymathnetwork/abi-wrappers';
import { MockedCallMethod, MockedSendMethod, getMockedPolyResponse } from '../../../test_utils/mocked_methods';
import ContractWrapper from '../../contract_wrapper';
import ERC20TokenWrapper from '../erc20_wrapper';
import DetailedERC20TokenWrapper from '../detailed_erc20_wrapper';

describe('DetailedERC20TokenWrapper', () => {
  // Declare DetailedERC20TokenWrapper object
  let target: DetailedERC20TokenWrapper;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: DetailedERC20Contract;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(DetailedERC20Contract);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new DetailedERC20TokenWrapper(instance(mockedWrapper), myContractPromise);
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
        new Error(`Expected eventName to be one of: 'Approval', 'Transfer', encountered: ChangeExpiryLimit`),
      );
    });
  });
});
