import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Debug logging
console.log("OPEN_ROUTER_API_KEY present:", !!process.env.OPEN_ROUTER_API_KEY);
if (process.env.OPEN_ROUTER_API_KEY) {
  console.log("OPEN_ROUTER_API_KEY length:", process.env.OPEN_ROUTER_API_KEY.length);
}

// Validate API key before instantiating OpenAI client
if (!process.env.OPEN_ROUTER_API_KEY) {
  throw new Error("OPEN_ROUTER_API_KEY environment variable is not set");
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});
const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Only ask questions about the following details in order, and wait for the user's answer before asking the next:

Starting location (source)

Destination city or country

Group size (Solo, Couple, Family, Friends)

Budget (Low, Medium, High)

Trip duration (number of days)

Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)

Special requirements or preferences (if any)
Do not ask multiple questions at once, and never ask irrelevant questions.
If any answer is missing or unclear, politely ask the user to clarify before proceeding.
Always maintain a conversational, interactive style while asking questions.
Along with response also send which ui component to display for generative UI for example 'budget/groupSize/TripDuration/Final'), where 'Final' means AI generating complete final output.
Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with following JSON schema:
{
"resp": "Text Resp",
"ui": "budget/groupSize/TripDuration/Final"
}`;
export async function POST(req: NextRequest) {
  // Validate API key early
  if (!process.env.OPEN_ROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPEN_ROUTER_API_KEY server environment variable" },
      { status: 500 }
    );
  }

  // Validate request body
  const body = await req.json().catch(() => null as any);
  const messages = (body && body.messages) || [];
  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Invalid request: 'messages' must be an array" },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        ...messages,
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });
    const message = completion.choices?.[0]?.message;
    if (!message?.content) {
      return NextResponse.json(
        { error: "No content returned from the model" },
        { status: 502 }
      );
    }

    // Strictly parse JSON returned by the model
    try {
      const data = JSON.parse(message.content);
      return NextResponse.json(data);
    } catch (parseErr) {
      console.error("Model returned non-JSON content:", message.content);
      return NextResponse.json(
        { error: "Invalid JSON returned by model", raw: message.content },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error(e);
    const errMsg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", message: errMsg },
      { status: 500 }
    );
  }
}
