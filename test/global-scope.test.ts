import { ProviderScanner } from '../src';
import { globalScopeProviders } from '../src/globalScopeProviders';
import { AdditionalProvider } from './assets/AdditionalProvider';
import { CircularProviderA } from './assets/circular/CircularProviderA';
import { CircularProviderB } from './assets/circular/CircularProviderB';
import DefaultExportProvider from './assets/DefaultExportProvider';
import { ProviderA, ProviderB } from './assets/providers_A_B';
import { BasicScope } from './assets/scopes';
import { ProviderC } from './assets/subdir/ProviderC';


describe('ProviderScanner test', () => {
    let scanner: ProviderScanner;

    beforeAll(async () => {
        scanner = new ProviderScanner({ scanDirectory: __dirname, scope: BasicScope });
        // container.debug = console.log;
        await scanner.init();
    });

    test('scanner has only basic scope providers', async () => {
        // @ts-ignore
        expect(scanner.providers.includes(ProviderA)).toBe(true);
        // @ts-ignore
        expect(scanner.providers.includes(ProviderB)).toBe(true);
        // @ts-ignore
        expect(scanner.providers.includes(ProviderC)).toBe(true);
        // @ts-ignore
        expect(scanner.providers.includes(DefaultExportProvider)).toBe(true);
        // @ts-ignore
        expect(scanner.providers.includes(CircularProviderA)).toBe(false);
        // @ts-ignore
        expect(scanner.providers.includes(CircularProviderB)).toBe(false);
        // @ts-ignore
        expect(scanner.providers.includes(AdditionalProvider)).toBe(false);
    });

    test('global scope has all providers', async () => {
        // @ts-ignore
        expect(globalScopeProviders.has(ProviderA)).toBe(true);
        // @ts-ignore
        expect(globalScopeProviders.has(ProviderB)).toBe(true);
        // @ts-ignore
        expect(globalScopeProviders.has(ProviderC)).toBe(true);
        // @ts-ignore
        expect(globalScopeProviders.has(DefaultExportProvider)).toBe(true);
        // @ts-ignore
        expect(globalScopeProviders.has(CircularProviderA)).toBe(true);
        // @ts-ignore
        expect(globalScopeProviders.has(CircularProviderB)).toBe(true);
        // @ts-ignore
        expect(globalScopeProviders.has(AdditionalProvider)).toBe(true);
    });
});
