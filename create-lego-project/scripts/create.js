
import inquirer from "inquirer";
import wget from "node-wget";
import decompress from "decompress";
import path from "path";
import fs from "fs";


export function create(location) {
    console.log("========= Lego-Kit ========");

    inquirer.prompt([
        {
            type: "list", name: "templateVersion", default: "v2",
            message: "Version of Lego.js: ", choices: [ "v1", "v2" ]
        },
        {
            type: "input", name: "version", default: "1.0.0",
            message: "Version of Project: "
        },
        {
            type: "input", name: "description", default: "",
            message: "Description of Project: "
        },
        {
            type: "input", name: "author",
            message: "Authr: "
        },
        {
            type: "input", name: "license", default: "MIT",
            message: "License: "
        }
    ]).then((answer) => {
        const rootDir = path.dirname(location);
        const templateZipFile = path.join(rootDir, "template.zip");
        wget({ url: `https://github.com/somehitDev/lego-template-${answer.templateVersion}/archive/refs/heads/master.zip`, dest: templateZipFile }, async ( err, resp, body ) => {
            // unzip and remove
            await decompress(templateZipFile, rootDir);
            fs.rmSync(templateZipFile);

            // rename
            fs.renameSync(path.join(rootDir, `lego-template-${answer.templateVersion}-master`), location);

            // replace package.json
            const packageInfo = JSON.parse(fs.readFileSync(path.join(location, "package.json"), { encoding: "utf-8" }));
            
            packageInfo.name = path.basename(location);
            packageInfo.version = answer.version;
            packageInfo.description = answer.description;
            packageInfo.author = answer.author;
            packageInfo.license = answer.license;

            fs.writeFileSync(path.join(location, "package.json"), JSON.stringify(packageInfo, null, 4), { encoding: "utf-8" });

            // remove git files
            fs.unlinkSync(path.join(location, ".gitignore"));

            console.log("========= Finished ========\n");
            console.log(`= run "cd ${packageInfo.name} && npm install"`);
            console.log("= run \"npm run serve\" for preview!");
        });
    }).catch(err => {
        if (fs.existsSync(templateZipFile)) {
            fs.rmSync(templateZipFile);
        }

        console.log(err);
    });
}
