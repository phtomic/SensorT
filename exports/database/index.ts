import BaseModel from '../../src/Domain/Database/BaseModel';
import { AggregateBuilder } from '../../src/Domain/Database/Plugins/AggregateBuilder';
import { Populator } from '../../src/Domain/Database/Exports';
import DbConnection from '../../src/Domain/Database/DbConnection';
import { UseMigrations } from '../../src/Domain/Database/Plugins/Migrations';

export const Aggregator = () => new AggregateBuilder();
export { BaseModel, DbConnection, Populator, UseMigrations };
export { Types } from 'mongoose';
