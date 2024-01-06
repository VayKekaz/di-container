export type AbstractClass<
    T = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<any>,
> =
    abstract new(...args: Args) => T

export type Class<
    T = unknown,
    Args extends ConstructorParameters<Class<T>> = Array<any>,
> =
    new(...args: Args) => T
