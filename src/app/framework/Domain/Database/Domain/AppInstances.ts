import BaseModel from './BaseModel';
class AppInstancesModel extends BaseModel<{
    cors: Array<string>;
    slug: string;
    enabled: boolean;
}, AppInstancesModel> {
    public fields = {
        slug: String,
        cors: Object,
        enabled: Boolean
    };
    public collection_name: string = 'app_instances';
}

const AppInstances = new AppInstancesModel().load();
export default AppInstances
