import { PathLike } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AbstractClass, Class } from './types';


export const isClass = (obj: unknown): obj is Class => {
    return typeof obj === 'function'
        && obj.prototype
        && obj.prototype.constructor === obj;
};

type isSubclassOfOverrides = {
    <Base>(subclass: AbstractClass, base: AbstractClass<Base>): subclass is AbstractClass<Base>
    <Base>(subclass: Class, base: AbstractClass<Base>): subclass is Class<Base>
}
export const isSubclassOf: isSubclassOfOverrides = <Base>(
    subclass: AbstractClass<Base> | Class<Base>,
    base: AbstractClass<Base>,
): subclass is Class<Base> =>
    base.prototype.isPrototypeOf(subclass.prototype);

export const getConstructorParams = <T, Args extends unknown[]>(constructor: AbstractClass<T, Args>): Array<Class<Args[number]>> => {
    return Reflect.getMetadata('design:paramtypes', constructor) || [];
};

export const getAllFiles = async (dirPath: PathLike, arrayOfFiles: Array<string> = []): Promise<Array<string>> => {
    const files: Array<string> = await fs.readdir(dirPath);

    await Promise.all(files.map(async file => {
        dirPath = String(dirPath);
        if ((await fs.stat(path.join(dirPath, file))).isDirectory()) {
            arrayOfFiles = await getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    }));

    return arrayOfFiles;
};
