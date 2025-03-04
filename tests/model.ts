import BaseModel from '../src/Domain/Database/BaseModel';
import DbConnection from '../src/Domain/Database/DbConnection';


DbConnection('default', () => ({
    database: 'tests',
    host: '172.16.24.13'
}))

class TestModel extends BaseModel<{anyfield:string}, TestModel> {
    public fields = {
        anyfield: String
    }
    public async test_method(test_arg: any) {
        
    }
}
const model = new TestModel().load()