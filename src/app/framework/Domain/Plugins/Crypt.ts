import { Md5 } from "ts-md5";
import { createHash, createCipheriv,createDecipheriv, randomBytes } from "crypto";
import { UUIDGenerator } from "./UUIDGenerator";
import { UUIDBitSize, UUIDEncoding } from "../interfaces/UUIDGeneratorInterface";
//Checking the crypto module
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = randomBytes(32);
const iv = randomBytes(16);

//Encrypting text
function encrypt(txt) {
    let cipher =  createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(txt);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return btoa(JSON.stringify([key,{ iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }]));
}


function oneWayEncrypt(txt){
    let text=btoa(txt)
    const buffered = createHash('sha256').update(text).digest()
    const result = createHash('sha512').update(buffered).digest().toString("base64url").toString()
    return result
}

function generateToken(){
    return btoa(oneWayEncrypt(new UUIDGenerator(UUIDEncoding.BASE62, UUIDBitSize.B512).generate()))
}
// Decrypting text
function decrypt(txt) {
    let text = JSON.parse(atob(txt))[1]
    let key = JSON.parse(atob(txt))[0]
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
function md5(txt){
    return Md5.hashStr(txt);
}
const Crypt = {
    encrypt,
    decrypt,
    oneWayEncrypt,
    generateToken,
    md5
}
export default Crypt