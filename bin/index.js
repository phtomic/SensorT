#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const module_path = path.join(__dirname, '..')
fs.readdirSync(module_path).filter(item => !['.git','bin','test'].includes(item)).forEach(fl=>{
    const pth = path.join(process.cwd(), fl)
    if(!fs.existsSync(pth)) fs.cpSync(path.join(module_path, fl), pth, {recursive: true})
    if(fl == 'src') fs.cpSync(path.join(module_path, fl, 'framework'), path.join(pth, 'framework'), {recursive: true})
})