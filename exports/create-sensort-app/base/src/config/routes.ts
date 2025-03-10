import ExampleController from '@/controllers/example.controller'
import ExampleMiddleware from '@/middlewares/example.middleware'
import ExamplePlugin from '@/plugins/example.plugin'
import { Routing } from '@sensort/router'
const APP = new Routing().plugin([ExamplePlugin])

APP.middleware([ExampleMiddleware])
    .get("/example", () => ExampleController.example())

APP.start(8000)