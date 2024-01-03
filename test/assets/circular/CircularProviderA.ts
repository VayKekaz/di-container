import { Provider } from '../../../src';

import { CircularDependencyScope } from '../scopes';
import { CircularProviderB } from './CircularProviderB';


// @ts-ignore for some reason experimentalDecorators option does not work here
@Provider(CircularDependencyScope)
export class CircularProviderA {
    constructor(
        b: CircularProviderB,
    ) {
    }
}
