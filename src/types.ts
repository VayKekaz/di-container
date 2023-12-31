import { isProviderSymbol } from './decorators';


export type AbstractClass<
    T = unknown,
    Args extends unknown[] = unknown[]
> = abstract new (...args: Args) => T;

export type Class<
    T = unknown,
    Args extends Array<unknown> = Array<any>
> = {
    new(...args: Args): T
}

export type ProviderMetadata = {
    [isProviderSymbol]: boolean
}

export type ProviderClass<
    T = unknown,
    Args extends Array<unknown> = Array<any>
> = Class<T, Args> & {
    prototype: T & { metadata: ProviderMetadata }
}
