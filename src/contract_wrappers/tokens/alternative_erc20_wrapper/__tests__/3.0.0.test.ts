// PolymathRegistryWrapper test
import { mock, instance, reset } from 'ts-mockito';
import {
  ERC20DetailedContract_3_0_0,
  ISecurityTokenRegistryEvents_3_0_0,
  Web3Wrapper,
} from '@polymathnetwork/abi-wrappers';
import { AlternativeERC20_3_0_0 } from '../3.0.0';

describe('AlternativeERC20TokenWrapper', () => {
  // Declare ERC20DetailedTokenWrapper object
  let target: AlternativeERC20_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ERC20DetailedContract_3_0_0;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ERC20DetailedContract_3_0_0);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new AlternativeERC20_3_0_0(instance(mockedWrapper), myContractPromise);
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to SecurityTokenRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: ISecurityTokenRegistryEvents_3_0_0.ChangeExpiryLimit,
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
