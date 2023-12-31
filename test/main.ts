import 'reflect-metadata';
import { DiContainer } from '../src/DiContainer';
import { BaseProvider } from './BaseProvider';
import { ProviderA, ProviderB } from './providers';
import { ProviderC } from './subdir/ProviderC';


describe('DI Container test', () => {
    let container: DiContainer;

    beforeAll(async () => {
        container = await new DiContainer().init();
    });

    test('a', async () => {
        const a = container.get(ProviderA);
        expect(a).toBeDefined();
        expect(a instanceof ProviderA).toBeTruthy();
    });

    test('b', async () => {
        const b = container.get(ProviderB);
        expect(b).toBeDefined();
        expect(b instanceof ProviderB).toBeTruthy();
    });

    test('c', async () => {
        const c = container.get(ProviderC);
        expect(c).toBeDefined();
        expect(c instanceof ProviderC).toBeTruthy();
    });

    test('inheritance', () => {
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
