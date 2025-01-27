import BaseModel from './BaseModel';

class MigrationsModel extends BaseModel<{
  name: string;
  migrated: Date;
}> {
  public fields = {
    name: String,
    migrated: Date,
  };
  public collection_name: string = 'migrations';

  constructor() {
    super();
  }
}

const Migrations = new MigrationsModel().load();
export default Migrations;
