import { isProviderSymbol, providerScopeSymbol } from './decorators';
import { Class } from './types';
import { isClass } from './util';


export const DiMetadata = Symbol('DiMetadataPropertyKey');

export type ProviderMetadata = {
    [isProviderSymbol]: boolean
    [providerScopeSymbol]: string | symbol | null
}

export type ProviderClass<
    T extends unknown = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<any>,
> = Class<T, Args> & {
    prototype: T & { metadata: ProviderMetadata }
}

export const addProviderMetadata =
    <Inst, T extends Class<any>>(
        clazz: T,
        metadata: ProviderMetadata,
    ): T & ProviderClass<any> => {
        if (hasProviderMetadata(clazz)) {
            Object.assign(clazz.prototype[DiMetadata], metadata);
        } else {
            clazz.prototype[DiMetadata] = metadata;
        }
        return clazz;
    };

export const getProviderMetadata = (thing: unknown): Partial<ProviderMetadata> => {
    if (hasProviderMetadata(thing))
        return thing.prototype[DiMetadata];
    return {};
};

export const hasProviderMetadata = (thing: unknown): thing is ProviderClass => {
    return isClass(thing)
        && DiMetadata in thing.prototype
        && typeof thing.prototype.metadata !== 'object';
};
