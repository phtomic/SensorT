import { BaseModel, Populator, Types } from "@sensort/mongoose";

export interface ExampleModelInterface{
    example_field: string,
    example_self_ref: Populator
}

class ExampleSchema extends BaseModel<ExampleModelInterface, ExampleSchema>{
    public fields = {
        example_field: String,
        example_self_ref: { ref: 'example_schema', type: Types.ObjectId}
    }
    public collection_name: string = 'example_schema';
}

const ExampleModel = new ExampleSchema().load()
export default ExampleModel