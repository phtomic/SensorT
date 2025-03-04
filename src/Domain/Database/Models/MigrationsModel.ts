import BaseModel from "../BaseModel";

class Migrations extends BaseModel<{
    name: string;
    migrated: Date;
}> {
    public fields = {
        name: String,
        migrated: Date,
    };
    public collection_name: string = 'migrations';
}
const MigrationsModel = new Migrations().load()
export default MigrationsModel