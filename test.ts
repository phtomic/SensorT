import { AppCore, response, Routing } from "./src/exports";
class TestMiddleware{
    public handle(){
        return true;
    }
    public static async dd(){
        response().send(200)
    }
}
const router = new Routing().groupMiddleware([TestMiddleware, TestMiddleware]).groupPlugins([TestMiddleware])
router.group('s').get("/test", ()=> TestMiddleware.dd())
router.group('p').get("/test2", async ()=> console.log('teste2'))
router.start(8181)

new AppCore();