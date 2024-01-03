import { Class, ProviderClass } from './types';


export class InstantiationError extends Error {
    constructor(providersAndDependencies: Map<ProviderClass, Array<Class>>) {
        super(
            'Could not resolve dependencies for some providers:\n'
            + InstantiationError.formatProvidersAndDependencies(providersAndDependencies),
        );
    }

    private static formatProvidersAndDependencies(providersAndDependencies: Map<ProviderClass, Array<Class>>): string {
        return [...providersAndDependencies.entries()]
            .map(([provider, dependencies]) =>
                provider.name
                + ' could not get [ '
                + dependencies
                    .map(dep => dep?.name ?? `'unknown dependency'`)
                    .join(', ')
                + ' ]',
            )
            .join('\n');
    }
}
