import ExampleService from "@/services/example.service";

export default class ExampleController{
    static async example(){
        ExampleService.example()
    }
}