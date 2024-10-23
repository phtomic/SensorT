import { Express, Request, Response } from "express";
import { Server } from "socket.io";
import * as http from "http"
import { BaseController } from "./BaseController";
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

    public getIo() {
        return this.io
    }

    private initRoutes(routes: Object) {
        if (routes['socket.io']) {
            let socketIoConfig = routes['socket.io']
            Object.keys(socketIoConfig).forEach((config) => {
                Object.keys(socketIoConfig[config]).forEach((element: any) => {
                    let routing = socketIoConfig[config][element]
                    try {
                        this.io![element.toString().toLowerCase()](element[0], element[1])
                    } catch (err) { console.info("Rota nao encontrada: ".concat("socket_io-", config, "-", element, " | ", JSON.stringify(routing))) }
                });
            })
        }
        Object.keys(routes['routes']).forEach((prefix) => {
            try {
                let path = routes['routes'][prefix]
                let apiMiddlewares: Array<any> = routes['middleware'] || []
                if (!Array.isArray(path) && typeof path === "object") {
                    Object.keys(path).forEach(routeType => {
                        Object.keys(path[routeType]).forEach(async (route) => {
                            let routeTypeMiddlewares = [
                                ...apiMiddlewares,
                                ...path?.middlewares || []
                            ]
                            let tmp = path?.[routeType]?.[route]
                            if (routeType == "redirect")
                                return this.Router[tmp[0].toLowerCase()]('/' + route, (req: Request, res: Response) => {
                                    res.redirect(tmp[1])
                                });

                            if (tmp[0] === undefined) return;
                            const middlewares = [
                                ...routeTypeMiddlewares,
                                ...tmp[2]?.middlewares || []
                            ]
                            let pointer = `/${prefix}/${route}`
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
                                        if (!(c instanceof BaseController)) return console.info(`${tmp[0].name} not a controller class`);
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
                console.log(err)
            }
        })
    }
}