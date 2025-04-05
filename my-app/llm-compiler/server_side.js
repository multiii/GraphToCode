import { GoogleGenAI } from "@google/genai";
import { readdirSync, readFile, readFileSync, statSync} from "fs";
import path from "path";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_KEY});

export async function promptGemini(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    console.log(response.text);
}

function promptGroq(prompt) {

}


// would be client side here
function constructCodeToGraphPrompt (dir) {
    // concatenate all files
    let codePartOfPrompt = "";
    const files = walkDir(dir);
    // console.log(files);

    for (const file of files) {
        codePartOfPrompt += file["filePath"]
        codePartOfPrompt += file["codeContent"];
        codePartOfPrompt += "\n";
    } 

    let full_prompt = readFileSync("./system_prompts/code_to_graph.txt", 'utf-8');
    full_prompt += codePartOfPrompt;

    return full_prompt;
}

function walkDir(dir){
    const filesArray = [];

    function processDirectory(currentPath) {
        const files = readdirSync(currentPath);

        for (const file of files) {
            const filePath = path.join(currentPath, file);
            const stats = statSync(filePath);

            if (stats.isFile()) {
                const fileContent = readFileSync(filePath, 'utf-8');
                filesArray.push({"filePath": filePath, "codeContent": fileContent});
            } else if (stats.isDirectory()) {
                processDirectory(filePath);
            }
        }
    }

    processDirectory(dir);
    return filesArray;
}

function constructGraphToCodePrompt(nodes) { 

}

function main() {
    const prompt = constructCodeToGraphPrompt("./testing_code");
    promptGemini(prompt);
}

main();



