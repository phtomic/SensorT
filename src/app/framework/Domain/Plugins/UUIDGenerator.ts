import { TokenGenerator, UUIDBitSize, UUIDEncoding } from "../interfaces/UUIDGeneratorInterface";

export class UUIDGenerator {
   private uuidToken: any;
   public readonly base: number;
   public readonly baseEncoding: any;
   public readonly bitSize: number;
   public readonly length: number;

   constructor(encoding: UUIDEncoding = UUIDEncoding.BASE16, bitSize: UUIDBitSize = UUIDBitSize.B128) {
      // Cria uma instância do TokenGenerator com o tamanho e a codificação especificados
      this.uuidToken = new TokenGenerator(bitSize, encoding);

      // Armazena informações sobre a base, codificação, tamanho e comprimento do token gerado
      this.base = this.uuidToken.base;
      this.baseEncoding = this.uuidToken.baseEncoding;
      this.bitSize = this.uuidToken.bitSize;
      this.length = this.uuidToken.tokenLength;
   }

   generate(): string {
      // Gera um novo token UUID usando o TokenGenerator
      return this.uuidToken.generate();
   }
}

export function uuid(encoding: UUIDEncoding = UUIDEncoding.BASE16, bitSize: UUIDBitSize = UUIDBitSize.B128) {
    return (new UUIDGenerator(encoding, bitSize)).generate()
}