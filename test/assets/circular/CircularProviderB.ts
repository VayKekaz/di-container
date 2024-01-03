import { Provider } from '../../../src';

import { CircularDependencyScope } from '../scopes';
import { CircularProviderA } from './CircularProviderA';


// @ts-ignore for some reason experimentalDecorators option does not work here
@Provider(CircularDependencyScope)
export class CircularProviderB {
    constructor(
        a: CircularProviderA,
    ) {
    }
}
