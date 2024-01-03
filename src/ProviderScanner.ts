import { PathLike } from 'fs';
import { isCorrectScope, isProvider } from './decorators';
import { AbstractClass, ProviderClass } from './types';
import { getAllFiles, isSubclassOf } from './util';


export type ProviderScanOptions = Partial<{
    scanDirectory: ProviderScanner['scanDirectory']
    scope: ProviderScanner['scope']
}>

export class ProviderScanner {
    providers: ReadonlyArray<ProviderClass> = [];
    readonly scanDirectory: PathLike;
    readonly scope: string | RegExp | symbol | null;

    constructor(options: ProviderScanOptions = {}) {
        this.scanDirectory = options.scanDirectory ?? process.cwd();
        this.scope = options.scope ?? null;
    }

    async init(force: boolean = false): Promise<this> {
        if (!force && this.providers.length > 0)
            throw new Error('This container seems initialized. ' +
                'If you want to re-scan all providers anyway then use `.init(true)`. ' +
                'Note that it will destroy all the references to previously initialized providers.');

        this.providers = await this.findProviderClasses();
        return this;
    }

    getSubclasses<T>(clazz: AbstractClass<T>): Array<ProviderClass<T>> {
        const found: Array<ProviderClass<T>> = [];
        for (const provider of this.providers) {
            if (isSubclassOf(provider, clazz))
                found.push(provider);
        }
        return found;
    }

    private async findProviderClasses(): Promise<Array<ProviderClass>> {
        const files = await getAllFiles(this.scanDirectory);
        const arrays = await Promise.all(files.map(this.findProviderClassesInFile));
        return arrays.flat();
    }

    private findProviderClassesInFile = async (filepath: string): Promise<Array<ProviderClass>> => {
        const providersFound = [];
        try {
            // console.log(`Importing ${filepath}`);
            const exportedMembers = await import(filepath);
            // console.log('Found members:', Object.values(exportedMembers));
            for (const member of Object.values(exportedMembers)) {
                if (isProvider(member) && isCorrectScope(member, this.scope)) {
                    // console.log(`Found provider ${member.name}(${JSON.stringify(getMetadata(member))})`);
                    providersFound.push(member);
                }
            }
        } catch (e) {
            // console.log(`unable to require(${filepath})`);
            // console.error(e);
        }
        // console.log('Found providers:', providersFound);
        return providersFound;
    };
}
