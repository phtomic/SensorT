import { Express, Request, Response } from "express";
import { Server } from "socket.io";
import * as http from "http"
export class RoutesController {

    private Router: Express;
    private io?: Server;
    private server: http.Server
    constructor(router: Express, routes: Object) {
        this.Router = router;
        this.server = http.createServer(router)
        if (Object.keys(routes).includes("socket.io")) {
            this.io = new Server(this.server, {
                cors: {
                    origin: '*',
                }
            })
        }
        this.initRoutes(routes);
    }

    public listen(port: number) {
        this.server.listen(port);
    }

    private initRoutes(routes: any) {


        Object.keys(routes?.routes).forEach((prefix) => {
            try {
                const path = routes.routes[prefix]
                const apiMiddlewares: Array<any> = routes.middleware || []
                if (!Array.isArray(path) && typeof path === "object") {
                    Object.keys(path).forEach(routeType => {
                        Object.keys(path[routeType]).forEach(async (route) => {
                            const routeTypeMiddlewares = [
                                ...apiMiddlewares,
                                ...path?.middlewares || []
                            ]
                            const tmp = path?.[routeType]?.[route]
                            if (routeType == "redirect")
                                return this.Router[tmp[0].toLowerCase()](`/${route}`, (req: Request, res: Response) => {
                                    res.redirect(tmp[1])
                                });

                            if (tmp[0] === undefined) return;
                            const middlewares = [
                                ...routeTypeMiddlewares,
                                ...tmp[2]?.middlewares || []
                            ]
                            const pointer = `/${prefix}/${route}`
                            middlewares.forEach((middleware) => {
                                this.Router.use(pointer, async (req, res, next) => {
                                    try{
                                        if (await (new middleware()).handle()) next();
                                        else res.status(500);
                                    } catch (err: any) {
                                        console.error(err)
                                        res.status(500).send(err)
                                    }
                                })
                            })
                            this.Router[routeType.toLowerCase()](
                                pointer,
                                async (request: Request, response: Response) => {
                                    try {
                                        const c = new tmp[0](request, response)
                                        if (c[tmp[1]] == undefined) return console.info(`Route not found: ${tmp[0].name} - ${tmp[1]}`);
                                        c[tmp[1]](request, response)
                                    } catch (err: any) {
                                        console.error(err)
                                        response.status(500).send(err)
                                    }
                                }
                            );
                        })
                    })
                } else if (Array.isArray(path)) {
                    this.Router[path[0].toLowerCase()](path[1], (request: Request, response: Response) => path[2](request, response))
                }
            } catch (err) {
                console.error(err)
            }
        })
    }
}