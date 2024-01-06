import { InstantiationError } from './errors';
import { ProviderClass } from './metadata';
import { ProviderScanner, ProviderScanOptions } from './ProviderScanner';
import { AbstractClass, Class } from './types';
import { getConstructorParams } from './util';


export type DiContainerOptions = Partial<{
    // Options for ProviderScanner
    scan: ProviderScanOptions
}>

/**
 * Scans for classes decorated with `@Provider()` and instantiates them.
 */
export class DiContainer {
    #debug: (...args: any[]) => void = () => null;

    get debug() {
        return this.#debug;
    }

    set debug(value) {
        this.#debug = value;
        this.scanner.debug = value;
    }

    protected readonly providers = new Map<any, any>();
    readonly scanner: ProviderScanner;

    constructor(options: DiContainerOptions = {}) {
        this.scanner = new ProviderScanner(options?.scan);
    }

    async init(force: boolean = false): Promise<this> {
        await this.scanner.init(force);
        this.instantiateProvidersB();
        return this;
    }

    get<T, Args extends ConstructorParameters<Class<T>>>(clazz: Class<T, Args>): T | null {
        return this.providers.get(clazz) ?? null;
    }

    getSubclasses<T>(clazz: AbstractClass<T>): Array<T> {
        const found: Array<T> = [];
        for (const provider of this.providers.values()) {
            if (provider instanceof clazz)
                found.push(provider);
        }
        return found;
    }

    private instantiateProviders() {
        const providersFound: Array<ProviderClass> = [...this.scanner.providers];
        while (this.providers.size < this.scanner.providers.length) {
            const providerConstructor = providersFound.shift()!;
            const paramsRequired = getConstructorParams(providerConstructor);
            const paramsProvided = [];
            for (const requiredParam of paramsRequired) {
                const provided = this.providers.get(requiredParam);
                if (provided)
                    paramsProvided.push(provided);
            }
            if (paramsProvided.length === paramsRequired.length) {
                // console.log(`Instantiated ${providerConstructor.name}`);
                this.providers.set(providerConstructor, new providerConstructor(...paramsProvided));
            } else {
                // console.log(`Postponed ${providerConstructor.name}`);
                providersFound.push(providerConstructor);
            }
        }
    }

    private instantiateProvidersB() {
        const unresolvedDependencies = new Map<ProviderClass, Array<Class>>();
        let isProgressMade = true;

        while (isProgressMade) {
            isProgressMade = false;

            for (const provider of this.scanner.providers) {
                const paramsRequired = getConstructorParams(provider);

                if (this.providers.has(provider))
                    continue;

                const paramsProvided = [];
                let allDependenciesResolved = true;
                for (const param of paramsRequired) {
                    const provided = this.providers.get(param);
                    if (provided) {
                        paramsProvided.push(provided);
                    } else {
                        allDependenciesResolved = false;
                        break;
                    }
                }

                if (allDependenciesResolved) {
                    this.providers.set(provider, new provider(...paramsProvided));
                    isProgressMade = true;
                } else {
                    const unresolvedParams = paramsRequired.filter(param => !this.providers.has(param));
                    unresolvedDependencies.set(provider, unresolvedParams);
                }
            }
        }

        if (unresolvedDependencies.size > 0)
            throw new InstantiationError(unresolvedDependencies);
    }

}
