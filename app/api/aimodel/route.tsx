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
  console.log("AI Model API called");
  
  // Validate API key early
  if (!process.env.OPEN_ROUTER_API_KEY) {
    console.error("Missing OPEN_ROUTER_API_KEY server environment variable");
    return NextResponse.json(
      { error: "Missing OPEN_ROUTER_API_KEY server environment variable" },
      { status: 500 }
    );
  }

  // Log API key info (first 4 and last 4 characters only for security)
  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  console.log("API Key present:", !!apiKey);
  if (apiKey) {
    console.log("API Key length:", apiKey.length);
    console.log("API Key (masked):", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));
  }

  // Validate request body
  const body = await req.json().catch((error) => {
    console.error("Failed to parse request body:", error);
    return null;
  });
  
  console.log("Request body:", JSON.stringify(body, null, 2));
  
  const messages = (body && body.messages) || [];
  if (!Array.isArray(messages)) {
    console.error("Invalid request: 'messages' must be an array");
    return NextResponse.json(
      { error: "Invalid request: 'messages' must be an array" },
      { status: 400 }
    );
  }
  
  console.log("Messages to send to AI:", JSON.stringify(messages, null, 2));

  try {
    console.log("Calling OpenAI API with model: tngtech/deepseek-r1t2-chimera:free");
    console.log("Messages being sent:", [
      {
        role: "system",
        content: PROMPT,
      },
      ...messages,
    ]);
    
    const completion = await openai.chat.completions.create({
      model: "tngtech/deepseek-r1t2-chimera:free",
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
    
    console.log("OpenAI API response:", JSON.stringify(completion, null, 2));
    
    const message = completion.choices?.[0]?.message;
    if (!message?.content) {
      console.error("No content returned from the model");
      return NextResponse.json(
        { error: "No content returned from the model" },
        { status: 502 }
      );
    }

    // Strictly parse JSON returned by the model
    try {
      const data = JSON.parse(message.content);
      console.log("Parsed JSON response:", data);
      return NextResponse.json(data);
    } catch (parseErr) {
      console.error("Model returned non-JSON content:", message.content);
      return NextResponse.json(
        { error: "Invalid JSON returned by model", raw: message.content },
        { status: 502 }
      );
    }
  } catch (e: any) {
    console.error("Error calling OpenAI API:", e);
    console.error("Error name:", e?.name);
    console.error("Error message:", e?.message);
    console.error("Error stack:", e?.stack);
    console.error("Error status:", e?.status);
    console.error("Error response:", e?.response);
    
    // Handle rate limit errors specifically
    if (e.status === 429 || (e.message && e.message.includes('rate limit'))) {
      console.log("Rate limit error detected");
      return NextResponse.json(
        { 
          error: "Rate limit exceeded", 
          message: "Too many requests. Please wait a moment and try again.",
          retryAfter: e.headers?.get('Retry-After') || 60
        },
        { status: 429 }
      );
    }
    
    // Handle provider errors specifically
    if (e?.response?.status === 502 || e?.status === 502) {
      console.error("Provider returned error:", e?.response?.data || e?.message);
      return NextResponse.json(
        { 
          error: "Provider Error", 
          message: "The AI provider returned an error. This might be due to temporary issues with the service.",
          details: e?.response?.data || e?.message
        },
        { status: 502 }
      );
    }
    
    // Handle authentication errors
    if (e?.status === 401) {
      console.error("Authentication error with OpenRouter API");
      return NextResponse.json(
        { 
          error: "Authentication Error", 
          message: "There was an issue authenticating with the AI service. Please check your API key."
        },
        { status: 401 }
      );
    }
    
    const errMsg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", message: errMsg },
      { status: 500 }
    );
  }
}
