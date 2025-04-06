import { useEffect, useRef } from 'react';

import {addNodes} from '../../llm-compiler/ai_parser';

// can't be constant because it needs to be able to be cleared
export let nodes = [];
export const View = {
    x: 0,
    y: 0,
    scale: 1,
    activeNode: null,
    activeNodeFeature: null,
    activeFeatureTextPosition: 0,
    activeConnectionHandle: null,
    mouseX: 0,
    mouseY: 0
}

export async function makeFullGraph(dirHandle) {
    nodes = [];
    addNodes(nodes, dirHandle);
}

export default function Editor({ state }) {
    const canvasRef = useRef(null);

    const stateRef = useRef(state)

    useEffect(() => {
    stateRef.current = state
    }, [state])

    let ranEffect = false;
    useEffect(() => {
        console.log("Effect used!")
    if(ranEffect) return;
    ranEffect = true;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const settings = {
        width: canvas.width,
        height: canvas.height,
        iterations: 1000,
        area: canvas.width * canvas.height,
        gravity: 10,
        speed: 1.00,
        margin: 15,
    };

    settings.repulsiveForce = 10;
    
    
    
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
    
    window.resize = () => {
        setupCanvasTest();
    }
    function setupCanvasTest(){
        let w = Math.round(canvas.offsetWidth * window.devicePixelRatio);
        let h = Math.round(canvas.offsetHeight * window.devicePixelRatio);   
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
        // console.log(node);
        renderConnections(node);

        ctx.font = "18px lexend";
        //measure input widths as well to get length
        for(let i = 0; i < node.inputs.length; i++){
            let textWidth = ctx.measureText(node.inputs[i].text).width;
            node.width = Math.max(node.width, textWidth+14);
        }


        //find the height of description
        let pos1 = 0;
        let pos2 = 0;
        let descriptionTop = 0;

        let descriptionText = [];


        for(let i = 0; i <= node.naturalLanguageDescription.text.length; i++){
            if(ctx.measureText(node.naturalLanguageDescription.text.substring(pos1, pos2)).width >= node.width-30 || i == node.naturalLanguageDescription.text.length){
                
                descriptionText.push(node.naturalLanguageDescription.text.substring(pos1, pos2));
                pos1 = pos2;
                descriptionTop += 20;
            }
            pos2++;
        }
    
        descriptionTop += 8;
        node.descriptionHeight = descriptionTop;
        let computedHeight = 90 + (node.inputs.length+1)*29 + descriptionTop;
        
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
    
        let type = node.nodeType.text;
        let namespace = node.nodeNamespace.text;
        let symbol = node.nodeName.text;
    
        let textSize = 25;
    
        ctx.font = "20px lexend";
    
        let typeWidth = ctx.measureText(type).width+6+10;
        let namespaceWidth = ctx.measureText(namespace).width+6;
        let symbolWidth = ctx.measureText(symbol).width+12;
        let totalWidth = typeWidth + namespaceWidth + symbolWidth;
    
        node.width = Math.max(node.width, totalWidth);
        node.width = Math.max(250, node.width);

        ctx.fillStyle = RenderProperties.colors.secondary2;
    
        node.typeWidth = typeWidth;
        node.namespaceWidth = namespaceWidth;
        node.nameWidth =  symbolWidth;
        
    
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
    
        let descriptionHeight = descriptionTop;
    
        if(node.naturalLanguageDescription == View.activeNodeFeature){
            ctx.strokeStyle = "blue"; 
        }
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.roundRect(node.x+4, node.y+inputTop-10, node.width-8, descriptionHeight, 5);
        ctx.fill();
        ctx.stroke();
    
        ctx.fillStyle = "black";
        ctx.font = "18px lexend";
        //ctx.fillText(node.naturalLanguageDescription, node.x+8, node.y+inputTop+10);
        
        for(let i in descriptionText){
            ctx.fillText(descriptionText[i], node.x+8, node.y+inputTop+10+20*i);
        }
        
        inputTop += 29;
        
        node.height = computedHeight;
    }

    function renderConnection(p1, p2){
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        for(let i = 0; i < 2; i++){
            let dx = Math.abs(p2.x - p1.x) * 0.5; 
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.bezierCurveTo(p1.x + dx, p1.y,  p2.x - dx, p2.y, p2.x, p2.y);
            ctx.stroke();

            let derivativeX = 0.75 * (p2.x - p1.x);
            let derivativeY = 1.5  * (p2.y - p1.y);  
            let angle = Math.atan2(derivativeY, derivativeX) + Math.PI/2;

            let s = 15-i;

            ctx.beginPath();
            ctx.moveTo((p1.x+p2.x)/2 + s*Math.cos(angle-Math.PI/4), (p1.y+p2.y)/2 + s*Math.sin(angle-Math.PI/4));
            ctx.lineTo((p1.x+p2.x)/2, (p1.y+p2.y)/2);
            ctx.lineTo((p1.x+p2.x)/2 - s*Math.cos(angle+Math.PI/4), (p1.y+p2.y)/2 - s*Math.sin(angle+Math.PI/4));
            ctx.stroke();
            
            ctx.strokeStyle = RenderProperties.colors.secondary2;
            ctx.lineWidth = 3;
        }

    }
    
    function renderConnections(node){
            for (let i in node.dependencies) { 
                let dep = node.dependencies[i];
                let p1 = getNodeRightConnectionPoint(node);
                let p2 = getNodeLeftConnectionPoint(dep);
                renderConnection(p1, p2);
            }
            
    }
    
    setupCanvasTest();
    
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    function transformCursor(e){
        let x = (e.clientX-canvas.offsetLeft)/canvas.offsetWidth * canvas.width;
        let y = (e.clientY-canvas.offsetTop)/canvas.offsetHeight * canvas.height;
        x = (x - View.x)/View.scale;
        y = (y - View.y)/View.scale;
        return {x, y};
    }

    function addNodeFromClick(e){
        let x = transformCursor(e).x;
        let y = transformCursor(e).y;
        let node = createNode();
        node.x = x;
        node.y = y;
        nodes.push(node);
    }
    
    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;

        if(stateRef.current.mode == "add"){
            addNodeFromClick(e);
            return;
        }

        if(View.activeConnectionHandle){
            let node = findConnectionNode(transformCursor(e).x, transformCursor(e).y, "right");
             
            if(node == null) return;

            node.dependencies.push(View.activeConnectionHandle);
            View.activeConnectionHandle = null;
        }

        resolveClick(e);        
    });
    document.addEventListener("mouseup", (e) => {
        isDragging = false;

        
    });
    document.addEventListener("mousemove", (e) => {
        // console.log(View.x);
        // console.log(View.y);
        View.mouseX = transformCursor(e).x;
        View.mouseY = transformCursor(e).y;

        if (!isDragging) return;
    
        let dx = e.clientX - lastX;
        let dy = e.clientY - lastY;
        dx *= 1.5;
        dy *= 1.5;
    
        if(View.activeNode == null){
            View.x += dx;
            View.y += dy;
        } else {
            View.activeNode.x += dx / View.scale;
            View.activeNode.y += dy / View.scale;
        }
        lastX = e.clientX;
        lastY = e.clientY;

        
    });
    
    
    document.addEventListener("keydown", (e) => {
        
        if(e.key == "Backspace"){
            if(View.activeNodeFeature != null){
    
                View.activeNodeFeature.text = View.activeNodeFeature.text.substring(0, View.activeFeatureTextPosition-1) + View.activeNodeFeature.text.substring(View.activeFeatureTextPosition);
                View.activeFeatureTextPosition--;
                if(View.activeFeatureTextPosition < 0) View.activeFeatureTextPosition = 0;
    
                if(View.activeNodeFeature.text == ""){
                    //stupid logic 
                    for(let i = 0; i < View.activeNode.inputs.length; i++){
                        if(View.activeNodeFeature == View.activeNode.inputs[i]){
                            View.activeNode.inputs.splice(i, 1);
                            break;
                        }
                    }
                }
                return;
            }
            
        }
        //delete node
        if(e.key == "x" && View.activeNode != null && View.activeNodeFeature == null){
            for(let i  = 0; i < nodes.length; i++){
                if(nodes[i] == View.activeNode)
                    return nodes.splice(i, 1);
            }
            return;
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
                let beforeText = View.activeNodeFeature.text.slice(0, View.activeFeatureTextPosition);
                let afterText = View.activeNodeFeature.text.slice(View.activeFeatureTextPosition);
        
                View.activeNodeFeature.text = beforeText + e.key + afterText;
                View.activeFeatureTextPosition++;
            }
        }
    });
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        let zoomSpeed = 0.001; 

        const worldX = (e.clientX - View.x) / View.scale;
        const worldY = (e.clientY - View.y) / View.scale;

        View.scale -= e.deltaY * zoomSpeed;
        View.scale = Math.min(Math.max(View.scale, 0.1), 5); 

        View.x = e.clientX - worldX * View.scale;
        View.y = e.clientY - worldY * View.scale;
    });
        
    function createNode(){
        let node = {
            nodeType: {text: "void"},
            nodeNamespace: {text: ""},
            nodeName: {text: "nodeName"},
            inputs: [],
            naturalLanguageDescription: {text: ""},
            dependencies: [],
            parentFile: ".hpp",
            code: "",
            x: 0,
            y: 0,
            width: 300,
            descriptionHeight: 0,
            height: 0,
            typeWidth: 0,
            namespaceWidth: 0,
            nameWidth: 0
        }
        return node;
    }
    
    function isPointInNode(x, y, node) {
        return (x >= node.x &&
            y >= node.y &&
            x <= node.x + node.width &&
            y <= node.y + node.height);
    }

    function findConnectionNode(x, y, mode){
        //connect nodes things
        for(let i in nodes){
            let left = getNodeLeftConnectionPoint(nodes[i]);
            let right = getNodeRightConnectionPoint(nodes[i]);

            let leftSelected = (Math.hypot(x-left.x, y-left.y) < 10);
            let rightSelected = (Math.hypot(x-right.x, y-right.y) < 20);

            if(mode == "left" && leftSelected) return nodes[i];
            if(mode == "right" && rightSelected) return nodes[i];
        }
        return null;
    }
    
    function resolveClick(e){
        let x = transformCursor(e).x;
        let y = transformCursor(e).y;
    
        View.activeNode = null;
        View.activeNodeFeature = null;
        View.activeConnectionHandle = null;

        View.activeConnectionHandle = findConnectionNode(x, y, "left");


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
                        
                        View.activeNodeFeature = node.inputs[j];
                        //alert("a");
                    }
                }
    
                //decription box
                if(isPointInNode(x, y, {x: node.x, y: node.y+107+29*nodes[i].inputs.length, width: node.width, height: node.descriptionHeight})){
                    View.activeNodeFeature = node.naturalLanguageDescription;
                }

                //stuff ashyfihaussdfghjbhljadflhjksfg
                if(isPointInNode(x, y, {x: node.x, y: node.y, width: node.typeWidth, height: 20}))
                    View.activeNodeFeature = node.nodeType;
                if(isPointInNode(x, y, {x: node.x+node.typeWidth, y: node.y, width: node.namespaceWidth, height: 20}))
                    View.activeNodeFeature = node.nodeNamespace;
                if(isPointInNode(x, y, {x: node.x+node.typeWidth+node.namespaceWidth, y: node.y, width: node.nameWidth, height: 20}))
                    View.activeNodeFeature = node.nodeName;
                

                if(isPointInNode(x, y, getNodeLeftConnectionPoint(node))){
                    //activeNodeFeature = k
                }
                if(View.activeNodeFeature != null)
                    View.activeFeatureTextPosition = View.activeNodeFeature.text.length;
            }
        }
    }

    function collisionDetection() {
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (i === j) return; 
                if (
                    node.x - settings.margin < otherNode.x + otherNode.width + settings.margin &&
                    node.x + node.width + settings.margin > otherNode.x - settings.margin &&
                    node.y - settings.margin < otherNode.y + otherNode.height + settings.margin &&
                    node.y + node.height + settings.margin > otherNode.y - settings.margin
                ) {
                    const overlapX = Math.min(
                        node.x + node.width + settings.margin - (otherNode.x - settings.margin),
                        otherNode.x + otherNode.width + settings.margin - (node.x - settings.margin)
                    );
                    const overlapY = Math.min(
                        node.y + node.height + settings.margin - (otherNode.y - settings.margin),
                        otherNode.y + otherNode.height + settings.margin - (node.y - settings.margin)
                    );

                    if (overlapX < overlapY) {
                        if (node.x < otherNode.x) {
                            node.x -= overlapX / 2;
                            otherNode.x += overlapX / 2;
                        } else {
                            node.x += overlapX / 2;
                            otherNode.x -= overlapX / 2;
                        }
                    } else {
                        if (node.y < otherNode.y) {
                            node.y -= overlapY / 2;
                            otherNode.y += overlapY / 2;
                        } else {
                            node.y += overlapY / 2;
                            otherNode.y -= overlapY / 2;
                        }
                    }
                }
            });
        });
    }


    function resolveLineCollisions() {
        const getCenter = (node) => ({
            x: node.x + node.width / 2,
            y: node.y + node.height / 2,
        });

        function lineIntersectsNode(x1, y1, x2, y2, node) {
            const left = node.x;
            const right = node.x + node.width + settings.margin;
            const top = node.y;
            const bottom = node.y + node.height + settings.margin;

            return (
                lineIntersectsLine(x1, y1, x2, y2, left, top, right, top) || 
                lineIntersectsLine(x1, y1, x2, y2, right, top, right, bottom) || 
                lineIntersectsLine(x1, y1, x2, y2, right, bottom, left, bottom) || 
                lineIntersectsLine(x1, y1, x2, y2, left, bottom, left, top) 
            );
        }

        function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
            const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (den === 0) return false;

            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

            return t >= 0 && t <= 1 && u >= 0 && u <= 1;
        }
        
        nodes.forEach(source => {
            const start = getCenter(source);

            source.dependencies.forEach(target => {
                const end = getCenter(target);

                nodes.forEach(other => {
                    if (other === source || other === target) return;

                    if (lineIntersectsNode(start.x, start.y, end.x, end.y, other)) {
                        const nodeCenter = getCenter(other);
                        const closest = closestPointOnLine(start, end, nodeCenter);

                        let dx = nodeCenter.x - closest.x;
                        let dy = nodeCenter.y - closest.y;
                        let distance = Math.sqrt(dx * dx + dy * dy) + 0.01;

                        let pushStrength = 15; 
                        other.x += (dx / distance) * pushStrength;
                        other.y += (dy / distance) * pushStrength;
                    }
                });
            });
        });

        function closestPointOnLine(a, b, p) {
            const ax = a.x, ay = a.y;
            const bx = b.x, by = b.y;
            const px = p.x, py = p.y;

            const abx = bx - ax;
            const aby = by - ay;
            const abLengthSquared = abx * abx + aby * aby;

            let t = ((px - ax) * abx + (py - ay) * aby) / abLengthSquared;
            t = Math.max(0, Math.min(1, t));

            return {
                x: ax + t * abx,
                y: ay + t * aby
            };
        }
    }





    function applyForces () {
        nodes.forEach(node => {
            node.dx = 0;
            node.dy = 0;

            nodes.forEach(otherNode=>{
                if (node != otherNode) {
                    let dx = node.x - otherNode.x;
                    let dy = node.y - otherNode.y;
                    let distance = Math.sqrt(dx * dx + dy * dy) + 0.01;
                    if (distance > 300) distance = 100000;
                    let repulsiveForce = (settings.repulsiveForce * settings.repulsiveForce) / distance;
                    node.dx += (dx / distance) * repulsiveForce;
                    node.dy += (dy / distance) * repulsiveForce;
                }
            });

            node.dependencies.forEach(otherNode=> {
                let source = node;
                let target = otherNode; 
                let dx = target.x - source.x;
                let dy = target.y - source.y;
                let distance = Math.sqrt(dx * dx + dy * dy) + 0.01;

                if (distance < 300) distance = 0;

                let attractiveForce = (distance * distance) / 4000;

                attractiveForce = Math.max(0, Math.min(attractiveForce, 2));
                
                source.dx += (dx / distance) * attractiveForce;
                source.dy += (dy / distance) * attractiveForce;
                target.dx -= (dx / distance) * attractiveForce;
                target.dy -= (dy / distance) * attractiveForce;
            });
        });


        nodes.forEach(node => {
            let distance = Math.sqrt(node.dx * node.dx + node.dy * node.dy);
            if (distance > 0) {
                let limitedDistance = Math.min(settings.speed * distance, distance);
                node.x += (node.dx / distance) * limitedDistance;
                node.y += (node.dy / distance) * limitedDistance;
            }

            // node.x = Math.min(settings.width, Math.max(0, node.x));
            // node.y = Math.min(settings.height, Math.max(0, node.y));
        });
    }

    
    // nodes.push(createNode());
    // nodes.push(createNode());
    // nodes.push(createNode());
    // nodes[0].nodeType.text = "int"; nodes[0].nodeName.text = "main"; 
    // //nodes[0].dependencies.push(nodes[1]); nodes[0].dependencies.push(nodes[2]);
    // nodes[0].inputs = [{text: "int argc"}, {text: "const char* argv[]"}];
    // nodes[0].naturalLanguageDescription.text = "main function that calls some stuff and things and does the program";
    
    function render(){
        // console.log(nodes)
        ctx.fillStyle = RenderProperties.colors.primary;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    
        renderGrid(Math.round(View.scale/2));
    
        ctx.translate(View.x, View.y);
        ctx.scale(View.scale, View.scale);

        // applyForces();
        collisionDetection();
        resolveLineCollisions();

        for(let i in nodes)
            renderNode(nodes[i]);

        //partial connection
        if(View.activeConnectionHandle != null)
            renderConnection({x: View.mouseX, y: View.mouseY}, getNodeLeftConnectionPoint(View.activeConnectionHandle));
        
    
        ctx.resetTransform();
        requestAnimationFrame(render);
    }
    
    render();

}, []);

    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%'}}></canvas>
    );
}