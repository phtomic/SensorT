import { Kernel } from './Kernel';
import { concat } from 'lodash';
export class LogsController {
  private logger: any;
  private ignoredErrors = ['EPIPE', 'ERR_IPC_CHANNEL_CLOSED'];
  private lastErrorLog = {
    timeout: Date.now(),
    error: '',
  };
  constructor() {
    // Construtor da classe LogsController
    // Recebe uma instância de Models para acesso aos modelos de banco de dados
    this.logger = {};
    this.configLog('debug');
    this.configLog('info');
    this.configLog('error');
      process
        .on('exit', (err) => this.exitHandler(err, { cleanup: true }, 'exit'))
        .on('SIGINT', (err) => this.exitHandler(err, {}, 'SIGINT'))
        .on('SIGUSR1', (err) => this.exitHandler(err, {}, 'SIGUSR1'))
        .on('SIGUSR2', (err) => this.exitHandler(err, {}, 'SIGUSR2'))
        .on('uncaughtException', (err) =>
          this.exitHandler(err, {}, 'uncaughtException'),
        );
  }
  private exitHandler(message: any, options: any, origin: string) {
    if (
      this.ignoredErrors
        .map((error) => message.toString().includes(error))
        .includes(true)
    )
      return true;
    let errorLog = '';
    if (options.cleanup) {
      errorLog = 'Desligamento do sistema - '.concat(message.toString());
    } else {
      errorLog = message.toString();
    }
    errorLog = errorLog.concat(' (', origin, ')');
    if (
      this.lastErrorLog.error !== errorLog ||
      this.lastErrorLog.timeout < Date.now() + 100
    ) {
      this.lastErrorLog = {
        timeout: Date.now() + 2000,
        error: errorLog,
      };
      this.logger['info'](
        `${errorLog} # ${message.stack}`,
        { errorOrigin: origin },
        'process',
      );
    }
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
        if (
          optionalParams?.errorOrigin &&
          optionalParams?.errorOrigin !== 'uncaughtException'
        )
          process.exit();
        // Sobrescreve a função de console[type] para registrar o log
        console.log(
          concat(
            '[',
            controller.toUpperCase(),
            ']',
            ' PRIOR: ',
            priority.toString(),
            ' - ',
            message,
          ).join(''),
        );
        // Cria uma nova instância do modelo de Logs e salva o log no banco de dados
      };
      console[type] = this.logger[type];
    }
  }
}
