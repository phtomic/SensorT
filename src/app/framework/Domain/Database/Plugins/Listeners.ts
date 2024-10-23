import mongoose from "mongoose";

export default function (schema: mongoose.Schema<any>, opts: any) {
    let options = {
        update: { ...opts, action: 'UPDATE' },
        create: { ...opts, action: 'CREATE' },
        delete: { ...opts, action: 'DELETE' }
    }
    schema.pre('save', function (next) {
        if (this.isNew) {
            addListenerCreate(this, options.create)
        }
        addListenerUpdate(this, options.update)
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
        addListenerDelete(this, opts)
    });
    return schema
}
const addListenerUpdate = (act, opts) => {
    if (opts.listeners?.onUpdate?.length > 0)
        opts.listeners.onUpdate.forEach(listener => listener(act))
}
const addListenerDelete = (act, opts) => {
    if (opts.listeners?.onDelete?.length > 0)
        opts.listeners.onDelete.forEach(listener => listener(act))
}
const addListenerCreate = (act, opts) => {
    if (opts.listeners?.onCreate?.length > 0)
        opts.listeners.onCreate.forEach(listener => listener(act))
}
const flattenObject = (obj) => Object.keys(obj).reduce((data, key) => {
    if (key.indexOf('$') === 0) { Object.assign(data, obj[key]); }
    else { data[key] = obj[key]; }
    return data;
}, {});
const addUpdate = (query, next, multi, opts) => {
    const updated = flattenObject(query._update);
    let counter = 0;
    return query.find(query._conditions).lean(true).cursor().eachAsync(fromDb => {
        if (!multi && counter++) return next();
        const orig = Object.assign(fromDb, updated);
        orig.constructor.modelName = query._collection.collectionName;
        addListenerUpdate(orig, opts)
    }).then(() => next()).catch(next);
};