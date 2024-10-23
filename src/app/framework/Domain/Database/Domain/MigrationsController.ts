import DefaultMigrations from '../../migrations';
import Migrations from './MigrationsModel';
import { stdout } from 'process'
import fs from 'fs';
import path from 'path';

const MIGRATIONMODEL = `export default async function () {
    //TODO CODE
}`
export class MigrationsController {
    private migrations: Array<[string, () => Promise<any>]> = []
    public createMigration(name: string) {
        const migrationPath = path.join(__dirname, "../../../../config/migrations/", `${Date.now()}_${name}.ts`)
        fs.writeFileSync(migrationPath, MIGRATIONMODEL)
        console.debug("Migration created", migrationPath)
        process.exit()
    }

    public async execMigrations() {
        const migrations = await Migrations().findAll()
        console.debug("[Migrations] Starting==========")
        const migrate = migrations.map((migration_banco) => migration_banco.name)
        const toRun = DefaultMigrations
        if(Object.keys(toRun).length == 0){
            this.prepare_migrations(false)?.map((migration)=>{
                toRun[`mig${migration}`] = require(`../../../../config/migrations/${migration}`)
            })
        }
        Object.keys(toRun).map((migration) => {
            if (!migrate.includes(migration)) this.addMigration(migration, toRun)
        })
        await this.doMigrations()
        if (this.migrations.length == 0)
            this.endProccess()

    }
    private addMigration(migration: string, migrations) {
        this.migrations.push([migration, migrations[migration].default])
    }
    private async doMigrations() {
        while (this.migrations.length > 0) {
            const [migration, classe] = this.migrations[0]
            const time = Date.now()
            stdout.write(`[Migrations] Executing ${migration}`)
            try {
                if (classe) await classe()
            } catch (err: any) {
                console.debug(` - ERRO NA MIGRATION (${migration}): ${err.toString()}`)
                return;
            }
            stdout.write(` - DONE ${(Date.now() - time) / 1000}s\r\n`)
            await Migrations().create({
                name: migration,
                migrated: Date.now()
            })
            this.migrations.shift()
        }
    }
    private endProccess() {
        console.debug("[Migrations] ALL DONE==========")
        process.exit()
    }
    public prepare_migrations(writeFile=true) {
        if (Object.keys(DefaultMigrations).length > 0) return;
        const basePath = path.join(`${__dirname}/../../../..`)
        const dir_files = fs.readdirSync(`${basePath}/config/migrations`)
        const file_lines: Array<string> = []
        const MIGRATIONIMPORT = `mig<<migration>>: require('../../config/migrations/<<migration>>')`
        dir_files.forEach(file => {
            const filename = file.split('.')[0]
            file_lines.push(MIGRATIONIMPORT.replace(/<<migration>>/g, filename))
        })
        if(writeFile){
            fs.writeFileSync(
                `${path.join(`${basePath}/../..`)}/build/app/framework/Domain/migrations.js`,
                `"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = {${file_lines.join(',')}};`,
                'utf-8'
            )
        }else{
            return dir_files.map((file)=>file.split('.')[0])
        }
    }

    public clean_migrations() {
        if (Object.keys(DefaultMigrations).length > 0) {
            const basePath = path.join(`${__dirname}/../..`)
            fs.writeFile(`${basePath}/framework/Domain/migrations.ts`, 'export default {};', () => process.exit())
        }
    }
}