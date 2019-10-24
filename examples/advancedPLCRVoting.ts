import { BigNumber } from '@polymathnetwork/abi-wrappers';
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

  // Add all address in the whitelist including myAddress
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

  // Create checkpoint
  await tickerSecurityTokenInstance.createCheckpoint({});

  // Get the advancedPLCRVoting module
  const advancedPLCRVoting = (await moduleInstancesLookup(polymathAPI, {
    ticker,
    moduleName: ModuleName.AdvancedPLCRVotingCheckpoint,
  }))[0];

  // Create a new custom statutory ballot
  const ballot = {
    name: 'Custom statutory ballot',
    startTime: new Date(),
    commitDuration: 20,
    revealDuration: 20,
    proposalTitles: ['Propostal Title Example'],
    proposalDetails: 'Proposal Details',
    choices: ['Choice one', 'Choice two'],
    choicesCounts: 2,
    checkpointId: 1,
  };
  await advancedPLCRVoting.createCustomStatutoryBallot(ballot);

  // Commit vote
  await advancedPLCRVoting.commitVote({
    ballotId: 0,
    votes: [50, 200],
    salt: 12345678,
  });

  // Waiting 30 seconds to revel vote
  const sleep = (milliseconds: number) => {
    console.log(`Sleeping ${milliseconds / 1000} seconds`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  await sleep(30000);

  // Reveal vote
  await advancedPLCRVoting.revealVote({
    ballotId: 0,
    choices: [50, 200],
    salt: 12345678,
  });

  console.log('Vote revealed!');
};
