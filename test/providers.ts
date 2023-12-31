import { Provider } from '../src/decorators';
import { BaseProvider } from './BaseProvider';


@Provider
export class ProviderA extends BaseProvider {
}

@Provider
export class ProviderB extends BaseProvider {
    constructor(private readonly providerA: ProviderA) {
        super();
    }
}

export const SomeNumber = 1;
export const SomeFunction = () => {
};
