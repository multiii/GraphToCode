import { useEffect, useRef } from 'react';

export const nodes = [];

export default function Editor() {
    const canvasRef = useRef(null);

    useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const View = {
        x: 0,
        y: 0,
        scale: 1,
        activeNode: null,
        activeNodeFeature: null,
        activeFeatureTextPosition: 0
    }
    
    function clamp(x, a, b){
        if(x < a) return a;
        if(x > b) return b;
        return x;
    }
    
    const RenderProperties = {
        colors: {
            primary: "#FFFFFF",
            secondary: "#DDF3EE",
            secondary2: "#2DAC8F"
        }
    }
    
    function setupCanvasTest(){
        let w = Math.round(window.innerWidth * window.devicePixelRatio);
        let h = Math.round(window.innerHeight * window.devicePixelRatio);   
        canvas.width = w;
        canvas.height = h;
    }
    
    function renderGrid(level){
        let dist = 60+level*60;
        let thickness = 1;
        let size = 6;
    
        let x_max = Math.ceil(canvas.width/dist);
        let y_max = Math.ceil(canvas.height/dist);
    
        ctx.fillStyle = "#CCC";
        for(let x = 0; x < x_max; x++){
            for(let y = 0; y < y_max; y++){
                ctx.fillRect(x*dist-size, y*dist-thickness, size*2, 1);
                ctx.fillRect(x*dist-thickness, y*dist-size, 1, size*2);
            }
        }
    }
    
    function getNodeLeftConnectionPoint(node){
        return {x: node.x-1, y: node.y + 15, radius: 8};
    }
    
    function getNodeRightConnectionPoint(node){
        return {x: node.x+node.width, y: node.y + 15, radius: 8};
    }
    
    function renderNode(node){
    
        renderConnections(node);
    
        let computedHeight = 90 + (node.inputs.length+1)*29 + 40;
        
        ctx.strokeStyle = "black"; RenderProperties.colors.secondary2;
        ctx.lineWidth = 1;
    
        if(node == View.activeNode){
            ctx.shadowColor = RenderProperties.colors.secondary2;
            ctx.shadowBlur = 10;
        }
    
        ctx.fillStyle = "#B9B9B9";
        ctx.fillRect(node.x, node.y, node.width, Math.max(node.height, computedHeight));
        ctx.strokeRect(node.x, node.y, node.width, Math.max(node.height, computedHeight));
        
        ctx.shadowBlur = 0;
        ctx.shadowColor = "";
    
        let type = node.nodeType;
        let namespace = node.nodeNamespace;
        let symbol = node.nodeName;
    
        let textSize = 25;
    
        ctx.font = "20px lexend";
    
        let typeWidth = ctx.measureText(type).width+6+10;
        let namespaceWidth = ctx.measureText(namespace).width+6*ctx.measureText(namespace).width;
        let symbolWidth = ctx.measureText(symbol).width+6;
        let totalWidth = typeWidth + namespaceWidth + symbolWidth;
    
        ctx.fillStyle = RenderProperties.colors.secondary2;
    
        
    
        ctx.fillRect(node.x, node.y, typeWidth, textSize + 6);
        ctx.strokeRect(node.x, node.y, typeWidth, textSize + 6);
    
        ctx.beginPath();
        ctx.arc(node.x-1, node.y+15, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
    
        ctx.fillStyle = RenderProperties.colors.primary;
    
     
        ctx.fillRect(node.x+typeWidth, node.y, namespaceWidth, textSize+6);
        ctx.strokeRect(node.x+typeWidth, node.y, namespaceWidth, textSize+6);
        ctx.fillRect(node.x+typeWidth+namespaceWidth, node.y, node.width-typeWidth-namespaceWidth, textSize+6);
        ctx.strokeRect(node.x+typeWidth+namespaceWidth, node.y, node.width-typeWidth-namespaceWidth, textSize+6);
    
        ctx.beginPath();
        ctx.arc(node.x+node.width, node.y+15, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
    
        ctx.fillStyle = "white";
        ctx.fillText(type, node.x+3+7, node.y+textSize);
        ctx.fillStyle = "black";
        ctx.fillText(namespace, node.x+typeWidth+3, node.y+textSize);
        ctx.fillText(symbol, node.x+typeWidth+namespaceWidth+3, node.y+textSize);
    
        let inputText = "INPUTS";
        ctx.font = "15px lexend";
        ctx.fillText(inputText, node.x+4, node.y+2*textSize);
    
        let inputTop = 2*textSize+8 + 10;
    
        ctx.font = "18px lexend";
        for(let i = 0; i < node.inputs.length+1; i++){
            ctx.strokeStyle = "black";
            
            let editOn = (i < node.inputs.length && View.activeNodeFeature == node.inputs[i]);
    
            if(editOn){
                ctx.strokeStyle = "blue"; 
            }
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.roundRect(node.x+4, node.y+inputTop-10, node.width-8, 25, 5);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "black";
    
            if(editOn && Math.sin(Date.now()/200) > 0){
                ctx.fillStyle = "black";  
                ctx.fillRect(node.x + 8 + ctx.measureText(node.inputs[i].text.substring(0, View.activeFeatureTextPosition)).width,
                 node.y+inputTop-5, 2, 18);
            }
            
            if(i == node.inputs.length){
                ctx.fillStyle = "gray";
                ctx.fillText("Add input...", node.x+8, node.y+inputTop+10);
            } else {
                ctx.fillText(node.inputs[i].text, node.x+8, node.y+inputTop+10);
            }
            inputTop += 29;
        }
        
        ctx.strokeStyle = "black";
        ctx.font = "15px lexend";
        ctx.fillStyle = "black";
        ctx.fillText("DESCRIPTION", node.x+4, node.y+inputTop+5);
        inputTop += 20;
    
        let descriptionHeight = 40;
    
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.roundRect(node.x+4, node.y+inputTop-10, node.width-8, descriptionHeight, 5);
        ctx.fill();
        ctx.stroke();
    
        ctx.fillStyle = "black";
        ctx.font = "18px lexend";
        ctx.fillText(node.naturalLanguageDescription, node.x+8, node.y+inputTop+10);
    
        
        inputTop += 29;
        
        node.height = computedHeight;
    }
    
    function renderConnections(node){
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        for (let i in node.dependencies) { 
            let dep = node.dependencies[i];
            let p1 = getNodeRightConnectionPoint(node);
            let p2 = getNodeLeftConnectionPoint(dep);
            let dx = Math.abs(p2.x - p1.x) * 0.5; 
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.bezierCurveTo(p1.x + dx, p1.y,  p2.x - dx, p2.y,p2.x, p2.y);
            ctx.stroke();
        }
        ctx.strokeStyle = RenderProperties.colors.secondary2;
        ctx.lineWidth = 3;
        for (let i in node.dependencies) { 
            let dep = node.dependencies[i];
            let p1 = getNodeRightConnectionPoint(node);
            let p2 = getNodeLeftConnectionPoint(dep);
            let dx = Math.abs(p2.x - p1.x) * 0.5; 
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.bezierCurveTo(p1.x + dx, p1.y,  p2.x - dx, p2.y,p2.x, p2.y);
            ctx.stroke();
        }
    }
    
    setupCanvasTest();
    
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        resolveClick(e);
    });
    document.addEventListener("mouseup", (e) => {
        isDragging = false;
    });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
    
        let dx = e.clientX - lastX;
        let dy = e.clientY - lastY;
        dx *= 1.5;
        dy *= 1.5;
    
        if(View.activeNode == null){
            View.x += dx;
            View.y += dy;
        } else {
            View.activeNode.x += dx;
            View.activeNode.y += dy;
        }
        lastX = e.clientX;
        lastY = e.clientY;
    });
    
    
    document.addEventListener("keydown", (e) => {
        if(e.key == "Backspace"){
            if(View.activeNodeFeature != null){
    
                View.activeNodeFeature.text = View.activeNodeFeature.text.substring(0, View.activeFeatureTextPosition-1) + View.activeNodeFeature.text.substring(View.activeFeatureTextPosition);
                View.activeFeatureTextPosition--;
    
                if(View.activeNodeFeature.text == ""){
                    //stupid logic 
                    for(let i = 0; i < View.activeNode.inputs.length; i++){
                        if(View.activeNodeFeature == View.activeNode.inputs[i]){
                            View.activeNode.inputs.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        if(e.key == "ArrowRight"){
            if(View.activeNodeFeature != null){
                View.activeFeatureTextPosition = clamp(View.activeFeatureTextPosition+1, 0, View.activeNodeFeature.text.length);
            }
        }
        if(e.key == "ArrowLeft"){
            View.activeFeatureTextPosition = clamp(View.activeFeatureTextPosition-1, 0, 100000000000);
        }
        if(e.key.length == 1){
            if(View.activeNodeFeature != null){
                View.activeNodeFeature.text = View.activeNodeFeature.text.substring(0, View.activeFeatureTextPosition) + e.key + View.activeNodeFeature.text.substring(View.activeFeatureTextPosition);
                View.activeFeatureTextPosition++;
            }
        }
    });
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        let zoomSpeed = 0.001; 
        View.scale -= e.deltaY * zoomSpeed;
        View.scale = Math.min(Math.max(View.scale, 0.1), 5); 
    });
        
    function createNode(){
        let node = {
            nodeType: "void",
            nodeNamespace: "",
            nodeName: "test",
            inputs: [],
            naturalLanguageDescription: "",
            dependencies: [],
            parentFile: ".hpp",
            code: "",
            x: 0,
            y: 0,
            width: 250,
            height: 0
        }
        return node;
    }
    
    function isPointInNode(x, y, node) {
        return (x >= node.x &&
            y >= node.y &&
            x <= node.x + node.width &&
            y <= node.y + node.height);
    }
    
    function resolveClick(e){
        let x = (e.clientX-canvas.offsetLeft)/canvas.offsetWidth * canvas.width;
        let y = (e.clientY-canvas.offsetTop)/canvas.offsetHeight * canvas.height;
        x = (x - View.x)/View.scale;
        y = (y - View.y)/View.scale;
    
        View.activeNode = null;
        View.activeNodeFeature = null;
        for(let i in nodes){
            if(isPointInNode(x, y, nodes[i])){
                View.activeNode = nodes[i];
    
                let node = nodes[i];
                //68 = top of inputs
                for(let j = 0; j < nodes[i].inputs.length+1; j++){
                    if(isPointInNode(x, y, {x: node.x, y: node.y+60+29*j, width: node.width, height: 29})){
                        if(j == node.inputs.length){
                            node.inputs.push({text: ""});
                            
                        }
                        View.activeFeatureTextPosition = node.inputs[j].text.length;
                        View.activeNodeFeature = node.inputs[j];
                        //alert("a");
                    }
                }
    
                if(isPointInNode(x, y, getNodeLeftConnectionPoint(node))){
                    //activeNodeFeature = k
                }
            }
        }
    }
    
    nodes.push(createNode());
    nodes.push(createNode());
    nodes.push(createNode());
    console.log(473643889489348934893489348934);
    nodes[0].nodeType = "int"; nodes[0].nodeName = "main"; 
    nodes[0].dependencies.push(nodes[1]); nodes[0].dependencies.push(nodes[2]);
    nodes[0].inputs = [{text: "int argc"}, {text: "const char* argv[]"}];
    nodes[0].naturalLanguageDescription = "main function that calls some functions";
    
    function render(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        renderGrid(Math.round(View.scale/2));
    
        ctx.translate(View.x, View.y);
        ctx.scale(View.scale, View.scale);
    
        for(let i in nodes)
            renderNode(nodes[i]);
    
        ctx.resetTransform();
        requestAnimationFrame(render);
    }
    
    render();

}, []);

    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%'}}></canvas>
    );
}