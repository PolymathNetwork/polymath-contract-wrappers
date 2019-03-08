import { assert as sharedAssert } from '@0x/assert';
import * as _ from 'lodash';

export const assert = {
    ...sharedAssert,
    isValidSubscriptionToken(variableName: string, subscriptionToken: string): void {
        const uuidRegex = new RegExp('^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$');
        const isValid = uuidRegex.test(subscriptionToken);
        sharedAssert.assert(isValid, `Expected ${variableName} to be a valid subscription token`);
    },
};
