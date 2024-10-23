import { type PipelineStage } from "mongoose";
type Pipeline = Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[]
export class AggregateBuilder {
    private _aggregateArr: Array<PipelineStage> = [];
    constructor() { }

    get() {
        return this._aggregateArr as Pipeline;
    }
    pipeline(args: Pipeline){
        args.forEach((pipeline)=>this._aggregateArr.push(pipeline))
        return this;
    }
    addFields(args: PipelineStage.AddFields["$addFields"]) {
        this._aggregateArr.push({ $addFields: args });
        return this;
    }

    bucket(args: PipelineStage.Bucket["$bucket"]) {
        this._aggregateArr.push({ $bucket: args });
        return this;
    }

    bucketAuto(args: PipelineStage.BucketAuto["$bucketAuto"]) {
        this._aggregateArr.push({ $bucketAuto: args });
        return this;
    }

    collStats(args: PipelineStage.CollStats["$collStats"]) {
        this._aggregateArr.push({ $collStats: args });
        return this;
    }

    count(args: PipelineStage.Count["$count"]) {
        this._aggregateArr.push({ $count: args });
        return this;
    }

    densify(args: PipelineStage.Densify["$densify"]) {
        this._aggregateArr.push({ $densify: args });
        return this;
    }

    facet(args: PipelineStage.Facet["$facet"]) {
        this._aggregateArr.push({ $facet: args });
        return this;
    }

    fill(args: PipelineStage.Fill["$fill"]) {
        this._aggregateArr.push({ $fill: args });
        return this;
    }

    geoNear(args: PipelineStage.GeoNear["$geoNear"]) {
        this._aggregateArr.push({ $geoNear: args });
        return this;
    }

    graphLookup(args: PipelineStage.GraphLookup["$graphLookup"]) {
        this._aggregateArr.push({ $graphLookup: args });
        return this;
    }

    group(args: PipelineStage.Group["$group"]) {
        this._aggregateArr.push({ $group: args });
        return this;
    }

    indexStats(args: PipelineStage.IndexStats["$indexStats"]) {
        this._aggregateArr.push({ $indexStats: args });
        return this;
    }

    limit(args: PipelineStage.Limit["$limit"]) {
        this._aggregateArr.push({ $limit: args });
        return this;
    }

    listSessions(args: PipelineStage.ListSessions["$listSessions"]) {
        this._aggregateArr.push({ $listSessions: args });
        return this;
    }

    lookup(args: PipelineStage.Lookup["$lookup"]) {
        this._aggregateArr.push({ $lookup: args });
        return this;
    }

    match(args: PipelineStage.Match["$match"]) {
        this._aggregateArr.push({ $match: args });
        return this;
    }

    merge(args: PipelineStage.Merge["$merge"]) {
        this._aggregateArr.push({ $merge: args });
        return this;
    }

    out(args: PipelineStage.Out["$out"]) {
        this._aggregateArr.push({ $out: args });
        return this;
    }

    planCacheStats(args: PipelineStage.PlanCacheStats["$planCacheStats"]) {
        this._aggregateArr.push({ $planCacheStats: args });
        return this;
    }

    project(args: PipelineStage.Project["$project"]) {
        this._aggregateArr.push({ $project: args });
        return this;
    }

    redact(args: PipelineStage.Redact["$redact"]) {
        this._aggregateArr.push({ $redact: args });
        return this;
    }

    replaceRoot(args: PipelineStage.ReplaceRoot["$replaceRoot"]) {
        this._aggregateArr.push({ $replaceRoot: args });
        return this;
    }

    replaceWith(args: PipelineStage.ReplaceWith["$replaceWith"]) {
        this._aggregateArr.push({ $replaceWith: args });
        return this;
    }

    sample(args: PipelineStage.Sample["$sample"]) {
        this._aggregateArr.push({ $sample: args });
        return this;
    }

    search(args: PipelineStage.Search["$search"]) {
        this._aggregateArr.push({ $search: args });
        return this;
    }

    set(args: PipelineStage.Set["$set"]) {
        this._aggregateArr.push({ $set: args });
        return this;
    }

    setWindowFields(args: PipelineStage.SetWindowFields["$setWindowFields"]) {
        this._aggregateArr.push({ $setWindowFields: args });
        return this;
    }

    skip(args: PipelineStage.Skip["$skip"]) {
        this._aggregateArr.push({ $skip: args });
        return this;
    }

    sort(args: PipelineStage.Sort["$sort"]) {
        this._aggregateArr.push({ $sort: args });
        return this;
    }

    sortByCount(args: PipelineStage.SortByCount["$sortByCount"]) {
        this._aggregateArr.push({ $sortByCount: args });
        return this;
    }

    unionWith(args: PipelineStage.UnionWith["$unionWith"]) {
        this._aggregateArr.push({ $unionWith: args });
        return this;
    }

    unset(args: PipelineStage.Unset["$unset"]) {
        this._aggregateArr.push({ $unset: args });
        return this;
    }

    unwind(args: PipelineStage.Unwind["$unwind"]) {
        this._aggregateArr.push({ $unwind: args });
        return this;
    }
}