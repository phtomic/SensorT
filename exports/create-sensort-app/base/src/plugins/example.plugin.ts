import { Server } from "http";

export default class ExamplePlugin{
    async handle(server: Server){
        console.log('Plugin installed')
        return true;
    }
}