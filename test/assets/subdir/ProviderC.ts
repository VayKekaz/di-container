import { Provider } from '../../../src';
import { ProviderA, ProviderB } from '../providers_A_B';

import { BasicScope } from '../scopes';


@Provider(BasicScope)
export class ProviderC {
    constructor(
        private readonly providerA: ProviderA,
        private readonly providerB: ProviderB,
    ) {
    }
}
