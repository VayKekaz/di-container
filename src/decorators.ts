import { Class, ProviderClass } from './types';


export function AddMetadata(metadata: Record<string, any>) {
    return function <T>(constructor: Class<T>): ProviderClass<T> {
        if ('metadata' in constructor.prototype) {
            Object.assign(constructor.prototype.metadata, metadata);
        } else {
            constructor.prototype.metadata = metadata;
        }
        return constructor;
    };
}

export const isProviderSymbol = Symbol('isProvider');

export const Provider = AddMetadata({ [isProviderSymbol]: true });

export const isProvider = (thing: unknown): thing is ProviderClass => {
    if (!isClass(thing))
        return false;

    if (!('metadata' in thing.prototype) || typeof thing.prototype.metadata !== 'object')
        return false;

    return thing.prototype.metadata[isProviderSymbol] || false;
};

const isClass = (obj: unknown): obj is Class => {
    return typeof obj === 'function'
        && obj.prototype
        && obj.prototype.constructor === obj;
};
