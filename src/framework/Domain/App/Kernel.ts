import { Connection, Schema } from 'mongoose';
import { DbConnectionConfig } from '../Database/Domain/BaseModel';
import { Builder } from '../Database/Domain/Builder';
import { LogsController } from './Logs';
import { SensorCronList } from '../Plugins/SensorCron';
import { CronJob } from 'cron';
export type RegexMatchedString<Pattern extends RegExp> = string & {
    __pattern: Pattern;
};
export type CommandList = {
    [x: string]: () => Promise<any>;
};
export type SensortConfig = {
    failKeepAlive: boolean;
    migrationsPath: string;
    logsPath: string;
}
export class Kernel {
    public canServe = true;
    public canMigrate = false;
    public canSeed = false;
    public canTask = true;
    public isCommand = false;
    constructor() {
        Kernel.setDefaultConfigs()
        new LogsController()
        const command = process.argv.slice(2);
        const builder = new Builder();
        builder.prepareAction(command);
    }
    public static setDefaultConfigs() {
        globalsConfig.sensortConfig = {
            failKeepAlive: false,
            migrationsPath: '',
            logsPath: '',
            ...globalsConfig.sensortConfig || {}
        }
    }
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
}