import { Provider } from '../../src';
import { BaseProvider } from './BaseProvider';

import { BasicScope } from './scopes';


@Provider(BasicScope)
export class ProviderA extends BaseProvider {

    // test that decorator type return type assignable to class that's being decorated
    // since static methods are not included by `new (...args: any[]) => any` type
    static method() {
    }
}

@Provider(BasicScope)
export class ProviderB extends BaseProvider {
    constructor(private readonly providerA: ProviderA) {
        super();
    }
}

export const SomeNumber_shouldNotBeScanned = 1;
export const SomeFunction_shouldNotBeScanned = () => null;
