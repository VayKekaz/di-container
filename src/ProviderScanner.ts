import { PathLike } from 'fs';
import path from 'path';
import { isCorrectScope, isProvider } from './decorators';
import { GlobalScope, globalScopeProviders } from './globalScopeProviders';
import { ProviderClass } from './metadata';
import { AbstractClass } from './types';
import { getAllFiles, isSubclassOf } from './util';


export type ProviderScanOptions = Partial<{
    // If not provided `process.cwd()` will be used (usually project root), which will affect startup performance.
    scanDirectory: ProviderScanner['scanDirectory']
    // Containers with different scopes do not share providers unless container's scope is a regexp.
    scope: ProviderScanner['scope']
}>

export class ProviderScanner {
    debug: (...args: any[]) => void = () => null;

    providers: ReadonlyArray<ProviderClass> = [];
    readonly scanDirectory: PathLike;
    readonly scope: string | RegExp | symbol;

    constructor(options: ProviderScanOptions = {}) {
        this.scanDirectory = options.scanDirectory ?? process.cwd();
        this.scope = options.scope ?? GlobalScope;
    }

    /**
     * Scans for providers and adds them to scanner's context.
     *
     * @param force set to true if you want to call this method multiple times.
     *
     * @example
     * const entityScanner = await new ProviderScanner({
     *     scanDirectory: path.resolve(__dirname, 'entities'),
     *     scope: 'typeorm',
     * }).init();
     *
     * const MyDataSource = new DataSource({
     *     // ... other configurations
     *     entities: entityScanner.providers,
     *     // ...
     * });
     */
    async init(force: boolean = false): Promise<this> {
        if (!force && this.providers.length > 0)
            throw new Error('This container seems initialized. ' +
                'If you want to re-scan all providers anyway then use `.init(true)`. ' +
                'Note that it will destroy all the references to previously initialized providers.');

        this.providers = await this.findProviderClasses();
        return this;
    }

    /**
     * Returns all providers that extend specified `clazz`.
     * @param clazz what providers must extend to be included in returned array
     * @example
     * ```typescript
     * abstract class BaseProvider {}
     * @Provider() class MyProviderA extends BaseProvider {}
     * @Provider() class MyProviderB extends BaseProvider {}
     *
     * const scanner = new ProviderScanner();
     * scanner.getSubclasses(BaseProvider); // [ MyProviderA, MyProviderB ]
     * ```
     */
    getSubclasses<T>(clazz: AbstractClass<T>): Array<ProviderClass<T>> {
        const found: Array<ProviderClass<T>> = [];
        for (const provider of this.providers) {
            if (isSubclassOf(provider, clazz))
                found.push(provider);
        }
        return found;
    }

    private async findProviderClasses(): Promise<Array<ProviderClass>> {
        if (globalScopeProviders.size === 0) {
            this.debug('Global scope providers are not initialized. Scanning files.');
            const files = await getAllFiles(this.scanDirectory);
            const arrays = await Promise.all(files.map(this.findProviderClassesInFile));
            return arrays.flat();
        } else {
            this.debug('Global scope providers seem initialized. Searching for correct scopes.');
            const providers: Array<ProviderClass> = [];
            for (const provider of globalScopeProviders) {
                if (isCorrectScope(provider, this.scope)) {
                    this.debug(`${provider.name} is has correct scope.`);
                    providers.push(provider);
                }
            }
            return providers;
        }
    }

    private findProviderClassesInFile = async (filepath: string): Promise<Array<ProviderClass>> => {
        const providersFound: Array<ProviderClass> = [];
        try {
            if (!isNodeExecutable(filepath)) {
                this.debug(`Skipping import(${filepath}) since it's not node executable.`);
                return providersFound;
            }

            this.debug(`Importing ${filepath}`);
            const exportedMembers = await import(filepath);

            this.debug('Found members:', Object.values(exportedMembers));
            for (const member of Object.values(exportedMembers)) {
                if (isProvider(member)) {
                    this.debug(`Found provider: ${member}`);
                    globalScopeProviders.add(member);
                    if (isCorrectScope(member, this.scope)) {
                        this.debug(`${member.name} is has correct scope.`);
                        providersFound.push(member);
                    }
                }
            }
        } catch (e) {
            this.debug(`Error importing '${filepath}':`, e);
        }

        this.debug('Found providers:', providersFound);
        return providersFound;
    };
}

const nodeExecutableExtensions = ['.ts', '.js'];
const isNodeExecutable = (filepath: string): boolean => {
    return nodeExecutableExtensions
        .includes(path.extname(filepath));
};
