import { DbConnectionConfig, globalsWithMongoose } from "./Exports";

export default function DbConnection (type: string, cb: () => DbConnectionConfig) {
    if (!globalsWithMongoose.databaseConnections) globalsWithMongoose.databaseConnections = {}
    globalsWithMongoose.databaseConnections[type] = cb();
    return true;
};
