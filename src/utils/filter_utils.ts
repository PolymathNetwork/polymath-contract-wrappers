import ethUtil from 'ethereumjs-util';
import jsSHA3 from 'js-sha3';
import _ from 'lodash';
import uuid from 'uuid/v4';

import { ContractAbi, FilterObject, EventAbi, LogEntry } from '@polymathnetwork/abi-wrappers';
import { BlockRange, ContractEvents, IndexedFilterValues } from '../types';

const TOPIC_LENGTH = 32;

const filterUtils = {
  generateUUID(): string {
    return uuid();
  },
  getFilter(
    address: string,
    eventName: ContractEvents,
    indexFilterValues: IndexedFilterValues,
    abi: ContractAbi,
    blockRange?: BlockRange,
  ): FilterObject {
    const eventAbi = _.find(abi, { name: eventName }) as EventAbi;
    const eventSignature = filterUtils.getEventSignatureFromAbiByName(eventAbi);
    const topicForEventSignature = ethUtil.addHexPrefix(jsSHA3.keccak_256(eventSignature));
    const topicsForIndexedArgs = filterUtils.getTopicsForIndexedArgs(eventAbi, indexFilterValues);
    const topics = [topicForEventSignature, ...topicsForIndexedArgs];
    let filter: FilterObject = {
      address,
      topics,
    };
    if (!_.isUndefined(blockRange)) {
      filter = {
        ...blockRange,
        ...filter,
      };
    }
    return filter;
  },
  getEventSignatureFromAbiByName(eventAbi: EventAbi): string {
    const types = _.map(eventAbi.inputs, 'type');
    const signature = `${eventAbi.name}(${types.join(',')})`;
    return signature;
  },
  getTopicsForIndexedArgs(abi: EventAbi, indexFilterValues: IndexedFilterValues): (string | null)[] {
    const topics: (string | null)[] = [];
    abi.inputs.forEach(
      (eventInput): void => {
        if (eventInput.indexed) {
          if (_.isUndefined(indexFilterValues[eventInput.name])) {
            // Null is a wildcard topic in a JSON-RPC call
            topics.push(null);
          } else {
            const value = indexFilterValues[eventInput.name] as string;
            const buffer = ethUtil.toBuffer(value);
            const paddedBuffer = ethUtil.setLengthLeft(buffer, TOPIC_LENGTH);
            const topic = ethUtil.bufferToHex(paddedBuffer as Buffer);
            topics.push(topic);
          }
        }
      },
    );
    return topics;
  },
  matchesFilter(log: LogEntry, filter: FilterObject): boolean {
    if (!_.isUndefined(filter.address) && log.address !== filter.address) {
      return false;
    }
    if (!_.isUndefined(filter.topics)) {
      return filterUtils.doesMatchTopics(log.topics, filter.topics);
    }
    return true;
  },
  doesMatchTopics(logTopics: string[], filterTopics: (string[] | string | null)[]): boolean {
    const matchesTopic = _.zipWith(logTopics, filterTopics, filterUtils.matchesTopic.bind(filterUtils));
    const doesMatchTopics = _.every(matchesTopic);
    return doesMatchTopics;
  },
  matchesTopic(logTopic: string, filterTopic: string[] | string | null): boolean {
    if (_.isArray(filterTopic)) {
      return _.includes(filterTopic, logTopic);
    }
    if (_.isString(filterTopic)) {
      return filterTopic === logTopic;
    }
    // null topic is a wildcard
    return true;
  },
};

export default filterUtils;
