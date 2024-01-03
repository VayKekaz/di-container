import { Class, ProviderClass, ProviderMetadata } from './types';
import { isClass } from './util';


const DiMetadata = Symbol('DiMetadata key of a prototype');

export const addProviderMetadata =
    <T, Args extends ConstructorParameters<Class<T>>>(
        clazz: Class<T, Args>,
        metadata: ProviderMetadata,
    ): ProviderClass<T, Args> => {
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
