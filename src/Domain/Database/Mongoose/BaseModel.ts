import mongoose, {
    Document,
    FilterQuery,
    UpdateQuery,
    IfAny,
    Model,
    Require_id,
    Types,
    SchemaDefinition,
    SchemaDefinitionType,
} from 'mongoose';
import DatabaseSchemaPlugin, { ConnectDatabase } from './Plugins/DatabaseSchema';
import { BaseModelListener, DBConnectionPool, DBPlugins, DefPopulateOptions, globalsWithMongoose } from './Exports';
type anyOf<T> = mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>;
export interface BaseModelInterface<T> {
    onConnection(connection?: DBConnectionPool)
    isEmpty(): mongoose.Query<{ _id: mongoose.InferId<T>; }, anyOf<T>, {}, T, "findOne", {}>
    findAll(): mongoose.Query<anyOf<T>[], anyOf<T>, {}, T, "find", {}>
    findLimit(query: FilterQuery<T>, limit: number): mongoose.Query<anyOf<T>[], anyOf<T>, {}, T, "find", {}>
    populated(query: FilterQuery<T>, and?: DefPopulateOptions<T>): mongoose.Query<anyOf<T>[], anyOf<T>, {}, T, "find", {}>
    populatedOne(query: FilterQuery<T>, and?: DefPopulateOptions<T>): mongoose.Query<anyOf<T>, anyOf<T>, {}, T, "findOne", {}>
    count(query: FilterQuery<T>): mongoose.Query<number, anyOf<T>, {}, T, "countDocuments", {}>
    updateOrCreate(query: FilterQuery<T>, update: UpdateQuery<T>): Promise<anyOf<T> | mongoose.UpdateWriteOpResult>
    findById(id: Types.ObjectId): mongoose.Query<anyOf<T>[], anyOf<T>, {}, T, "find", {}>
    deleteById(_id: Types.ObjectId | string): Promise<mongoose.mongo.DeleteResult>
    whereId(id: Types.ObjectId): mongoose.Query<anyOf<T>[], anyOf<T>, {}, T, "find", {}>
}
export type ModelType<T, ModelMethods = {}> = Model<T> & Pick<BaseModelInterface<T>, keyof BaseModelInterface<T>> & Pick<ModelMethods, keyof ModelMethods>;

export type BaseModelSchemaDefinition<T> = SchemaDefinition<
    SchemaDefinitionType<T>,
    any
>;
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
    public collection!: ModelType<T, ModelMethods>
    private onConnection(connection?: DBConnectionPool) {
        if (!connection) connection = this.getDefaultConnection()
        const conn = ConnectDatabase(connection!);
        this.defineSchemas(conn)
        return conn.models[this.collection_name] as ModelType<T, ModelMethods>;
    }
    private getDefaultConnection() {
        const tmp = Object.keys(globalsWithMongoose?.databaseConnections)
            .map((key) => ({ key, ...globalsWithMongoose?.databaseConnections?.[key] }))
            .sort((a, b) => (a.priority || 0) - (b.priority || 0));
        const firstDefault = tmp.find((conn) => conn.default == true);
        return firstDefault ? firstDefault.key : tmp[0].key;
    }
    private defineSchemas(conn: mongoose.Connection){
        Object.keys(globalsWithMongoose.mongooseSchemas).forEach((schema_name) => {
            if (!conn.models[schema_name]) conn.model(schema_name, globalsWithMongoose.mongooseSchemas[schema_name]);
        });
    }
    public load() {
        const methods = [
            ...Reflect.ownKeys(Object.getPrototypeOf(this)),
            'isEmpty', 'findAll', 'findLimit', 'populated', 'populatedOne', 'count', 'updateOrCreate', 'findById', 'deleteById', 'whereId'
        ].filter((p: any) => !['constructor'].includes(p));
        this.configureSchemas(methods);
        this.collection = this.onConnection()
        return this.collection;
    }

    private configureSchemas(methods: any[]) {
        if (!globalsWithMongoose.mongooseSchemas) globalsWithMongoose.mongooseSchemas = {};
        if (globalsWithMongoose.mongooseSchemas[this.collection_name]) return;
        const nSchema = new mongoose.Schema<T>(this.fields);
        if (nSchema.plugin) nSchema.plugin(DatabaseSchemaPlugin, this);
        methods.map((method) => [
            method.toString(),
            (...args: any[]) => this[method.toString()](...args)
        ]).forEach((k: any) => {
            nSchema.static(k[0], (...args: any) => k[1](...args))
        });
        globalsWithMongoose.mongooseSchemas[this.collection_name] = nSchema;
    }

    private isEmpty() {
        return this.collection.exists({});
    }

    private findAll() {
        return this.collection.find({});
    }

    private findLimit(query: FilterQuery<T>, limit: number) {
        return this.collection.find(query).limit(limit);
    }

    private populated(query: FilterQuery<T>, and?: DefPopulateOptions<T>) {
        const find = this.collection.find(query);
        if (this.populate.length > 0)
            return find.populate([...this.populate, ...(and || [])]);
        return find;
    }

    private populatedOne(query: FilterQuery<T>, and?: DefPopulateOptions<T>) {
        const find = this.collection.findOne(query);
        if (this.populate.length > 0)
            return find.populate([...this.populate, ...(and || [])]);
        return find;
    }

    private count(query: FilterQuery<T>) {
        return this.collection.countDocuments(query);
    }

    private async updateOrCreate(query: FilterQuery<T>, update: UpdateQuery<T>) {
        return (await this.collection.find(query))
            ? await this.collection.updateOne(query, update).exec()
            : await this.collection.create(update);
    }

    private findById(id: Types.ObjectId) {
        return this.collection.find({ _id: id });
    }

    private deleteById(_id: Types.ObjectId | string) {
        return this.collection.deleteOne({ _id }).exec();
    }

    private whereId(id: Types.ObjectId) {
        return this.collection.find({ _id: id });
    }

    private populateOptions() {
        return this.populate;
    }
}
