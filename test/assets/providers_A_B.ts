import { Provider } from '../../src';
import { BaseProvider } from './BaseProvider';

import { BasicScope } from './scopes';


// @ts-ignore for some reason experimentalDecorators option does not work here
@Provider(BasicScope)
export class ProviderA extends BaseProvider {
}

// @ts-ignore for some reason experimentalDecorators option does not work here
@Provider(BasicScope)
export class ProviderB extends BaseProvider {
    constructor(private readonly providerA: ProviderA) {
        super();
    }
}

export const SomeNumber_shouldNotBeScanned = 1;
export const SomeFunction_shouldNotBeScanned = () => null;
