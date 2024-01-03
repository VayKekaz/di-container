import { Provider } from '../../../src';
import { ProviderA, ProviderB } from '../providers_A_B';

import { BasicScope } from '../scopes';


// @ts-ignore for some reason experimentalDecorators option does not work here
@Provider(BasicScope)
export class ProviderC {
    constructor(
        private readonly providerA: ProviderA,
        private readonly providerB: ProviderB,
    ) {
    }
}
