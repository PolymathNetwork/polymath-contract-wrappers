import { mock, instance, reset } from 'ts-mockito';
import { Web3Wrapper, ISecurityTokenContract_3_0_0, FeatureRegistryEvents_3_0_0 } from '@polymathnetwork/abi-wrappers';
import ContractFactory from '../../../../factories/contractFactory';
import SecurityTokenCommon from '../common';
import { SecurityToken_3_0_0 } from '../3.0.0';

describe('SecurityToken 3.0.0', () => {
  // we empty-extend the mixin to be able to use the class as a type
  class FakeSecurityToken_3_0_0 extends SecurityToken_3_0_0 {}

  let target: FakeSecurityToken_3_0_0;
  let mockedWrapper: Web3Wrapper;
  let mockedContract: ISecurityTokenContract_3_0_0;
  let mockedContractFactory: ContractFactory;

  beforeAll(() => {
    mockedWrapper = mock(Web3Wrapper);
    mockedContract = mock(ISecurityTokenContract_3_0_0);
    mockedContractFactory = mock(ContractFactory);

    const myContractPromise = Promise.resolve(instance(mockedContract));
    target = new FakeSecurityToken_3_0_0(instance(mockedWrapper), myContractPromise, instance(mockedContractFactory));
  });

  afterEach(() => {
    reset(mockedWrapper);
    reset(mockedContract);
    reset(mockedContractFactory);
  });

  describe('Types', () => {
    test('should extend ModuleWrapper', async () => {
      expect(target instanceof SecurityTokenCommon).toBe(true);
    });
  });

  describe('SubscribeAsync', () => {
    test('should throw as eventName does not belong to FeatureRegistryEvents', async () => {
      // Mocked parameters
      const mockedParams = {
        eventName: FeatureRegistryEvents_3_0_0.ChangeFeatureStatus,
        indexFilterValues: {},
        callback: () => {},
        isVerbose: false,
      };

      // Real call
      await expect(target.subscribeAsync(mockedParams)).rejects.toEqual(
        new Error(
          `Expected eventName to be one of: 'ModuleAdded', 'ModuleUpgraded', 'UpdateTokenDetails', 'UpdateTokenName', 'GranularityChanged', 'FreezeIssuance', 'FreezeTransfers', 'CheckpointCreated', 'SetController', 'TreasuryWalletChanged', 'DisableController', 'OwnershipTransferred', 'TokenUpgraded', 'ModuleArchived', 'ModuleUnarchived', 'ModuleRemoved', 'ModuleBudgetChanged', 'TransferByPartition', 'AuthorizedOperator', 'RevokedOperator', 'AuthorizedOperatorByPartition', 'RevokedOperatorByPartition', 'IssuedByPartition', 'RedeemedByPartition', 'ControllerTransfer', 'ControllerRedemption', 'DocumentRemoved', 'DocumentUpdated', 'Issued', 'Redeemed', 'Transfer', 'Approval', encountered: ChangeFeatureStatus`,
        ),
      );
    });
  });
});
