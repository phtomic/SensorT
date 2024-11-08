import { readFileSync, writeFileSync } from "fs";

export class PackagesBuilder {
    public prepare() {
        const package_json = JSON.parse(readFileSync(`${process.cwd()}/package.json`,'utf-8'))
        const new_package_json_file = {
            dependencies: package_json.dependencies,
            command: "ts-node-dev src/index.ts",
            configure: "npm install -y",
            fix_max_watchers: "echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p"
        }
        writeFileSync(`${process.cwd()}/dist/package.json`,JSON.stringify(new_package_json_file))
    }
}