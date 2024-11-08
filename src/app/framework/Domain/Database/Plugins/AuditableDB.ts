import mongoose, { Schema, Types } from "mongoose";
import { getOriginalUrl } from "../../Routing/Domain/ExpressController";
import { env } from "../../App/Globals";
const deepDiff = require('deep-diff');
const auditSchema = new Schema({
    model_id: Types.ObjectId,
    changes: Object,
    action: String,
    url: String,
    model: String,
    isp_id: Types.ObjectId
}, { timestamps: true });

const isEmpty = (value: any) =>
    value == null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

const types = {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete'
};

const extractArray = (data: any, path: any) => {
    if (path.length === 1) {
        return data[path[0]];
    }
    const parts = [].concat(path);
    const last: any = parts.pop();
    const value = parts.reduce((current, part) => {
        return current ? current[part] : undefined;
    }, data);
    return value ? value[last] : undefined;
};
const addAuditLogObject = (currentObject: any, original: any, opts: any) => {
    if (currentObject?.constructor?.modelName == 'audits') return Promise.resolve();
    const url = getOriginalUrl();
    delete currentObject?.__user;

    const filter = (path: any, key: any) => path.length === 0 && ~['_id', '__v', 'created', 'updated', 'createdAt', 'updatedAt', 'isp_id', ...opts.omit || []].indexOf(key);
    const changes = opts.action == 'DELETE' ? false : deepDiff(
        JSON.parse(JSON.stringify(original)),
        JSON.parse(JSON.stringify(currentObject)),
        filter
    );
    if ((changes?.length) || opts.action == 'DELETE') {
        const audit: any = {
            model_id: currentObject._id || original._id,
            model: currentObject.constructor.modelName,
            action: opts.action,
            url
        }
        if (changes !== false) audit.changes = changes.reduce((obj: any, change: any) => {
            const key = change.path.join('.');
            if (change.kind === 'D') { handleAudits(change.lhs, 'from', types.delete, obj, key) }
            else if (change.kind === 'N') { handleAudits(change.rhs, 'to', types.add, obj, key) }
            else if (change.kind === 'A') {
                if (!obj[key] && change.path.length) {
                    const data: any = { from: extractArray(original, change.path), to: extractArray(currentObject, change.path) }
                    if (data.from.length && data.to.length) { data.type = types.edit }
                    else if (data.from.length) { data.type = types.delete }
                    else if (data.to.length) { data.type = types.add }
                    obj[key] = data;
                }
            } else { obj[key] = { from: change.lhs, to: change.rhs, type: types.edit }; }
            return obj;
        }, {});
        new Audit(audit).save()
    }
    return Promise.resolve();
};

const handleAudits = (changes: any, target: any, type: any, obj: any, key: any) => {
    if (changes) {
        if (typeof changes === 'object') {
            if (Object.keys(changes).filter(key => key === '_id' || key === 'id').length) { obj[key] = { [target]: changes, type } }
            else { Object.entries(changes).forEach(([sub, value]) => { if (!isEmpty(value)) obj[`${key}.${sub}`] = { [target]: value, type } }) }
        } else { obj[key] = { [target]: changes, type }; }
    }
}

const addAuditLog = (currentObject: any, next: any, opts: any) => {
    currentObject.constructor.findOne({ _id: currentObject._id })
        .then(original => addAuditLogObject(currentObject, original, opts))
        .then(() => next()).catch(next);
};
const addCreate = (currentObject: any, next: any, opts: any) => {
    addAuditLogObject(currentObject, {}, opts)
    next();
}

const flattenObject = (obj: any) => Object.keys(obj).reduce((data, key) => {
    if (key.indexOf('$') === 0) { Object.assign(data, obj[key]); }
    else { data[key] = obj[key]; }
    return data;
}, {});

const addUpdate = (query: any, next: any, multi: any, opts: any) => {
    const updated = flattenObject(query._update);
    let counter = 0;
    return query.find(query._conditions).lean(true).cursor().eachAsync((fromDb: any) => {
        if (!multi && counter++) return next();
        const orig = Object.assign(fromDb, updated);
        orig.constructor.modelName = query._collection.collectionName;
        return addAuditLogObject(orig, fromDb, opts);
    }).then(() => next()).catch(next);
};

const addDelete = (currentObject: any, options: any, next: any, opts: any) => {
    const orig = Object.assign({}, currentObject._doc || currentObject);
    orig.constructor.modelName = currentObject.constructor.modelName;
    return addAuditLogObject({ _id: currentObject._id }, orig, opts)
        .then(() => next()).catch(next);
};

const addFindAndDelete = (query: any, next: any, opts: any) => {
    query.find().lean(true).cursor().eachAsync((fromDb: any) => {
        return addDelete(fromDb, query.options, next, opts);
    }).then(() => next()).catch(next);
};
const AuditableDB = (schema: mongoose.Schema<any>, opts: any) => {
    if(!env('SENSORT_AUDITS_ENABLED', false)) return schema;
    
    const options = {
        update: { ...opts, action: 'UPDATE' },
        create: { ...opts, action: 'CREATE' },
        delete: { ...opts, action: 'DELETE' }
    }
    schema.pre('save', function (next) {
        if (this.isNew) {
            addCreate(this, next, options.create)
        }
        addAuditLog(this, next, options.update);
    });
    //Update
    schema.pre(['findOneAndUpdate', 'updateOne', 'replaceOne'], function (next) {
        addUpdate(this, next, false, options.update);
    });
    schema.pre(['updateMany'], function (next) {
        addUpdate(this, next, true, options.update);
    });
    //Delete
    schema.pre(/remove|delete/i, function (next) {
        addFindAndDelete(this, next, options.delete);
    });
    return schema
}
export default AuditableDB
export const Audit = mongoose.model(env('SENSORT_AUDITS_TABLE','audits'), auditSchema);