
import inquirer from "inquirer";
import SimpleGit from "simple-git";
import path from "path";
import fs from "fs";


export function create(location = process.cwd()) {
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
    ]).then(async (answer) => {
        await SimpleGit().clone(`https://github.com/oyajiDev/lego-template-${answer.templateVersion}`, location);

        // replace package.json
        const packageInfo = JSON.parse(fs.readFileSync(path.join(location, "package.json"), { encoding: "utf-8" }));
        
        packageInfo.name = path.basename(location);
        packageInfo.version = answer.version;
        packageInfo.description = answer.description;
        packageInfo.author = answer.author;
        packageInfo.license = answer.license;

        fs.writeFileSync(path.join(location, "package.json"), JSON.stringify(packageInfo), { encoding: "utf-8" });

        // remove git files
        fs.rmSync(path.join(location, ".git"), { recursive: true });
        fs.unlinkSync(path.join(location, ".gitignore"));

        console.log("========= Finished ========");
        console.log(`= run "cd ${packageInfo.name} && npm install"`);
        console.log("= run \"npm run serve\" for preview!");

    }).catch(err => {
        console.log(err);
    });
}
