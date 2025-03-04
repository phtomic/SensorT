import { Express } from 'express';
import * as http from 'http';
export class RoutesController {
  private Router: Express;
  private server: http.Server;
  constructor(router: Express) {
    this.Router = router;
    this.server = http.createServer(this.Router);
  }

  public listen(port: number) {
    this.server.listen(port);
  }

  public getServer() {
    return this.server;
  }
}
