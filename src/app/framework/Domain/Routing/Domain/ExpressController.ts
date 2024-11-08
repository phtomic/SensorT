import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import express, { Express, Request, Response, NextFunction } from 'express'
import path from 'path';
import { getStorage, SessionStorage, setStorage } from '../Plugins/SessionStorage';

export class ExpressController {
    private app: Express;
    constructor() {
        this.app = express();
        this.config();
    }

    private config() {
        // Configurações gerais do Express

        // Define o diretório público para servir arquivos estáticos
        this.app.use(express.static(path.join(__dirname, 'public')));

        // Middleware para analisar cookies
        this.app.use(cookieParser("NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c="));
        // Middleware para analisar o corpo das requisições como JSON
        this.app.use(bodyParser.json({ limit: '50mb' }));

        // Middleware para analisar o corpo das requisições codificadas em URL
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

        // Middleware para tratamento de erros
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            this.cors(req, res, { cors: [req.headers.origin, req.body.origin] })
            console.error("Erro no endpoint:".concat(req.path, "\n", err, '\n', new Error().stack?.toString() || "NO STACKTRACE"))
            res.status(500).send('Something broke!')
        });

        // Middleware para configurações de controle de acesso
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            this.cors(req, res, { cors: [req.headers.origin] })
            SessionStorage(async () => {
                setStorage('request', req);
                setStorage('response', res);
                setStorage('originalUrl', req?.originalUrl);
                next();
            })
        });
    }

    cors(req: Request, res: Response, instance: any) {
        setStorage('access-origin', req.headers.origin)
        res.header('Access-Control-Allow-Origin', (instance?.cors || []).includes(req.headers.origin) ? req.headers.origin : '');
        res.header('Access-Control-Allow-Credentials', "true");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Access-Token');
        res.header('Access-Control-Expose-Headers', 'Access-Token');
    }

    public getRouter(): Express {
        return this.app;
    }
}

export function request(): Request {
    return getStorage<Request>('request') as Request;
}
export function response(): Response {
    return getStorage<Response>('response') as Response;
}
export function getAccessOrigin(): string {
    return getStorage<string>('access-origin');
}
export function getOriginalUrl(): string {
    return getStorage<string>('originalUrl');
}