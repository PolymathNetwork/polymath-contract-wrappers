// STOWrapper test
import { mock, instance, reset } from 'ts-mockito';
import { CappedSTOContract_3_0_0, Web3Wrapper } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../../factories/contractFactory';
import STOCommon from '../common';
import { WithSTO_3_0_0 } from '../3.0.0';
import { ContractVersion, Subscribe, GetLogs } from '../../../../../types';

describe('STO 3.0.0', () => {
  // we extend the class to be able to instance it, using the 3.0.0 CappedSTO contract since it has all common functionality
  class FakeSTO extends STOCommon {
    public contract: Promise<CappedSTOContract_3_0_0>;

    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe

    public getLogsAsync!: GetLogs;

    public constructor(web3Wrapper: Web3Wrapper, contract: Promise<CappedSTOContract_3_0_0>, contractFactory: ContractFactory) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  // we empty-extend the mixin to be able to use the class as a type
  class FakeSTO_3_0_0 extends WithSTO_3_0_0(FakeSTO) {}

  let target: FakeSTO_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: CappedSTOContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(CappedSTOContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);    

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeSTO(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);    
  });

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof STOCommon).toBe(true);
    });
  });
});
