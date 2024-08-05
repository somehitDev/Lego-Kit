
import fs from "fs";
import inquirer from "inquirer";
import path from "path";


export async function prepare() {
    const projectName = process.argv[2] || ".";
    const location = path.join(process.cwd(), ...projectName.split("/"));

    if (fs.existsSync(location)) {
        const answer = await inquirer.prompt([
            { type: "confirm", name: "force", message: "Force proceed: ", default: true }
        ]);
        if (answer.force) {
            fs.rmSync(location, { recursive: true });
        }
        else {
            throw Error("location already exists!");
        }
    }

    return location;
}
