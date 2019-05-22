import { CappedSTO } from '@polymathnetwork/contract-artifacts';
import { ethers } from 'ethers';
import { dateToBigNumber } from '../../../utils/convert';
import { AddModule, AddModuleParams, CappedSTOData } from './add_module';
import assert from '../../../utils/assert';

export default class CappedSTOAddModule extends AddModule {
  public params: AddModuleParams;

  public constructor(params: AddModuleParams) {
    super();
    this.params = params;
  }

  public getData() {
    const iface = new ethers.utils.Interface(CappedSTO.abi);
    return iface.functions.configure.encode([
      dateToBigNumber((this.params.data as CappedSTOData).startTime),
      dateToBigNumber((this.params.data as CappedSTOData).endTime),
      (this.params.data as CappedSTOData).cap,
      (this.params.data as CappedSTOData).rate,
      (this.params.data as CappedSTOData).fundRaiseTypes,
      (this.params.data as CappedSTOData).fundsReceiver,
    ]);
  }

  public callAssertions() {
    assert.assert(dateToBigNumber((this.params.data as CappedSTOData).endTime).isZero(), 'End time already configured');
  }
}
