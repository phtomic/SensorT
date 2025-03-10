import { CreateCommand } from "@sensort/core";

CreateCommand('test', async (...args) => console.info(args.join(' - ')))