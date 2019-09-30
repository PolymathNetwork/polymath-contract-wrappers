// DividendCheckpoint 3.0.0 test
import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, BigNumber, ModuleContract_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../factories/contractFactory';
import ModuleCommon from '../common';
import { WithModule_3_0_0 } from '../3.0.0';
import { GetLogs, Subscribe, ContractVersion } from '../../../../types';

describe('Module 3.0.0', () => {
  // we extend the class to be able to instance it, using the 3.0.0 Module contract since it has all common functionality
  class FakeModule extends ModuleCommon {
    public contract: Promise<ModuleContract_3_0_0>;

    public contractVersion!: ContractVersion;

    public subscribeAsync!: Subscribe

    public getLogsAsync!: GetLogs;

    public getDecimals = async (): Promise<BigNumber> => {
      return new BigNumber(18);
    };

    public constructor(web3Wrapper: Web3Wrapper, contract: Promise<ModuleContract_3_0_0>, contractFactory: ContractFactory) {
      super(web3Wrapper, contract, contractFactory);
      this.contract = contract;
    }
  }

  // we empty-extend the mixin to be able to use the class as a type
  class FakeModule_3_0_0 extends WithModule_3_0_0(FakeModule) {}

  let target: FakeModule_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ModuleContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ModuleContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);    

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeModule_3_0_0(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);    
  });

  describe('Types', () => {
    test('should extend ModuleCommon', async () => {
      expect(target instanceof ModuleCommon).toBe(true);
    });
  });
});
