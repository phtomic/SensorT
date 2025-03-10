export default class ExampleMiddleware{
    async handle(){
        console.info("Middleware called")
        return true;
    }
}