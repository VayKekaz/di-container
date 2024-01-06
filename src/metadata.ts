import { isProviderSymbol, providerScopeSymbol } from './decorators';
import { Class } from './types';
import { isClass } from './util';


export const DiMetadata = Symbol('DiMetadataPropertyKey');

export type ProviderMetadata = {
    [isProviderSymbol]: boolean
    [providerScopeSymbol]: string | symbol | null
}

export type ProviderClass<
    T = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<any>,
> = Class<T, Args> & {
    [DiMetadata]: ProviderMetadata
}

export const addProviderMetadata =
    <T extends Class<any>>(
        clazz: T,
        metadata: ProviderMetadata,
    ): T & ProviderClass => {
        return class extends clazz {
            static [DiMetadata] = metadata;
        };
    };

export const getProviderMetadata = (thing: unknown): Partial<ProviderMetadata> => {
    if (hasProviderMetadata(thing))
        return thing[DiMetadata];
    return {};
};

export const hasProviderMetadata = (thing: unknown): thing is ProviderClass => {
    return isClass(thing)
        && DiMetadata in thing
        && typeof thing[DiMetadata] === 'object';
};
