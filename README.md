# di-container

A proper dependency injection experience.

# Usage

```typescript
// src/anywhere/my-providers_A_B.ts
import { Provider } from './annotations';
import { BaseProvider } from './BaseProvider';


abstract class BaseProvider {
}

// just put the @Provider decorator on and export the provider
@Provider()
export class MyProviderA extends BaseProvider {
}

@Provider()
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
// src/index.ts
import 'reflect-metadata';
import { BaseProvider } from './BaseProvider';
import { DiContainer } from './DiContainer';
// import * as path from 'path'; // may be useful


// initialization is async due to asyncronous file scanning
const container = await new DiContainer({
    // in case if container is created inside sources root
    // if not provided process.cwd() will be used (project root), will strongly affect startup time
    discovery: { scanDirectory: __dirname },
    // if you want to discover providers from upper level, simply use path.resolve
    // discovery: { scanDirectory: path.resolve(__dirname, '../') },
}).init();

// get declared provider
const a: MyProviderA = container.get(MyProviderA);
const b: MyProviderB = container.get(MyProviderB);

// get providers that derive from some specific class
const derivedProviders: Array<BaseProvider> = container.getSubclasses(BaseProvider);
assert(derivedProviders.includes(a));
assert(derivedProviders.includes(b));
```

### Discovery service

If you use some libraries that require to pass all your custom classes inside them, you can
use `ProviderDiscoveryService`.

```typescript
// for example typeorm entity
// src/database/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Provider } from './decorators';


// add decorator with specific scope so it won't affect any other discovery services
@Provider('typeorm')
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
}
```

```typescript
// src/database/index.ts
import { DataSource } from 'typeorm';
import { ProviderDiscoveryService } from './ProviderDiscoveryService';
import * as path from 'path';


const entityDiscovery = await new ProviderDiscoveryService({
    scanDirectory: path.resolve(__dirname, 'entities'),
    scope: 'typeorm',
}).init();

export const AppDataSource = new DataSource({
    // ... other configurations
    entities: entityDiscovery.providers,
    // ...
});
```
