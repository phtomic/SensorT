import { env } from "../framework/Domain/App/Globals";
export default {
    default:{
        username: env('DB_USER', ""),
        password: env('DB_PASS', ""),
        srv: env('DB_SRV', false),
        host: env('DB_HOST', "localhost"),
        port: parseInt(env('DB_PORT', "27017")),
        database: env('DB_SCHEMA', "sensort"),
    }
}