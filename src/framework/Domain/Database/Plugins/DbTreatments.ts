import mongoose, { Types } from 'mongoose';
function ParseTypes(data, config) {
    Object.keys(data).forEach((field) => {
        try {
            const dataType = config.fields[field];
            if (dataType === Date && data[field]) {
                data[field] = new Date(data[field]).toISOString();
            }
        } catch (err) { }
    });
    const now = new Date();
    data.updated = now
    data.updated_at = now
    data.updatedAt = now
    if (data.isNew) {
        data.created = now
        data.created_at = now
        data.createdAt = now
    }

    return data;
}
const DbTreatments = function (schema: mongoose.Schema<any>, config: any) {
    schema.pre('save', function (next) {
        const types = ParseTypes(this, config);
        Object.keys(types).forEach((e) => (this[e] = types[e]));
        next();
    });
    schema.pre(['findOneAndUpdate', 'updateOne', 'replaceOne'], function (next) {
        (this as any)._update = ParseTypes((this as any)._update, config);
        next();
    });
    schema.pre(['updateMany'], function (next) {
        (this as any)._update = ParseTypes((this as any)._update, config);
        next();
    });
    return schema;
};
export default DbTreatments;
