import commandsList from '../../../../app/config/commands'
import { MigrationsController } from './MigrationsController';
import { PackagesBuilder } from './PackagesBuilder';
import { CommandList } from '../../App/Kernel';
import Crypt from '../../Plugins/Crypt';
export class Builder {
    public stopServe = false
    public canMigrate = false
    public isCommand = false
    public prepareAction(command: any[]) {
        const commandsListFull: CommandList = {
            ...commandsList,
            'prepare:packages': async () => new PackagesBuilder().prepare(),
            'db:migrate': async () => new MigrationsController().execMigrations(),
            'clean:build': async () => new MigrationsController().clean_migrations(),
            'prepare:build': async () => new MigrationsController().prepare_migrations(),
            'migration': async () => new MigrationsController().createMigration(command[1]),
            'key:make': async () => Crypt.generateKey(true)
        }
        if (command[0] !== undefined && !command[0].startsWith('--')) {
            console.debug(`==== ${command.join(" ")} =====`)
            if (commandsListFull[command[0]]) {
                this.stopServe = true
                const promise = commandsListFull[command[0]]()
                if (promise && typeof promise.then === 'function' && promise[Symbol.toStringTag] === 'Promise') {
                    promise.finally(() => this.stopProccess())
                } else {
                    this.stopProccess()
                }
            } else {
                console.error("COMMAND NOT FOUND")
                this.stopProccess()
            }
        }
    }
    private stopProccess() {
        process.exit()
    }
}