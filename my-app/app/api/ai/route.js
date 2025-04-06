import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync} from 'fs';
import path from "path";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_KEY});

export async function GET (req) {
    console.log("GET REQUEST");
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!existsSync("./system_prompts/code_to_graph.txt")) {
        console.log("FILE DOESNT EXIST");
    }

    let filePath = path.join(process.cwd(), 'system_prompts', 'code_to_graph.txt');
    let system_prompt = readFileSync(filePath, 'utf-8');

    // console.log(system_prompt);

    return Response.json({result: system_prompt});
}

export async function POST (req) {
    let {prompt} = await req.json();

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    return Response.json({ result: response.text });
}