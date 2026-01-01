import { NextResponse } from "next/server";
import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export async function POST(req: Request) {
  try {
    // Check token
    if (!token) {
      return NextResponse.json({ error: "Missing GITHUB_TOKEN" }, { status: 500 });
    }

    const body = await req.json();
    const message = body.message

    // Check message
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful job portal assistant." },
        { role: "user", content: message }
      ],
      temperature: 1,
      top_p: 1,
      model: model
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ reply: content });

  } catch (error) {
    console.error("Error during OpenAI API request:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}