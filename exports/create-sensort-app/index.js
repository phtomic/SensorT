#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const module_path = path.join(__dirname, 'base');
const destination = (process.argv[2] || '').trim()
if (destination !== '' && typeof destination == 'string') {
    const destination_path = path.join(__dirname, destination)
    if (fs.existsSync(destination_path)) {
        console.error("Directory is not empty")
    } else {
        fs.cpSync(module_path, destination_path, { recursive: true })
        const package_json = path.join(destination_path, 'package.json')
        fs.writeFileSync(package_json,fs.readFileSync(package_json,'utf-8').replace('sensort_app_name', destination))
        console.log("Instaling packages...")
        exec("npm install", { cwd: destination_path }, (err) => { if (err) console.error(err) })
            .on("exit", (code) => { console.log("Done!") })
    }
} else {
    console.error("Project name required")
}