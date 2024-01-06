import { addProviderMetadata, getProviderMetadata, ProviderClass } from './metadata';
import { ProviderScanner } from './ProviderScanner';
import { Class } from './types';


export const isProviderSymbol = Symbol('isProvider');
export const providerScopeSymbol = Symbol('providerScope');

// it's required to put this type on `export const Provider` to prevent
// // TS4023: Exported variable 'Provider' has or is using name 'DiMetadata' from external module "/opt/di-container/src/metadata" but cannot be named.
type ProviderDecorator = (scope?: string | symbol | null) =>
    <T extends Class>(clazz: T) => T & ProviderClass
/**
 * Marks class as a provider for `ProviderScanner` to take reference to.
 * @param scope if provider's scope does not match service's scope, it won't be included
 */
export const Provider: ProviderDecorator = (scope: string | symbol | null = null) =>
    <T extends Class>(clazz: T): T & ProviderClass =>
        addProviderMetadata(clazz, { [isProviderSymbol]: true, [providerScopeSymbol]: scope });

export const isProvider = (thing: unknown): thing is ProviderClass => {
    return getProviderMetadata(thing)[isProviderSymbol] || false;
};

export const isCorrectScope = (provider: ProviderClass, scanScope: ProviderScanner['scope']): boolean => {
    const providerScope = getProviderMetadata(provider)[providerScopeSymbol];

    if (typeof providerScope === 'string' && scanScope instanceof RegExp)
        return Boolean(providerScope.match(scanScope));

    return providerScope === scanScope;
};
