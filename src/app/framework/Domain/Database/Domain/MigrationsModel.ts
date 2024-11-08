

import { env } from '../../App/Globals';
import BaseModel from './BaseModel';
class MigrationsModel extends BaseModel<{
    name: string,
    migrated: Date
}> {
    public fields = {
        name: String,
        migrated: Date
    };
    public collection_name: string = env('SENSORT_MIGRATIONS_TABLE', 'migrations');
    
    constructor() { super() }
}


const Migrations = new MigrationsModel().load();
export default Migrations
