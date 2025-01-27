import express, { Express } from 'express';
import { createServer, Server } from 'http';
export class ExpressController {
    private app: Express;
    private server: Server;
    constructor() {
        this.app = express();
        this.server = createServer(this.app)
    }

    public getRouter(): Express {
        return this.app;
    }

    public getServer(): Server {
        return this.server;
    }
}
