import * as express from 'express';
import { Request, Response, Express } from 'express';
import mongoose, { Types, FilterQuery, UpdateQuery, Model, IfAny, Document, Require_id, SchemaDefinition, SchemaDefinitionType, PopulateOptions, PipelineStage } from 'mongoose';
export { Types } from 'mongoose';
import { AxiosStatic, AxiosRequestConfig, AxiosResponse } from 'axios';

declare class BaseController {
    user?: Types.ObjectId;
    constructor(request: Request, response: Response);
}
declare enum RouteTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}
type AnyPluginMidleware$1 = Array<any>;
type RouteMethods = {
    [key in RouteTypes]?: {
        [x: string]: [any, string];
    };
};
type RouteEndpoints = {
    [path: string]: RouteMethods;
};
type RoutePaths = {
    plugin?: AnyPluginMidleware$1;
    middleware: AnyPluginMidleware$1;
    ExpressConfig?: any;
    routes?: RouteEndpoints;
};

declare const env: (...args: Array<string | any>) => any;
declare function mapAsync<T>(array: Array<T>, callback: (data: T, index: number) => Promise<any>): Promise<T[]>;
declare const sleep_async: (ms: any) => Promise<unknown>;
type AppConfigTypes = "MIGRATIONS_PATH";
declare function UseConfig(config: AppConfigTypes, value: any): void;

declare class ExpressController {
    private app;
    constructor();
    getRouter(): Express;
}

type AnyPluginMidleware = Array<any>;
type RequestCallback = (request?: Request, response?: Response) => Promise<any>;
declare class Routing {
    private plugins;
    private middlewares;
    private path;
    private controller;
    constructor(path?: string, middlewares?: AnyPluginMidleware, plugins?: AnyPluginMidleware, controller?: ExpressController);
    groupMiddleware(middlewares: AnyPluginMidleware): Routing;
    groupPlugins(plugins: AnyPluginMidleware): Routing;
    group(path: string): Routing;
    get(path: string, callback: RequestCallback, name?: string, without?: AnyPluginMidleware): this;
    post(path: string, callback: RequestCallback, name?: string, without?: AnyPluginMidleware): this;
    delete(path: string, callback: RequestCallback, name?: string, without?: AnyPluginMidleware): this;
    patch(path: string, callback: RequestCallback, name?: string, without?: AnyPluginMidleware): this;
    put(path: string, callback: RequestCallback, name?: string, without?: AnyPluginMidleware): this;
    private newRoute;
    router(): express.Express;
    use(callback: any): this;
    start(port?: number): this;
}
declare function request(): Request;
declare function response(): Response;

declare const CreateCommand: (input: string, callback: (...command: any) => Promise<any>) => void;

declare function getStorage<T>(key: any): T;
declare function setStorage<T>(key: any, value: any): T;
declare function SessionStorage(cb: () => Promise<void>): void;

declare const Session: {
    storage: typeof SessionStorage;
    getStorage: typeof getStorage;
    setStorage: typeof setStorage;
};

type DbConnectionConfig = {
    username?: string;
    password?: string;
    database: string;
    host: string;
    srv?: boolean;
    port?: number;
    default?: boolean;
    priority?: number;
};
type DBConnectionPool = string;
type BaseModelListener = {
    onDelete?: Array<(doc: any) => void>;
    onUpdate?: Array<(doc: any) => void>;
    onCreate?: Array<(doc: any) => void>;
};
type ModelType<T, M> = T & BaseModel<T, {}> & Model<T, {}, {}, {}, IfAny<T, any, Document<T | any, {}, T> & Require_id<T>>, any> & M;
type BaseModelSchemaDefinition<T> = SchemaDefinition<SchemaDefinitionType<T>, any>;
type DBPlugins = Array<(schema: mongoose.Schema<any>, opts: any) => any>;
type DefPopulateOptions<T> = Array<string | PopulateOptions>;
declare class BaseModel<T, ModelMethods = {}> {
    readonly fields: BaseModelSchemaDefinition<T>;
    readonly collection_name: string;
    readonly ignoreDefaultFields?: boolean;
    protected readonly ignoredFields?: string[];
    readonly ignoredFieldsAudit?: string[];
    protected readonly audit_fields: Array<[string, string, string]>;
    protected readonly plugins: DBPlugins;
    protected readonly beforeSave?: (dados: any) => any;
    protected readonly listeners: BaseModelListener;
    protected readonly populate: DefPopulateOptions<T>;
    protected collection(connection?: DBConnectionPool): ModelType<T, ModelMethods>;
    load(): (connection?: DBConnectionPool) => ModelType<T, ModelMethods>;
    private configureSchemas;
    isEmpty(): mongoose.Query<{
        _id: mongoose.InferId<T>;
    }, mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "findOne", {}>;
    findAll(): mongoose.Query<mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>[], mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "find", {}>;
    findLimit(query: FilterQuery<T>, limit: number): mongoose.Query<mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>[], mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "find", {}>;
    populated(query: FilterQuery<T>, and?: DefPopulateOptions<T>): mongoose.Query<mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>[], mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "find", {}>;
    populatedOne(query: FilterQuery<T>, and?: DefPopulateOptions<T>): mongoose.Query<mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "findOne", {}>;
    count(query: FilterQuery<T>): mongoose.Query<number, mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "countDocuments", {}>;
    updateOrCreate(query: FilterQuery<T>, update: UpdateQuery<T>): Promise<mongoose.UpdateWriteOpResult | mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>>;
    findById(id: Types.ObjectId): mongoose.Query<mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>[], mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "find", {}>;
    deleteById(_id: Types.ObjectId | string): Promise<mongoose.mongo.DeleteResult>;
    whereId(id: Types.ObjectId): mongoose.Query<mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>[], mongoose.IfAny<T, any, mongoose.Document<any, {}, T> & mongoose.Require_id<T>>, {}, T, "find", {}>;
    populateOptions(): DefPopulateOptions<T>;
}
declare const DbConnection: (type: string, cb: () => DbConnectionConfig) => boolean;

type Pipeline = Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[];
declare class AggregateBuilder {
    private _aggregateArr;
    constructor();
    get(): Pipeline;
    pipeline(args: Pipeline): this;
    addFields(args: PipelineStage.AddFields['$addFields']): this;
    bucket(args: PipelineStage.Bucket['$bucket']): this;
    bucketAuto(args: PipelineStage.BucketAuto['$bucketAuto']): this;
    collStats(args: PipelineStage.CollStats['$collStats']): this;
    count(args: PipelineStage.Count['$count']): this;
    densify(args: PipelineStage.Densify['$densify']): this;
    facet(args: PipelineStage.Facet['$facet']): this;
    fill(args: PipelineStage.Fill['$fill']): this;
    geoNear(args: PipelineStage.GeoNear['$geoNear']): this;
    graphLookup(args: PipelineStage.GraphLookup['$graphLookup']): this;
    group(args: PipelineStage.Group['$group']): this;
    indexStats(args: PipelineStage.IndexStats['$indexStats']): this;
    limit(args: PipelineStage.Limit['$limit']): this;
    listSessions(args: PipelineStage.ListSessions['$listSessions']): this;
    lookup(args: PipelineStage.Lookup['$lookup']): this;
    match(args: PipelineStage.Match['$match']): this;
    merge(args: PipelineStage.Merge['$merge']): this;
    out(args: PipelineStage.Out['$out']): this;
    planCacheStats(args: PipelineStage.PlanCacheStats['$planCacheStats']): this;
    project(args: PipelineStage.Project['$project']): this;
    redact(args: PipelineStage.Redact['$redact']): this;
    replaceRoot(args: PipelineStage.ReplaceRoot['$replaceRoot']): this;
    replaceWith(args: PipelineStage.ReplaceWith['$replaceWith']): this;
    sample(args: PipelineStage.Sample['$sample']): this;
    search(args: PipelineStage.Search['$search']): this;
    set(args: PipelineStage.Set['$set']): this;
    setWindowFields(args: PipelineStage.SetWindowFields['$setWindowFields']): this;
    skip(args: PipelineStage.Skip['$skip']): this;
    sort(args: PipelineStage.Sort['$sort']): this;
    sortByCount(args: PipelineStage.SortByCount['$sortByCount']): this;
    unionWith(args: PipelineStage.UnionWith['$unionWith']): this;
    unset(args: PipelineStage.Unset['$unset']): this;
    unwind(args: PipelineStage.Unwind['$unwind']): this;
}

declare const Aggregator: () => AggregateBuilder;

declare class Crypt {
    static encrypt(txt: string): string;
    static generateKey(save_env?: boolean): string;
    static oneWayEncrypt(txt: string): string;
    static generateToken(): string;
    private static getAppKey;
    static decrypt(txt: string): string;
    static md5(txt: string): string;
}

declare function parseDate(replace?: string, d?: Date): string;

declare function parseObject(obj: any, path: string): any;

type CronTime = string;

declare class Consumer {
    interval: CronTime;
    onBoot?: boolean;
    handle(data: Object): Promise<any>;
}
declare const SensorCron: {
    Consumer: typeof Consumer;
};
declare const startCronjob: (interval: CronTime, callback: (cron: string) => Promise<any>) => void;
declare const restartCronjob: (uuid: string) => boolean;
declare const releaseCronjob: (uuid: string) => boolean;
declare const pauseCronjob: (uuid: string) => boolean;

declare class AxiosController {
    instance: AxiosStatic;
    constructor();
    get(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse | any>;
    post(url: string, params?: AxiosRequestConfig, headers?: AxiosRequestConfig): Promise<AxiosResponse | any>;
    put(url: string, params?: AxiosRequestConfig, headers?: AxiosRequestConfig): Promise<AxiosResponse | any>;
    delete(url: string, params?: AxiosRequestConfig): Promise<AxiosResponse | any>;
}

declare enum UUIDEncoding {
    BASE16,
    BASE36,
    BASE58,
    BASE62,
    BASE66,
    BASE71
}
declare enum UUIDBitSize {
    B128 = 128,
    B256 = 256,
    B512 = 512
}

declare class UUIDGenerator {
    private uuidToken;
    readonly base: number;
    readonly baseEncoding: any;
    readonly bitSize: number;
    readonly length: number;
    constructor(encoding?: UUIDEncoding, bitSize?: UUIDBitSize);
    generate(): string;
}

declare const Parse: {
    parseObject: typeof parseObject;
    parseDate: typeof parseDate;
};

export { Aggregator, type AppConfigTypes, AxiosController, BaseController, BaseModel, CreateCommand, Crypt, DbConnection, Parse, type RoutePaths, Routing, SensorCron, Session, UUIDGenerator, UseConfig, env, mapAsync, pauseCronjob, releaseCronjob, request, response, restartCronjob, sleep_async, startCronjob };
