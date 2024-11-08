import { config } from "dotenv";
export const env = (field: string, def?: any) => config().parsed?.[field] || null || def;
export enum TokenTypes {
    SPA = "spa",
    BEARER = "bearer",
    TEMP = "temp",
}

export async function mapAsync<T>(array: Array<T>, callback: (data: T, index: number) => Promise<any>) {
    let index: number = 0
    while (index < array.length) {
        let dados = await callback(array[index], index)
        array[index] = dados
        index++;
    }
    return array
}
export class Globals {
    constructor() {}
}