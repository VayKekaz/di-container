import * as path from 'path';
import { DiContainer } from '../src';
import { InstantiationError } from '../src/errors';
import { CircularDependencyScope } from './assets/scopes';


describe('Circular dependency test', () => {
    let container: DiContainer;

    beforeAll(async () => {
        container = new DiContainer({
            scan: {
                // jest issues
                // for some reason throws error through try-catch block on initializaiton
                scanDirectory: path.resolve(__dirname, 'assets'),
                scope: CircularDependencyScope,
            },
        });
    });

    test('circular dependencies throw error on initialization', async () => {
        await expect(container.init()).rejects.toThrow(InstantiationError);
    });
});
