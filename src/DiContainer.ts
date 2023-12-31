import { PathLike } from 'fs';
import path from 'path';
import { isProvider } from './decorators';
import { AbstractClass, Class, ProviderClass } from './types';
import { getAllFiles, getCaller } from './util';


export class DiContainer {
    protected providerClasses: ReadonlyArray<ProviderClass> = [];
    protected readonly providers = new Map<any, any>();

    constructor(readonly scanDirectory: PathLike = '.') {
    }

    async init(force: boolean = false): Promise<this> {
        if (!force && this.providerClasses.length > 0)
            throw new Error('This container seems initialized. ' +
                'If you want to re-scan all providers anyway then use `.init(true)`. ' +
                'Note that it will destroy all the references to previously initialized providers.');

        this.providerClasses = await this.findProviderClasses();
        this.instantiateProviders();
        return this;
    }

    get<T>(clazz: Class<T>): T | null {
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

    private async findProviderClasses(): Promise<Array<ProviderClass>> {
        const files = await getAllFiles(path.join(
            path.dirname(getCaller()),
            String(this.scanDirectory),
        ));
        const providersFound: Array<Class> = [];
        for (const file of files) {
            providersFound.push(...this.findProviderClassesInFile(file));
        }
        return providersFound;
    }

    private findProviderClassesInFile(filepath: string): Array<ProviderClass> {
        const providersFound = [];
        try {
            // console.log(`Requiring ${filepath}`);
            const exportedMembers = require(filepath);
            // console.log('Found members:', Object.values(exportedMembers));
            for (const member of Object.values(exportedMembers)) {
                if (isProvider(member))
                    providersFound.push(member);
            }
        } catch (e) {
            // console.error(e);
        }
        // console.log('Found providers:', providersFound);
        return providersFound;
    }

    private instantiateProviders() {
        const providersFound: Array<ProviderClass> = [];
        providersFound.push(...this.providerClasses);
        while (this.providers.size < this.providerClasses.length) {
            const providerConstructor = providersFound.shift()!;
            const paramsRequired = Reflect.getMetadata('design:paramtypes', providerConstructor) || [];
            const paramsProvided = [];
            for (const requiredParam of paramsRequired) {
                const provided = this.providers.get(requiredParam);
                if (provided)
                    paramsProvided.push(provided);
            }
            if (paramsProvided.length === paramsRequired.length)
                this.providers.set(providerConstructor, new providerConstructor(...paramsProvided));
            else
                providersFound.push(providerConstructor);
        }
    }
}
