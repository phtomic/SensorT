import mongoose, { MongooseOptions } from 'mongoose';
import * as Database from '../../../../config/database';
import { env } from '../../App/Globals';
function getConnectionConfig(type) {
    const DatabaseConfig = {
        ...{
            username: env('DB_USER', ""),
            password: env('DB_PASS', ""),
            srv: env('DB_SRV', false),
            host: env('DB_HOST', "next_database"),
            port: parseInt(env('DB_PORT', "27017")),
            database: env('DB_SCHEMA', "next"),
            timeout: parseInt(env('DB_TIMEOUT', '5000'))
        },
        ...Database.default[type]
    }
    const options = {
        ...(DatabaseConfig.srv) ? {} : { dbName: DatabaseConfig.database },
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        maxIdleTimeMS: 5000
    };

    const definers: Array<[keyof MongooseOptions, any]> = [
        ["strictQuery", false]
    ]

    let connectionCredentials = `${encodeURIComponent(DatabaseConfig.username)}:${encodeURIComponent(DatabaseConfig.password)}@`
    if (connectionCredentials.length == 2) connectionCredentials = ''
    const connectionPoint = `mongodb${(DatabaseConfig.srv) ? "+srv" : ""}`
    const connectionPort = DatabaseConfig.srv ? "" : `:${DatabaseConfig.port.toString()}`
    const connectionDatabase = (DatabaseConfig.srv) ? DatabaseConfig.database : ""
    return { uri: `${connectionPoint}://${connectionCredentials}${DatabaseConfig.host}${connectionPort}/${connectionDatabase}`, options, definers, ...DatabaseConfig }
}
export async function ConnectDatabase(type) {
    if ([1, 2].includes(mongoose.connection.readyState)) return true;
    const config = getConnectionConfig(type)
    mongoose.set('strictQuery', false)
    config.definers.forEach(([option, value]) => mongoose.set(option, value))
    await mongoose.connect(config.uri, config.options)
    return true;
}

/**
 * @param {Object} schema - Mongoose schema object
 */
const DatabaseSchemaPlugin = (schema: mongoose.Schema<any>, opts: any) => {
    mongoose.connection.removeAllListeners();
    mongoose.connection.on("error", (err) => {
        console.error(err, {}, "Database");
    });
    // Manipulador de exceção não capturada
    mongoose.connection.on("uncaughtException", (err) => {
        console.error(err, {}, "Database");
    });

    mongoose.connection.on("disconnect", (err) => {
        console.debug("Disconnected from database", {}, "Database");
    });

    if (opts.plugins) opts.plugins.forEach(Plugin => Plugin(schema, opts));
};

export default DatabaseSchemaPlugin