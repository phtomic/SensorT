"use strict";

import { Routes } from "../../../app/config/routes";
import { NetworkConfig } from "../../../app/config/network";
import { LogsController } from "./Logs";
import { Kernel } from "./Kernel";
import { env } from "./Globals";
import { ExpressController } from "../Routing/Domain/ExpressController";
import { RoutesController } from "../Routing/Domain/RoutesController";

export class App {
    private routes: Routes;
    private networkConfig: NetworkConfig;
    private kernel: Kernel
    constructor() {
        this.kernel = new Kernel()
        this.routes = new Routes();
        this.networkConfig = new NetworkConfig();
        try {
            new LogsController(this.kernel);
            if(!this.kernel.isCommand && this.kernel.canServe) this.route()
        } catch (e) { }
    }
    private route() {
        // Itera sobre as rotas definidas na classe Routes
        this.routes.starts.forEach((route) => {
            // Verifica se a rota está configurada no arquivo de configuração NetworkConfig
            if (this.networkConfig[route.toLowerCase()]) {
                // Inicia o servidor para a rota especificada
                this.startServer(route);
            }
        })
    }

    private startServer(pointer: string) {
        // Obtém a rota e as configurações do arquivo de configuração NetworkConfig
        const route = this.routes[pointer.toLowerCase()];
        const config = this.networkConfig[pointer.toLowerCase()];
        // Verifica se a rota está definida
        if (route != undefined) {
            // Cria uma instância da classe ExpressController, passando as configurações de autenticação e a instância da classe Globals
            const controller = new ExpressController();
            // Cria uma instância da classe RoutesController, passando o router do ExpressController, a rota e a instância da classe Globals
            const router = new RoutesController(controller.getRouter(), route);
            // Inicia o servidor para a rota especificada na porta definida nas configurações
            router.listen(config.port);
            if(env("APP_ENV")=='local') console.debug(`Server initialized ${pointer}: ${config.port}`)
            return;
        }
        console.debug(`No routes configured for ${pointer}`);
    }
}
