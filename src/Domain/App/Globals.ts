import { config } from 'dotenv';
import { globalsConfig, SensortConfig } from './Exports';
export const env = (...args: Array<string | any>) => {
  const cfg = config().parsed;
  const def = args.length > 1 ? args.pop() : null;
  return (
    args.map((key) => cfg?.[key]).find((v) => v !== undefined) || null || def
  );
};

export async function mapAsync<T>(
  array: Array<T>,
  callback: (data: T, index: number) => Promise<any>,
) {
  let index: number = 0;
  while (index < array.length) {
    let dados = await callback(array[index], index);
    array[index] = dados;
    index++;
  }
  return array;
}

export class Globals {
  constructor() {}
}

export const sleep_async = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export type AppConfigTypes = keyof SensortConfig
export function UseConfig(config: AppConfigTypes, value: any){
    globalsConfig.sensortConfig = {} as any
    globalsConfig.sensortConfig[config as string] = value
}
