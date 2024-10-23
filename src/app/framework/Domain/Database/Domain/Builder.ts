import { ConnectDatabase } from './DatabaseSchemaPlugin';
import commandsList from '../../../../config/commands'
import { MigrationsController } from './MigrationsController';
import SensorQ from '../../Plugins/SensorQ';
import { PackagesBuilder } from './PackagesBuilder';
export class Builder {
    private action: any
    public executed = false
    public stopServe = false
    public canMigrate = false
    public isCommand = false
    public prepareAction(command) {
        if (command[0] !== undefined && !command[0].startsWith('--')) {
            console.log(`==== ${command.join(" ")} =====`)
            switch (command[0]) {
                case 'db:migrate':
                    this.executed = true
                    this.stopServe = true
                    this.canMigrate = true
                    break;
                case 'db:migrate:make':
                    this.executed = true
                    this.stopServe = true
                    if (command[1]) {
                        new MigrationsController().createMigration(command[1])
                    } else {
                        console.error('Provide the name of migration')
                    }
                    break;
                case 'consume':
                    this.executed = true
                    this.stopServe = true
                    new SensorQ.consume(command[1])
                    break;
                case 'prepare:build':
                    this.executed = true
                    this.stopServe = true
                    this.isCommand = true
                    new MigrationsController().prepare_migrations()
                    break;
                case 'prepare:packages':
                    this.executed = true
                    this.stopServe = true
                    this.isCommand = true
                    new PackagesBuilder().prepare()
                    break;
                case 'clean:build':
                    this.executed = true
                    this.stopServe = true
                    this.isCommand = true
                    new MigrationsController().clean_migrations()
                    break;

                default:
                    if (commandsList[command[0]]) {
                        this.stopServe = true
                        const promise = commandsList[command[0]]()
                        if (promise && typeof promise.then === 'function' && promise[Symbol.toStringTag] === 'Promise') {
                            promise.then(() => this.stopProccess())
                        } else {
                            this.stopProccess()
                        }
                    } else if (!this.executed) {
                        console.debug("NOT FOUND")
                        this.stopProccess()
                    }
                    break;
            }
        }
    }
    private stopProccess() {
        process.exit()
    }
}