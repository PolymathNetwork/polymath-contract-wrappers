import { AdvancedPLCRVotingCheckpointEvents_3_1_0, BigNumber, ethersUtils } from '@polymathnetwork/abi-wrappers';
import _ from 'lodash';
import { PolymathAPI, ModuleName } from '../src';
import { moduleInstancesLookup } from './modules';

/**
 * This method adds a AdvancedPLCRVotingCheckpoint module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */

// Example under construction
export const advancedPLCRVotingCheckpoint = async (polymathAPI: PolymathAPI, ticker: string) => {
  const advancedPLCRVoting = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.AdvancedPLCRVotingCheckpoint,
  }))[0];

  const logs = await advancedPLCRVoting.getLogsAsync({
    eventName: AdvancedPLCRVotingCheckpointEvents_3_1_0.VoteCommit,
    indexFilterValues: { _voter: '0x84c3f9d07466a65c3a1dd1eab059dec560a11f0c' },
  });

  const args = _.map(logs, (e: any) => {
    return e.args;
  });

  const onlyBallot: any = _.filter(args, (e: any) => {
    return e._ballotId.toNumber() === 1;
  });

  const secretHash = onlyBallot[0]._secretHash;
  const hash = ethersUtils.solidityKeccak256(['uint256', 'uint256'], ['1000000000000000000', '12345678']);

  console.log(secretHash, hash);

  advancedPLCRVoting.unsubscribeAll();
};
