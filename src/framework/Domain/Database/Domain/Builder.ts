import { MigrationsController } from './MigrationsController';
import { PackagesBuilder } from './PackagesBuilder';
import { CommandList, } from '../../App/Kernel';
import Crypt from '../../Plugins/Crypt';
export const globalsConfig = global as typeof globalThis & {
    sensortCommands: CommandList;
}
export const CreateCommand = (
    input: string,
    callback: (...command) => Promise<any>,
) => {
    if(!globalsConfig.sensortCommands) globalsConfig.sensortCommands = {}
    globalsConfig.sensortCommands[input] = async (...command) => callback(...command);
};
export class Builder {
    public stopServe = false;
    public canMigrate = false;
    public isCommand = false;
    public prepareAction(command: any[]) {
        const commandsListFull: CommandList = {
            ...globalsConfig.sensortCommands,
            'prepare:packages': async () => new PackagesBuilder().prepare(),
            'db:migrate': async () => new MigrationsController().execMigrations(),
            'clean:dist': async () => new MigrationsController().clean_migrations(),
            'prepare:dist': async () => new MigrationsController().prepare_migrations(),
            'migration': async () => new MigrationsController().createMigration(command[1]),
            'key:make': async () => Crypt.generateKey(true),
        };
        if (command[0] !== undefined && !command[0].startsWith('--')) {
            console.debug(`==== ${command.join(' ')} =====`);
            if (commandsListFull[command[0]]) {
                const promise = commandsListFull[command[0]]();
                if (
                    promise &&
                    typeof promise.then === 'function' &&
                    promise[Symbol.toStringTag] === 'Promise'
                ) {
                    promise.finally(() => this.stopProccess());
                } else {
                    this.stopProccess();
                }
            } else {
                console.error('COMMAND NOT FOUND');
                this.stopProccess();
            }
        }
    }
    private stopProccess() {
        process.exit();
    }
}
