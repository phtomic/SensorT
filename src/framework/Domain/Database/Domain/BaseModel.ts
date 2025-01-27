import mongoose, {
  Document,
  FilterQuery,
  UpdateQuery,
  IfAny,
  Model,
  PopulatedDoc,
  Require_id,
  SchemaDefinition,
  SchemaDefinitionType,
  Types,
  PopulateOptions,
} from 'mongoose';
import { Schema } from 'mongoose';
import DatabaseSchemaPlugin, {
  ConnectDatabase,
  globalsWithMongoose,
} from './DatabaseSchemaPlugin';
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
export type ModelType<T, M> = T &
  BaseModel<T, {}> &
  Model<
    T,
    {},
    {},
    {},
    IfAny<T, any, Document<T | any, {}, T> & Require_id<T>>,
    any
  > &
  M;
export type BaseModelSchemaDefinition<T> = SchemaDefinition<
  SchemaDefinitionType<T>,
  any
>;
export type DBPlugins = Array<(schema: mongoose.Schema<any>, opts: any) => any>;
export type DefPopulateOptions<T> = Array<string | PopulateOptions>;
export default class BaseModel<T, ModelMethods = {}> {
  public readonly fields!: BaseModelSchemaDefinition<T>;
  public readonly collection_name!: string;
  readonly ignoreDefaultFields?: boolean;
  protected readonly ignoredFields?: string[];
  readonly ignoredFieldsAudit?: string[];
  protected readonly audit_fields: Array<[string, string, string]> = [];
  protected readonly plugins: DBPlugins = [];
  protected readonly beforeSave?: (dados: any) => any;
  protected readonly listeners!: BaseModelListener;
  protected readonly populate: DefPopulateOptions<T> = [];

  protected collection(
    connection?: DBConnectionPool,
  ): ModelType<T, ModelMethods> {
    if (!connection) {
      const tmp = Object.keys(globalsWithMongoose.databaseConnections)
        .map((key) => ({
          key,
          ...globalsWithMongoose.databaseConnections[key],
        }))
        .sort((a, b) => (a.priority || 0) - (b.priority || 0));
      const firstDefault = tmp.find((conn) => conn.default == true);
      connection = firstDefault ? firstDefault[0].key : tmp[0].key;
    }
    const conn = ConnectDatabase(connection!);
    Object.keys(globalsWithMongoose.mongooseSchemas).forEach((schema_name) => {
      if (!conn.models[schema_name])
        conn.model(
          schema_name,
          globalsWithMongoose.mongooseSchemas[schema_name],
        );
    });
    return conn.models[this.collection_name] as ModelType<T, ModelMethods>;
  }

  public load(): (connection?: DBConnectionPool) => ModelType<T, ModelMethods> {
    const methods = [
      ...Reflect.ownKeys(Object.getPrototypeOf(this)),
      ...Reflect.ownKeys(BaseModel.prototype),
    ].filter((p: any) => !['constructor'].includes(p));
    this.configureSchemas(methods);
    return (connection?: DBConnectionPool) => this.collection(connection);
  }

  private configureSchemas(methods: any[]) {
    if (!globalsWithMongoose.mongooseSchemas)
      globalsWithMongoose.mongooseSchemas = {};
    if (globalsWithMongoose.mongooseSchemas[this.collection_name]) return;
    const nSchema = new mongoose.Schema<T>({
      ...this.fields,
      created: Date,
      updated: Date,
    });
    if (nSchema.plugin) nSchema.plugin(DatabaseSchemaPlugin, this);
    methods
      .map((method) => [
        method.toString(),
        (...args: any[]) => this[method.toString()](...args),
      ])
      .forEach((k: any) =>
        nSchema.static(k[0], (...args: any) => k[1](...args)),
      );
    globalsWithMongoose.mongooseSchemas[this.collection_name] = nSchema;
  }

  public isEmpty() {
    return this.collection().exists({});
  }

  public findAll() {
    return this.collection().find({});
  }

  public findLimit(query: FilterQuery<T>, limit: number) {
    return this.collection().find(query).limit(limit);
  }

  public populated(query: FilterQuery<T>, and?: DefPopulateOptions<T>) {
    const find = this.collection().find(query);
    if (this.populate.length > 0)
      return find.populate([...this.populate, ...(and || [])]);
    return find;
  }

  public populatedOne(query: FilterQuery<T>, and?: DefPopulateOptions<T>) {
    const find = this.collection().findOne(query);
    if (this.populate.length > 0)
      return find.populate([...this.populate, ...(and || [])]);
    return find;
  }

  public count(query: FilterQuery<T>) {
    return this.collection().countDocuments(query);
  }

  public async updateOrCreate(query: FilterQuery<T>, update: UpdateQuery<T>) {
    return (await this.collection().find(query))
      ? await this.collection().updateOne(query, update).exec()
      : await this.collection().create(update);
  }

  public findById(id: Types.ObjectId) {
    return this.collection().find({ _id: id });
  }

  public deleteById(_id: Types.ObjectId | string) {
    return this.collection().deleteOne({ _id }).exec();
  }

  public whereId(id: Types.ObjectId) {
    return this.collection().find({ _id: id });
  }

  public populateOptions() {
    return this.populate;
  }
}

export const DbConnection = (type: string, cb: () => DbConnectionConfig) => {
  globalsWithMongoose.databaseConnections[type] = cb();
  return true;
};
