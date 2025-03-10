export type RegexMatchedString<Pattern extends string> = `${string & { __brand: Pattern }}`;
export type CommandList = {
    [x: string]: () => Promise<any>;
};
export type SensortConfig = {
    failKeepAlive: boolean;
    migrationsPath: string;
    logsPath: string;
}

export class AppError extends Error {
    code: string;
    constructor(message?: string, code?: string, name?: string) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = name || 'AppError';
        this.code = code || '0x0';
    }
}
export const globalsConfig = global as typeof globalThis & {
    sensortConfig: SensortConfig;
    sensortCommands: CommandList;
}