
import { appendFile, appendFileSync, exists, existsSync, writeFile, writeFileSync } from 'fs';
import { response } from '../Routing';
import { getStorage } from '../Routing/Plugins/SessionStorage';
import { parseDate } from '../Plugins/DateParser';
import { globalsConfig } from './Exports';
export class LogsController {
    private logger: any;
    private ignoredErrors = ['EPIPE', 'ERR_IPC_CHANNEL_CLOSED'];
    constructor() {
        // Construtor da classe LogsController
        // Recebe uma instância de Models para acesso aos modelos de banco de dados
        this.logger = {};
        this.configLog('debug');
        this.configLog('info');
        this.configLog('error');
        this.configure();

    }
    private configure(listener: string = '') {
        if (listener == 'uncaughtException' || listener == '') 
            process.once('uncaughtException', async (err) => this.exitHandler(err, { cleanup: true }, 'uncaughtException'))
        if (listener == 'exit' || listener == '') 
            process.once('exit', async (err) => this.exitHandler(err, { cleanup: true }, 'exit'))
    }
    private async exitHandler(message: any, options: any, origin: string) {
        this.configure(origin);
        try {
            if (getStorage('response') && !response().headersSent) {
                response().status(500).send(message);
            }
        } catch (err) { }
        if (
            this.ignoredErrors.map((error) => message.toString().includes(error)).includes(true)
        ) return true;
        const errorLog = (options.cleanup && !globalsConfig.sensortConfig.failKeepAlive) ? `Shutdown - ${message.toString() || origin.toUpperCase()}` : message.toString();
        this.logger.error(
            `${errorLog} ( ${origin} ) # ${message.stack}`,
            { errorOrigin: origin },
            'process',
        );
        if (options.cleanup && !globalsConfig.sensortConfig.failKeepAlive) process.exit();
    }
    private async configLog(type: string) {
        // Função privada para configurar o registro de log de um determinado tipo
        // Recebe o tipo de log como parâmetro
        if (!this.logger[type]) {
            // Verifica se o tipo de log já foi configurado
            this.logger[type] = async (
                message: any,
                optionalParams?: {
                    errorOrigin?: string;
                },
                controller: string = 'app',
                priority: number = 0,
            ) => {
                if (message.replace)
                    message = message.replace(new RegExp(`${process.cwd()}/`, 'g'), '');
                // Sobrescreve a função de console[type] para registrar o log
                const log = `[${new Date().toISOString()}] (${controller.toLowerCase()}) PRIOR: ${priority.toString()} - ${message}`
                console.log(log);
                if (globalsConfig.sensortConfig.logsPath) {
                    const path = `${globalsConfig.sensortConfig.logsPath}${type}.${parseDate('Y_m_d')}.log`
                    if(!existsSync(path)) writeFileSync(path, `${log}\r\n`, {encoding: 'utf-8'})
                    else appendFileSync(path, `${log}\r\n`)
                }
                // Cria uma nova instância do modelo de Logs e salva o log no banco de dados
            };
            console[type] = this.logger[type];
        }
    }
}
