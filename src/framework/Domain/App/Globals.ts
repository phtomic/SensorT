import { config } from 'dotenv';
import { SetMigrationsPath } from '../Database/Domain/MigrationsController';
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

export type AppConfigTypes = "MIGRATIONS_PATH"
export function UseConfig(config: AppConfigTypes, value: any){
    switch(config){
        case "MIGRATIONS_PATH":
            SetMigrationsPath(value); break;
    }
}
