
import mongoose, { Types } from 'mongoose';
import BaseModel from './BaseModel';
class LogsModel extends BaseModel<{ logMessage: string,type: string,priority: number,path: string,time: number,usuario?: Types.ObjectId,controller?: string,model?: string,action?: string,model_id?: Types.ObjectId}> {
    public fields = {
        logMessage: String,
        type: String,
        priority: Number,
        path: String,
        time: Number,
        usuario: mongoose.Types.ObjectId,
        controller: String,
        model: String,
        action: String,
        model_id: mongoose.Types.ObjectId
    };
    public collection_name: string = 'logs';
}


const Logs = new LogsModel().load();
export default Logs
