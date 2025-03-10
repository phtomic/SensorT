import BaseModel from '../src/Domain/Database/Mongoose/BaseModel';
import MongooseConnection from '../src/Domain/Database/Mongoose/MongooseConnection';
import { isEmpty } from 'lodash';


MongooseConnection('default', () => ({
    database: 'tests',
    host: '172.16.24.13'
}))

class TestModel extends BaseModel<{ anyfield: string }, TestModel> {    
    public fields = {
        anyfield: String
    }
    public collection_name: string = 'test_collection';
    public async test_method() {
        return this.collection.findAll()
    }
    public syncNoCall() {
        return true
    }
}
(async function () {
    try {
        const model = new TestModel().load()
        const created = await model.create({ anyfield: 'teste' })
        const find = await model.test_method()
        const find_2 = await model.findAll()
        const deleted = await created.deleteOne()
        const test_results = [
            !isEmpty(created),
            !isEmpty(find.filter(f => f._id.toString() === created._id.toString())),
            !isEmpty(find_2.filter(f => f._id.toString() === created._id.toString())),
            deleted.acknowledged === true,
            model.syncNoCall()
        ]
        console.info(`Results passed ${test_results.filter(f => f === true).length} of ${test_results.length} tests`);
        ['Create test', 'Find all by method test', 'Find all test', 'Delete test', 'No collection test'].forEach((f, k) => console.info(test_results[k]?"[PASSED]":"[FAILED]",f))
    } catch (err) {
        console.error(err)
    }
})()