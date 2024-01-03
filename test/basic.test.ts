import { DiContainer } from '../src';
import { BaseProvider } from './assets/BaseProvider';
import { ProviderA, ProviderB } from './assets/providers_A_B';
import { BasicScope } from './assets/scopes';
import { ProviderC } from './assets/subdir/ProviderC';


describe('DI Container test', () => {
    let container: DiContainer;

    beforeAll(async () => {
        container = await new DiContainer({
            scan: { scanDirectory: __dirname, scope: BasicScope },
        }).init();
    });

    test('a is instantiated', async () => {
        const a = container.get(ProviderA);
        expect(a).toBeInstanceOf(ProviderA);
    });

    test('b is instantiated', async () => {
        const b = container.get(ProviderB);
        expect(b).toBeInstanceOf(ProviderB);
    });

    test('c is instantiated', async () => {
        const c = container.get(ProviderC);
        expect(c).toBeInstanceOf(ProviderC);
    });

    test('inheritance is working properly', () => {
        const providers = container.getSubclasses(BaseProvider);
        const a = container.get(ProviderA)!;
        const b = container.get(ProviderB)!;

        expect(providers).toHaveLength(2);
        expect(providers.find(provider => provider instanceof ProviderA)).toBeDefined();
        expect(providers.find(provider => provider instanceof ProviderB)).toBeDefined();
        expect(providers.includes(a)).toBeTruthy();
        expect(providers.includes(b)).toBeTruthy();
    });
});
