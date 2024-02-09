import { GlobalScope, Provider } from '../src';
import { isProviderSymbol, providerScopeSymbol } from '../src/decorators';
import { getProviderMetadata } from '../src/metadata';
import { BasicScope } from './assets/scopes';


describe('Metadata test', () => {

    @Provider(BasicScope)
    class basicProvider {
    }

    @Provider()
    class basicProviderB {
    }

    test('classes have correct metadata', () => {
        expect(getProviderMetadata(basicProvider)).toEqual({
            [isProviderSymbol]: true,
            [providerScopeSymbol]: BasicScope,
        });
        expect(getProviderMetadata(basicProviderB)).toEqual({
            [isProviderSymbol]: true,
            [providerScopeSymbol]: GlobalScope,
        });
    });
});
