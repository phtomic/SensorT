import BaseModel from '../../framework/Domain/Database/Domain/BaseModel';
import { AggregateBuilder } from '../../framework/Domain/Database/Plugins/AggregateBuilder';
import { DbConnection, Populator } from '../../framework/Domain/Database/Domain/BaseModel';
export const Aggregator = () => new AggregateBuilder();
export { BaseModel, DbConnection, Populator };
export { Types } from 'mongoose';
