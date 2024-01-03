import { isProviderSymbol, providerScopeSymbol } from './decorators';


export type ProviderMetadata = {
    [isProviderSymbol]: boolean
    [providerScopeSymbol]: string | symbol | null
}

export type AbstractClass<
    T = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<unknown>,
> =
    abstract new(...args: Args) => T

export type Class<
    T = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<unknown>,
> =
    new(...args: Args) => T

export type ProviderClass<
    T extends unknown = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<unknown>,
> = Class<T, Args> & {
    prototype: T & { metadata: ProviderMetadata }
}
