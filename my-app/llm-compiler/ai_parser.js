export async function promptGemini(prmpt) {
    const response = await fetch('/api/ai', {
        method: "POST",
        body: JSON.stringify({prompt: prmpt})
    });

    const data = await response.json(); 
    return data.result;
}


function promptGroq(prompt) {

}


// would be client side here
async function constructCodeToGraphPrompt (dirHandle) {
    // concatenate all files
    let codePartOfPrompt = "";
    const files = await walkDir(dirHandle);

    for (const file of files) {
        codePartOfPrompt += file["filePath"]
        codePartOfPrompt += file["codeContent"];
        codePartOfPrompt += "\n";
    } 

    const res = await fetch('/api/ai?type=code_to_graph');
    const data = await res.json();
    let full_prompt = data.result;
    full_prompt += codePartOfPrompt;
    return full_prompt;
}

function getNodes(jsonString) {
    // remove gemini artifacts
    jsonString = jsonString.replace(/```json/g, '');
    jsonString = jsonString.replace(/```/g, '');

    const nodes = JSON.parse(jsonString)["nodes"];
    return nodes;
}


async function walkDir(dir){
    // convert to file system api
    const filesArray = [];

    async function processDirectory(currentHandle, currentPath='') {
        for await (const [name, handle] of currentHandle.entries()) {
            const filePath = `${currentPath}/${name}`;

            if (handle.kind == "file") {
                const file = await handle.getFile();
                const fileContent = await file.text();
                filesArray.push({filePath, codeContent: fileContent});
            } else if (handle.kind == "directory") {
                await processDirectory(handle, filePath);
            }
        }
    }

    await processDirectory(dir);
    return filesArray;
}

function constructGraphToCodePrompt(nodes) { 
    
}

function fillEmptyNodeFields(nodes) {
    for (const node of nodes) {
        node.x = 0;
        node.y = 0;
        node.width = 250;
        node.height = 0;

        let dict_style = [];
        for (const input of node.inputs) {
            dict_style.push({text: input});
        }
        node.inputs = dict_style;

        
        let depends = []; 
        for (const depend of node.dependencies) {
            depends.push(nodes[depend]);
        }
        node.dependencies = depends;
        
        node.nodeType = {text: node.nodeType};
        node.nodeName = {text: node.nodeName};
        node.naturalLanguageDescription = {text: node.naturalLanguageDescription};
        node.nodeNamespace = {text: node.nodeNamespace};

        node.typeWidth = 0;
        node.nameWidth = 0;
        node.namespaceWidth = 0;
    }
}

export async function codeToNodes() {
    const dirHandle = await window.showDirectoryPicker();

    const prompt = await constructCodeToGraphPrompt(dirHandle);
    const jsonString = await promptGemini(prompt);

    const nodes = getNodes(jsonString);
    fillEmptyNodeFields(nodes);
    return nodes;
}

export async function addNodes(nodes_array, dirHandle) {
    // console.log("Add Nodes Called!");
    // const dirHandle = await window.showDirectoryPicker();

    const prompt = await constructCodeToGraphPrompt(dirHandle);
    console.log(prompt);
    const jsonString = await promptGemini(prompt);
    console.log("\n\n\n");
    console.log(jsonString);

    const nodes = getNodes(jsonString);
    console.log(nodes);
    fillEmptyNodeFields(nodes);
    console.log("\n\n\n");
    console.log(nodes);

    for (const node of nodes) {
        node.x = Math.random() * 2 - 1 - node.dependencies.length;
        node.y = Math.random() * 2 - 1;
        nodes_array.push(node);
    }

    console.log("\n\n\n");
    console.log(nodes_array);
}


// let nodes = await codeToNodes();
// console.log(nodes);


