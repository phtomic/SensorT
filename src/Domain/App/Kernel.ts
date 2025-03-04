import { Builder } from './Builder';
import { globalsConfig } from './Exports';
import { LogsController } from './Logs';

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