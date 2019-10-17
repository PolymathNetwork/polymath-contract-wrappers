import { AdvancedPLCRVotingCheckpointEvents_3_1_0, BigNumber, ethersUtils } from '@polymathnetwork/abi-wrappers';
import _ from 'lodash';
import { PolymathAPI, ModuleName } from '../src';
import { issueTokenToInvestors } from './issueTokenToInvestor';
import { addInvestorsToWhitelist } from './addInvestorsToWhitelist';
import { AddingModuleOpts, addModule, moduleInstancesLookup } from './modules';

/**
 * This method adds a AdvancedPLCRVotingCheckpoint module and uses it. Requires that a valid security token has already been generated.
 * @param polymathAPI The polymathAPI instance.
 * @param ticker Ticker symbol.
 */

export const advancedPLCRVotingCheckpoint = async (polymathAPI: PolymathAPI, ticker: string) => {
  const myAddress = await polymathAPI.getAccount();
  const tickerSecurityTokenInstance = await polymathAPI.tokenFactory.getSecurityTokenInstanceFromTicker(ticker!);

  // Add the AdvancedPLCRVoting module
  /*
  const options: AddingModuleOpts = {
    archived: false,
    label: 'APLCR Label',
  };
  await addModule(
    polymathAPI,
    {
      ticker,
      moduleName: ModuleName.AdvancedPLCRVotingCheckpoint,
    },
    options,
  );
  */

  // Add all address in the whitelist including myAddress
  /*
  const kycInvestorMultiData = {
    investors: [myAddress],
    canSendAfter: [new Date()],
    canReceiveAfter: [new Date()],
    expiryTime: [new Date(2021, 10)],
  };
  await addInvestorsToWhitelist(polymathAPI, ticker, kycInvestorMultiData);

  // Issue tokens to the investors
  const issueMultiParams = {
    investors: [myAddress],
    values: [new BigNumber(1000)],
  };
  await issueTokenToInvestors(polymathAPI, ticker, issueMultiParams);
  */

  // Create checkpoint
  /*
  await tickerSecurityTokenInstance.createCheckpoint({});

  const advancedPLCRVoting = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.AdvancedPLCRVotingCheckpoint,
  }))[0];
  */

  /*
  const ballot = {
    name: 'Custom statutory ballot',
    startTime: new Date(),
    commitDuration: 86000,
    revealDuration: 86000,
    proposalTitle: 'Propostal Title Example',
    choices: 'Choice one',
    checkpointId: 1,
    details: 'Offchain details',
    noOfChoices: 2,
  };
  advancedPLCRVoting.createCustomStatutoryBallot;
  */

  /*
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
  */
};
