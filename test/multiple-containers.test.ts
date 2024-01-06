import { DiContainer } from '../src';
import { AdditionalProvider } from './assets/AdditionalProvider';
import { ProviderA, ProviderB } from './assets/providers_A_B';
import { AdditionalScope, BasicScope } from './assets/scopes';
import { ProviderC } from './assets/subdir/ProviderC';


describe('Multple containers test', () => {
    let ca: DiContainer;
    let cb: DiContainer;

    beforeAll(async () => {
        ca = await new DiContainer({
            scan: { scanDirectory: __dirname, scope: BasicScope },
        }).init();
        cb = await new DiContainer({
            scan: { scanDirectory: __dirname, scope: AdditionalScope },
        }).init();
    });

    test('a initialized correctly', () => {
        expect(ca.get(ProviderA)).toBeInstanceOf(ProviderA);
        expect(ca.get(ProviderB)).toBeInstanceOf(ProviderB);
        expect(ca.get(ProviderC)).toBeInstanceOf(ProviderC);
    });

    test('b is initialized correctly', () => {
        expect(cb.get(AdditionalProvider)).toBeInstanceOf(AdditionalProvider);
    });

    test('containers do not share instances', () => {
        expect(ca.scanner.providers).toHaveLength(4);
        expect(cb.scanner.providers).toHaveLength(1);

        expect(ca.scanner.providers).not.toContain(cb.scanner.providers[0]!);
    });
});
