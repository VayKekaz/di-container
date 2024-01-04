import { Provider } from '../../../src';

import { CircularDependencyScope } from '../scopes';
import { CircularProviderA } from './CircularProviderA';


@Provider(CircularDependencyScope)
export class CircularProviderB {
    constructor(
        a: CircularProviderA,
    ) {
    }
}
