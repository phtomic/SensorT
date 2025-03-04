import mongoose, {
    Schema,
    PopulatedDoc,
    PopulateOptions,
    Connection,
} from 'mongoose';
import { CreateCommand } from '../App/Builder';

export type DbConnectionConfig = {
    username?: string;
    password?: string;
    database: string;
    host: string;
    srv?: boolean;
    port?: number;
    default?: boolean;
    priority?: number;
};

export type DBConnectionPool = string;
export type Populator<T = any> = PopulatedDoc<T, any>;
export type BaseModelListener = {
    onDelete?: Array<(doc: any) => void>;
    onUpdate?: Array<(doc: any) => void>;
    onCreate?: Array<(doc: any) => void>;
};
export type DBPlugins = Array<(schema: mongoose.Schema<any>, opts: any) => any>;
export type DefPopulateOptions<T> = Array<string | PopulateOptions>;
export const globalsWithMongoose = global as typeof globalThis & {
    mongooseConnections: {  [x: string]: Connection; };
    mongooseSchemas: { [x: string]: Schema<any>; };
    databaseConnections: { [x: string]: DbConnectionConfig; };
};
export const MongooseConnections = () =>
    globalsWithMongoose.mongooseConnections;
if (!globalsWithMongoose.mongooseConnections)
    globalsWithMongoose.mongooseConnections = {};
