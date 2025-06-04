import { type NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"] || "",
});

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          response: "I'm sorry, I couldn't understand your message. Please try again.",
        },
        { status: 400 }
      );
    }

    const { message } = body;

    // Validate user input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Valid message is required",
          response: "Please enter a message to get started with your travel planning.",
        },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        {
          error: "Message too long",
          response: "Please keep your message under 1000 characters.",
        },
        { status: 400 }
      );
    }

    const prompt = `
      You are Suitpax AI, an advanced business travel assistant designed to help employees find flights, hotels, and other travel services. Your task is to interpret user queries, use provided functions to gather information, and present organized results.

      The user has submitted the following search query:

      <search_query>
      ${message.trim()}
      </search_query>

      Follow these steps to assist the user:

      1. Analyze the search query and wrap your analysis in <travel_analysis> tags. In your analysis:
         - List out key travel details (destination, dates, number of travelers, preferences)
         - For each detail, note which function(s) you'll need to call
         - Plan the order of your function calls

      2. Use the appropriate functions to search for flights and hotels based on the information from the search query. To call a function, use this format:
         <function_call>function_name(parameter1="value1", parameter2="value2")</function_call>

      3. After each function call, you'll receive a <function_result> containing the requested information. Process this information to compile your response.

      4. If you encounter errors or need to refine your search, adjust the parameters and make additional function calls as needed.

      5. Once you have all necessary information, present the top 3-5 choices for both flights and hotels in a clear, organized manner.

      6. Provide a brief summary of the options and any notable considerations.

      Important guidelines:
      - Use ONLY the functions provided to you.
      - Do NOT invent or assume any information not given by the function results.
      - If you can't find suitable options or if there's insufficient information in the search query, explain this and suggest how the user could refine their search.
      - Keep your response concise and to the point.

      Present your final response in this format:

      <response>
      <flights>
      [List the top flight options here, including airline, departure and arrival times, price, and layovers]
      </flights>

      <hotels>
      [List the top hotel options here, including name, location, price per night, and star rating]
      </hotels>

      <summary>
      [Provide a brief summary of the options and any additional recommendations]
      </summary>
      </response>

      Here are the functions available to you:

      <available_functions>
      [Provide details on functions available for travel data processing]
      </available_functions>

      Begin your analysis of the user's query now.

      Provide concise responses with clear, vertical organization.
    `;

    let response;
    try {
      // Make the API call to Anthropic
      const result = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022", // ✅ Modelo correcto
        max_tokens: 4000, // Reducido para mejor rendimiento
        temperature: 0.3, // ✅ Mejor para asistente de viajes
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // ✅ Acceso correcto a la respuesta
      response = result.content[0]?.text || "No response received from the AI.";
      
    } catch (error) {
      console.error("Error calling Anthropic API:", error);

      // Manejo de errores más específico
      if (error?.status === 401 || error?.message?.includes("authentication")) {
        response = "Authentication error: Please check your API key configuration.";
      } else if (error?.status === 429 || error?.message?.includes("rate_limit")) {
        response = "Rate limit exceeded: Please try again later.";
      } else if (error?.message?.includes("timeout")) {
        response = "Request timeout: The request took too long to process. Please try again.";
      } else if (error?.status === 400) {
        response = "Invalid request: Please check your input and try again.";
      } else {
        response = "An unexpected error occurred while processing your request.";
      }
    }

    return NextResponse.json({ response }, { status: 200 });
    
  } catch (error) {
    console.error("Internal server error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        response:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists.",
      },
      { status: 500 }
    );
  }
}