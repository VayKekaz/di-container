import { DiContainer } from '../src';
import { BaseProvider } from './assets/BaseProvider';
import DefaultExportProvider from './assets/DefaultExportProvider';
import { ProviderA, ProviderB } from './assets/providers_A_B';
import { BasicScope } from './assets/scopes';
import { ProviderC } from './assets/subdir/ProviderC';


describe('Basic DI Container test', () => {
    let container: DiContainer;

    beforeAll(async () => {
        container = new DiContainer({
            scan: { scanDirectory: __dirname, scope: BasicScope },
        });
        // container.debug = console.log;
        await container.init();
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

    test('DefaultExportProvider is instantiated', () => {
        expect(container.get(DefaultExportProvider))
            .toBeInstanceOf(DefaultExportProvider);
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
