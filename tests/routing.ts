import { response, Routing } from "../src/Domain/Routing";
import { Kernel } from "../src/Domain/App/Kernel";

class TestMiddleware{
    public handle(){
        return true;
    }
    public static async dd(){
        response().send(200)
    }
}
const router = new Routing().middleware([TestMiddleware, TestMiddleware]).plugin([TestMiddleware])
router.group('s').get("/test", ()=> TestMiddleware.dd())
router.group('p').get("/test2", async ()=> console.log('teste2'))
router.start(8181)

new Kernel();