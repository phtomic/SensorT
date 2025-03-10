import { response } from "@sensort/router";

export default class ExampleService{
    static async example(){
        response().send(true)  
    }
}