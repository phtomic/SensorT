export const TokenGenerator = require('uuid-token-generator');
export enum UUIDEncoding {
   BASE16 = TokenGenerator.BASE16,
   BASE36 = TokenGenerator.BASE36,
   BASE58 = TokenGenerator.BASE58,
   BASE62 = TokenGenerator.BASE62,
   BASE66 = TokenGenerator.BASE66,
   BASE71 = TokenGenerator.BASE71
}
export enum UUIDBitSize {
   B128 = 128,
   B256 = 256,
   B512 = 512
}
