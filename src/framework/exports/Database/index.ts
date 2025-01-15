import BaseModel from "../../Domain/Database/Domain/BaseModel"
import { AggregateBuilder } from "../../Domain/Database/Plugins/AggregateBuilder"
export const Aggregator = ()=> new AggregateBuilder()
export { BaseModel }
export { Types } from "mongoose";