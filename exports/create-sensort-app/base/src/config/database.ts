import {MongooseConnection} from '@sensort/mongoose'

MongooseConnection('default', ()=>({
    database: "sensort",
    host: "localhost"
}))