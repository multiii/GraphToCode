import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_KEY});

export async function prompt(prompt) {
    const reponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    console.log(reponse.text);
}

function constructGraphToCodePrompt(nodes) { 
     
}

await prompt("hello there!");

