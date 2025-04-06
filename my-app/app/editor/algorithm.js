//BFS
import { promptGemini } from "../../llm-compiler/ai_parser.js";


export function BFS(root){
    let visited = new Set();
    let queue = [root];
    let processPriority = [];

    while(queue.length > 0){
        let node = queue.shift();

        if(!visited.has(node)){
            visited.add(node);

            for(let i in node.dependencies){
                if(!visited.has(node.dependencies[i])){
                    queue.push(node.dependencies[i]);
                }
            }

            processPriority.push(node);
        }
    }
    return processPriority;
}

function generateUserDefinedTypePrompt(node){
    let members = ``;
    for(let i = 0; i < node.inputs.length; i++){
        members += `${node.inputs[i].text}`;
        if(i != node.inputs.length-1)
            members += ", ";
    }

    let prompt = `
    create a ${node.nodeType.text} prototype. 
    name: ${node.nodeName.text}
    members of prototype: ${members}
    description:
    ${node.naturalLanguageDescription.text}
    `;
    return prompt;
}
function generateFunctionPrompt(node){

    let parameters = ``;
    for(let i = 0; i < node.inputs.length; i++){
        parameters += `${node.inputs[i].text}`;
        if(i != node.inputs.length-1)
            parameters += ", ";
    }

    let prompt = `
    prototype: 
    ${node.nodeType.text} ${node.nodeNamespace.text}${(node.nodeNamespace.text == "") ? "" : "::" }${node.nodeName.text}(${parameters});
    description:
    ${node.naturalLanguageDescription.text}
    `;
    
    return prompt;
}

function downloadResult(file){
    const blob = new Blob([file], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph-to-code-demo.hpp';
    a.click();
   RL.revokeObjectURL(url);
}

export async function BFScompilation(root){

    let processPriority = BFS(root);

    for(let i = processPriority.length-1; i >= 0; i--){
        //
        console.log(processPriority[i].nodeName.text);

        let node = processPriority[i];

        let nodePrompt = ``;
        if(node.nodeType.text == "struct" || node.nodeType.text == "class"){
            nodePrompt = generateUserDefinedTypePrompt(node);
        } else {
            nodePrompt = generateFunctionPrompt(node);
        }

        let context = ``;
        for(let i in node.dependencies){
            context += `${node.dependencies[i].code}\n\n`;
        }

        const epicPromptString = 
        `
        You must write a piece of code in C++ according to the following information: Do not write any other code than what is asked.
        (C++) USE THESE FUNCTIONS AND CLASS PROTOTYPES AS CONTEXT FOR WRITING THE CODE:
        ${context}
        [end of context]---------
        Use that information to write a single function definition. Do not define anything that was given as context or include it in the response: ONLY WRITE CODE, DO NOT GIVE ANY TEXT, ONLY CODE
        Use the following information for the structure:
        ${nodePrompt}
        `;

        let response = await promptGemini(epicPromptString);
        node.code = response;
    }

    let file = ``;
    //build the file
    for(let i = processPriority.length-1; i >= 0; i--){
        file += processPriority[i].code + "\n\n";
    }
    
    file = file.replace("```cpp", "");
    file = file.replace("```", "");

    downloadResult(file);
}