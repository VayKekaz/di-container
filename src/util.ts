import { PathLike } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';


export const getAllFiles = async (dirPath: PathLike, arrayOfFiles: Array<string> = []): Promise<Array<string>> => {
    dirPath = String(dirPath);
    if (!path.isAbsolute(dirPath))
        dirPath = path.join(__dirname, dirPath);

    const files: Array<string> = await fs.readdir(dirPath);

    await Promise.all(files.map(async file => {
        dirPath = String(dirPath);
        if ((await fs.stat(dirPath + '/' + file)).isDirectory()) {
            arrayOfFiles = await getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    }));

    return arrayOfFiles;
};

/**
 * Gets the caller of the function. Meant to be used outside of file from where it's defined.
 * @param depth how far to go after the call site of getCaller
 */
export const getCaller = (depth: number = 1): string => {
    const stack = getStack();

    // current depth of this file
    let depthPassed = -1;
    let lastFilePassed = __filename;

    for (const callSite of stack) {
        const currentFile = callSite.getFileName();
        if (!currentFile)
            continue;
        if (currentFile === lastFilePassed)
            continue;

        depthPassed++;
        lastFilePassed = currentFile;
        if (depthPassed >= depth)
            return currentFile;
    }
    throw new Error('Call site not found.');
};

const getStack = (): Array<NodeJS.CallSite> => {
    // Save original Error.prepareStackTrace
    const origPrepareStackTrace = Error.prepareStackTrace;

    // Override with function that just returns `stack`
    Error.prepareStackTrace = (_, stack) => stack;
    // Create a new `Error`, which automatically gets `stack`
    const err = new Error();
    // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
    const stack = err.stack as unknown as Array<NodeJS.CallSite>;

    // Restore original `Error.prepareStackTrace`
    Error.prepareStackTrace = origPrepareStackTrace;

    return stack;
};
