import BaseModel from '../../src/Domain/Database/Mongoose/BaseModel';
import { AggregateBuilder } from '../../src/Domain/Database/Mongoose/Plugins/AggregateBuilder';
import { Populator } from '../../src/Domain/Database/Mongoose/Exports';
import MongooseConnection from '../../src/Domain/Database/Mongoose/MongooseConnection';
import { UseMigrations } from '../../src/Domain/Database/Mongoose/Plugins/Migrations';
import { BaseModelInterface } from '../../src/Domain/Database/Mongoose/BaseModel';

export const Aggregator = () => new AggregateBuilder();
export { BaseModel, MongooseConnection, Populator, UseMigrations, BaseModelInterface };
export { Types } from 'mongoose';
