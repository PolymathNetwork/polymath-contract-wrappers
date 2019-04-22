export class MockedCallMethod {
  public callAsync(...args: any): Promise<any> {
    return Promise.resolve();
  }
}

export class MockedSendMethod extends MockedCallMethod {
  public sendTransactionAsync(...args: any): Promise<any> {
    return Promise.resolve();
  }

  public estimateGasAsync(...args: any): Promise<any> {
    return Promise.resolve();
  }

  public getABIEncodedTransactionData(...args: any): any {
    return Promise.resolve();
  }
}
