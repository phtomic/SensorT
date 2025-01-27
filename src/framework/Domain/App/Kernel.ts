import { Builder } from '../Database/Domain/Builder';
export type RegexMatchedString<Pattern extends RegExp> = string & {
  __pattern: Pattern;
};
export type CommandList = {
  [x: string]: () => Promise<any>;
};
export class Kernel {
  public canServe = true;
  public canMigrate = false;
  public canSeed = false;
  public canTask = true;
  public isCommand = false;
  constructor() {
    const command = process.argv.slice(2);
    const builder = new Builder();
    builder.prepareAction(command);
  }
}

export class AppError extends Error {
  code: string;
  constructor(message?: string, code?: string, name?: string) {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = name || 'AppError';
    this.code = code || '0x0';
  }
}
