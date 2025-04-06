//BFS


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

    console.log(processPriority);
    for(let i = processPriority.length-1; i >= 0; i--){
        //
        console.log(processPriority[i].nodeName.text);
    }
}