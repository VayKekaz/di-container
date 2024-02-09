import { ProviderClass } from './metadata';


export const GlobalScope = Symbol('GlobalProviderScope');
export const globalScopeProviders = new Set<ProviderClass>();
