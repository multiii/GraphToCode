import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync} from 'fs';
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_KEY });

export async function GET (req) {
    console.log("GET REQUEST");
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!existsSync("./system_prompts/code_to_graph.txt")) {
        console.log("FILE DOESNT EXIST");
    }

    let filePath = path.join(process.cwd(), 'system_prompts', 'code_to_graph.txt');
    let system_prompt = readFileSync(filePath, 'utf-8');

    console.log(1234, system_prompt)

    // console.log(system_prompt);

    return Response.json({result: system_prompt});
}

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt || prompt.trim() === "") {
            return new Response(
                JSON.stringify({ error: "Prompt is required and cannot be empty." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        return new Response(JSON.stringify({ result: response.text }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in POST:", error.message);
        return new Response(
            JSON.stringify({ error: "An error occurred while processing your request." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}