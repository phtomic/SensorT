import express, { Express } from 'express';
import { createServer, Server } from 'http';
export class ExpressController {
    public app: Express;
    public server: Server;
    constructor() {
        this.app = express();
        this.server = createServer(this.app)
    }
}
