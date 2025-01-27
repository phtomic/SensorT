export class QrCodeController {
  public endpoint: string;
  private opts: any = {
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000',
      light: '#FFFF',
    },
    encrypt: false,
    quality: 1,
    margin: 0,
    scale: 6,
  };
  private QrCodeService: any;

  constructor() {
    // Construtor da classe QrCodeController
    // Inicializa o serviço de geração de QR Code e define o endpoint como uma string vazia
    this.QrCodeService = require('qrcode');
    this.endpoint = '';
  }

  public async generate(data: any, opts?: any) {
    // Função pública para gerar um QR Code
    // Recebe os dados para geração do QR Code e as opções (opcional)

    opts = Object.assign(this.opts, opts || {}); // Mescla as opções padrão com as opções fornecidas

    if (opts.encrypt) {
      // Se a opção de criptografia estiver ativada, realiza a criptografia dos dados
      data = btoa('crypt§' + data);
    }

    // Gera o QR Code com base nos dados e opções fornecidas
    return await this.QrCodeService.toDataURL(this.endpoint + data, opts);
  }

  public read(data: string) {
    // Função pública para ler um QR Code
    // Recebe os dados do QR Code

    let decrypt: any = atob(data); // Decodifica os dados

    decrypt = decrypt.split('§');

    if (Array.isArray(decrypt)) {
      if (decrypt[0] == 'crypt') {
        decrypt.shift();
        return decrypt; // Retorna os dados descriptografados
      } else {
        return data; // Retorna os dados sem alterações
      }
    } else {
      return data; // Retorna os dados sem alterações
    }
  }
}
