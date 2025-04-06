import { GoogleGenAI } from "@google/genai";
import { readdirSync, readFile, readFileSync, statSync} from "fs";
import path from "path";
import { json } from "stream/consumers";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_KEY});

export async function promptGemini(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    // console.log(response.text.toString());
    return response.text.toString();
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

function getNodes(jsonString) {
    console.log(typeof(jsonString));
    // remove gemini artifacts
    jsonString = jsonString.replace(/```json/g, '');
    jsonString = jsonString.replace(/```/g, '');

    const nodes = JSON.parse(jsonString)["nodes"];
    return nodes;
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

export async function codeToNodes(dir) {
    const prompt = constructCodeToGraphPrompt(dir);
    const jsonString = await promptGemini(prompt);

    const nodes = getNodes(jsonString);
    return nodes;
}




