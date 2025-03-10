import { MongooseConnectionConfig, globalsWithMongoose } from "./Exports";

export default function MongooseConnection (connection_name: string, config_callback: () => MongooseConnectionConfig) {
    if (!globalsWithMongoose.databaseConnections) globalsWithMongoose.databaseConnections = {}
    globalsWithMongoose.databaseConnections[connection_name] = config_callback();
    return true;
};
