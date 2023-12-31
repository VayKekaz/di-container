# di-container

A proper dependency injection experience.

# Usage

```typescript
// my-providers.ts
import { Provider } from './annotations';
import { BaseProvider } from './BaseProvider';


abstract class BaseProvider {
}

// just put the @Provider decorator on and export the provider
@Provider
export class MyProviderA extends BaseProvider {
}

@Provider
export class MyProviderB extends BaseProvider {
    constructor(
        // declare dependency inside a constructor
        private readonly a: MyProviderA,
    ) {
        super();
    }
}
```

```typescript
// index.ts
import { BaseProvider } from './BaseProvider';
import { DiContainer } from './DiContainer';


// initialization is async due to asyncronous file scanning
const container = await new DiContainer().init();

// get declared provider
const a: MyProviderA = container.get(MyProviderA);
const b: MyProviderB = container.get(MyProviderB);

// get providers that derive from some specific class
const derivedProviders: Array<BaseProvider> = container.getSubclasses(BaseProvider);
assert(derivedProviders.includes(a));
assert(derivedProviders.includes(b));
```
