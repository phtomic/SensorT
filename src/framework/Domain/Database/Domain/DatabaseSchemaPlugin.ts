import mongoose, {
    Connection,
    ConnectOptions,
    Model,
    MongooseOptions,
    Schema,
} from 'mongoose';
import { env } from '../../App/Globals';
import { isEmpty } from 'lodash';
import DbTreatments from '../Plugins/DbTreatments';
import { DbConnectionConfig } from './BaseModel';
export const globalsWithMongoose = global as typeof globalThis & {
    mongooseConnections: {
        [x: string]: Connection;
    };
    mongooseSchemas: {
        [x: string]: Schema<any>;
    };
    databaseConnections: {
        [x: string]: DbConnectionConfig;
    };
};
export const MongooseConnections = () =>
    globalsWithMongoose.mongooseConnections;
if (!globalsWithMongoose.mongooseConnections)
    globalsWithMongoose.mongooseConnections = {};
function getConnectionConfig(type: string | number) {
    const DatabaseConfig = {
        ...{
            username: env('DB_USER', ''),
            password: env('DB_PASS', ''),
            srv: env('DB_SRV', false),
            host: env('DB_HOST', 'database'),
            port: parseInt(env('DB_PORT', '27017')),
            database: env('DB_SCHEMA', 'sensort'),
            timeout: parseInt(env('DB_TIMEOUT', '5000')),
        },
        ...globalsWithMongoose.databaseConnections[type],
    };
    const options: ConnectOptions = {
        ...(DatabaseConfig.srv ? {} : { dbName: DatabaseConfig.database }),
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
        maxIdleTimeMS: 5000,
        autoCreate: true,
        autoIndex: true,
        appName: env('APP_NAME', 'sensort'),
    };

    const definers: Array<[keyof MongooseOptions, any]> = [
        ['strictQuery', false],
        ['strictPopulate', false],
        ['allowDiskUse', true],
    ];

    let connectionCredentials = `${encodeURIComponent(DatabaseConfig.username)}:${encodeURIComponent(DatabaseConfig.password)}@`;
    if (connectionCredentials.length == 2) connectionCredentials = '';
    const connectionPoint = `mongodb${DatabaseConfig.srv ? '+srv' : ''}`;
    const connectionPort = DatabaseConfig.srv
        ? ''
        : `:${DatabaseConfig.port.toString()}`;
    const connectionDatabase = DatabaseConfig.srv ? DatabaseConfig.database : '';
    return {
        uri: `${connectionPoint}://${connectionCredentials}${DatabaseConfig.host}${connectionPort}/${connectionDatabase}`,
        options,
        definers,
        ...DatabaseConfig,
    };
}
export function ConnectDatabase(type: string) {
    let connection = globalsWithMongoose.mongooseConnections?.[type];
    if (connection && [1, 2].includes(connection.readyState)) return connection;
    const config = getConnectionConfig(type);
    config.definers.forEach(([option, value]) => mongoose.set(option, value));
    if (env('APP_ENV') == 'local')
        console.debug(`Creating database connection ${type}`);
    connection = mongoose.createConnection(config.uri, config.options);
    globalsWithMongoose.mongooseConnections[type] = connection;
    return connection;
}

/**
 * @param {Object} schema - Mongoose schema object
 */
const DatabaseSchemaPlugin = (schema: mongoose.Schema<any>, opts: any) => {
    if (isEmpty(mongoose.connection.listeners('error')))
        mongoose.connection.on('error', (err) => {
            console.error(err, {}, 'Database');
        });

    // Manipulador de exceção não capturada
    if (isEmpty(mongoose.connection.listeners('uncaughtException')))
        mongoose.connection.on('uncaughtException', (err) => {
            console.error(err, {}, 'Database');
        });

    if (isEmpty(mongoose.connection.listeners('disconnect')))
        mongoose.connection.on('disconnect', (err) => {
            console.debug('Disconnected from database', {}, 'Database');
        });
    const plugins = [...(opts.plugins || []), DbTreatments];
    if (plugins)
        plugins.forEach(
            (
                Plugin: (
                    arg0: mongoose.Schema<
                        any,
                        mongoose.Model<any, any, any, any, any, any>,
                        {},
                        {},
                        {},
                        {},
                        mongoose.DefaultSchemaOptions,
                        { [x: string]: unknown },
                        mongoose.Document<
                            unknown,
                            {},
                            mongoose.FlatRecord<{ [x: string]: unknown }>
                        > &
                        mongoose.FlatRecord<{ [x: string]: unknown }> &
                        Required<{ _id: unknown }>
                    >,
                    arg1: any,
                ) => any,
            ) => Plugin(schema, opts),
        );
};

export default DatabaseSchemaPlugin;
