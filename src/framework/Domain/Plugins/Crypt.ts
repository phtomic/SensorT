import { Md5 } from "ts-md5";
import { createHash, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { UUIDGenerator } from "./UUIDGenerator";
import { UUIDBitSize, UUIDEncoding } from "../interfaces/UUIDGeneratorInterface";
import { env } from "../App/Globals";
import { isEmpty } from "lodash";
//Checking the crypto module
//Using AES encryption
const KEY_ENCODING = 'base64'
export default class Crypt {

    //Encrypting text
    public static encrypt(txt: string) {
        const [key, iv, algorithm] = this.getAppKey();;
        const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
        return Buffer.concat([cipher.update(txt), cipher.final()]).toString('hex');

    }

    public static generateKey(save_env = false) {
        const key = [
            KEY_ENCODING,
            Buffer.from(JSON.stringify([randomBytes(32), randomBytes(16), 'aes-256-cbc'])).toString(KEY_ENCODING)
        ].join(':')
        if (save_env) {
            console.debug(process.cwd())
        }
        return key;
    }

    public static oneWayEncrypt(txt: string) {
        const buffered = createHash('sha256').update(btoa(txt)).digest()
        return createHash('sha512').update(buffered).digest().toString("base64url").toString()
    }

    public static generateToken() {
        return btoa(this.oneWayEncrypt(new UUIDGenerator(UUIDEncoding.BASE62, UUIDBitSize.B512).generate()))
    }
    private static getAppKey() {
        const APP_KEY: any = env('APP_KEY')
        if (isEmpty(APP_KEY))
            throw new Error("APP_KEY ENV not set")
        const [ENCODING, APP_KEY_JSON] = APP_KEY.split(':')

        return JSON.parse(atob(
            decodeURI(Buffer.from(APP_KEY_JSON, ENCODING).toString())
        ))
    }
    // Decrypting text
    public static decrypt(txt: string) {
        const [key, iv, algorithm] = this.getAppKey();
        const decipher = createDecipheriv(
            algorithm,
            Buffer.from(key),
            Buffer.from(iv, 'hex')
        );
        return Buffer.concat([
            decipher.update(Buffer.from(txt, 'hex')),
            decipher.final()
        ]).toString();
    }
    public static md5(txt: string) {
        return Md5.hashStr(txt);
    }
}