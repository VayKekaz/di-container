import { Provider } from '../../../src';

import { CircularDependencyScope } from '../scopes';
import { CircularProviderB } from './CircularProviderB';


@Provider(CircularDependencyScope)
export class CircularProviderA {
    constructor(
        b: CircularProviderB,
    ) {
    }
}
