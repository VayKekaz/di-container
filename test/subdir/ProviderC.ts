import { Provider } from '../../src/decorators';
import { ProviderA, ProviderB } from '../providers';


@Provider
export class ProviderC {
    constructor(
        private readonly providerA: ProviderA,
        private readonly providerB: ProviderB,
    ) {
    }
}
