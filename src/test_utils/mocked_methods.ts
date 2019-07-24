/* eslint-disable class-methods-use-this */
import { PolyResponse } from '@polymathnetwork/abi-wrappers';

export class MockedCallMethod {
  public callAsync(): Promise<void> {
    return Promise.resolve();
  }

  public getABIEncodedTransactionData(): string {
    return '';
  }
}

export class MockedSendMethod extends MockedCallMethod {
  public sendTransactionAsync(): Promise<void> {
    return Promise.resolve();
  }

  public estimateGasAsync(): Promise<void> {
    return Promise.resolve();
  }

  public getABIEncodedTransactionData(): string {
    return '';
  }
}

export function getMockedPolyResponse(): PolyResponse {
  return new PolyResponse(
    'TxHash',
    Promise.resolve({
      from: 'from',
      to: 'to',
      status: '0',
      cumulativeGasUsed: 0,
      gasUsed: 0,
      contractAddress: 'contractAddress',
      logs: [],
      logIndex: null,
      transactionIndex: 1,
      transactionHash: 'transactionHash',
      blockHash: 'blockHash',
      blockNumber: 1,
      address: 'address',
      data: 'data',
      topics: ['topic1'],
    }),
  );
}
