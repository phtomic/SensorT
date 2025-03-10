#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const env = require('dotenv').config().parsed?.SENSORT_COMMANDS
const nodeArgs = new Set(process.execArgv);
const args = process.argv.slice(2).filter(arg => !nodeArgs.has(arg)).join(' ')
if(!env) console.error("Env SENSORT_COMMANDS is not defined in .env file")
else exec(`${env} ${args}`, (err, stdout, stderr)=>{
    if(err) console.error(err)
    if(stdout) process.stdout.write(stdout)
    if(stderr) process.stderr.write(stderr)
})