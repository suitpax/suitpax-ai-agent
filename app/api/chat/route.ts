import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { buildTravelContext } from "@/lib/anthropic"

// Initialize Anthropic client on server side only
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          response: "I'm sorry, I couldn't understand your message. Please try again.",
        },
        { status: 400 },
      )
    }

    const { message, isPro = false, plan = "free" } = body

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Valid message is required",
          response: "Please enter a message to get started with your travel planning.",
        },
        { status: 400 },
      )
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        {
          error: "Message too long",
          response: "Please keep your message under 1000 characters.",
        },
        { status: 400 },
      )
    }

    const context = buildTravelContext()

    let response
    try {
      console.log("Generating AI response for:", message.trim(), "Pro:", isPro, "Plan:", plan)
      response = await generateChatResponse(message.trim(), context, isPro, plan)
      console.log("AI response generated successfully")
    } catch (aiError) {
      console.error("AI generation error:", aiError)

      if (aiError instanceof Error) {
        if (aiError.message.includes("authentication") || aiError.message.includes("401")) {
          response =
            "I'm having trouble connecting to my AI services. Please check the API configuration and try again."
        } else if (aiError.message.includes("rate_limit") || aiError.message.includes("429")) {
          response = "I'm currently experiencing high demand. Please try again in a moment."
        } else if (aiError.message.includes("timeout")) {
          response = "The request is taking longer than expected. Please try again with a shorter message."
        } else {
          response = getFallbackResponse(message.trim(), isPro, plan)
        }
      } else {
        response = getFallbackResponse(message.trim(), isPro, plan)
      }
    }

    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error("Chat API error:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        response:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists.",
      },
      { status: 500 },
    )
  }
}

async function generateChatResponse(message: string, context?: string, isPro = false, plan = "free"): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("Anthropic API key not configured, using fallback responses")
    return getFallbackResponse(message, isPro, plan)
  }

  try {
    const { systemPrompt, userPrompt } = buildProPrompts(message, context, isPro, plan)

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: isPro ? 30000 : 20000,
      temperature: isPro ? 0.7 : 0.8,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type === "text") {
      return content.text
    } else {
      throw new Error("Unexpected response type from Anthropic API")
    }
  } catch (error) {
    console.error("Anthropic API error:", error)

    if (error instanceof Error) {
      if (error.message.includes("authentication") || error.message.includes("401")) {
        console.error("Authentication error - check API key")
        return "I'm having trouble connecting to my AI services. Please check the API configuration."
      }
      if (error.message.includes("rate_limit")) {
        return "I'm currently experiencing high demand. Please try again in a moment."
      }
    }

    return getFallbackResponse(message, isPro, plan)
  }
}

function buildProPrompts(message: string, context?: string, isPro = false, plan = "free") {
  const baseSystemPrompt = `You are Zia, Suitpax's advanced AI business travel assistant. You help employees find flights, hotels, and manage travel efficiently.

CORE IDENTITY:
- Professional, knowledgeable business travel expert
- Work for Suitpax, a leading travel technology company
- Specialize in corporate travel, expense management, and travel optimization
- Access to real-time flight and hotel data

PERSONALITY:
- Professional yet approachable and friendly
- Proactive in suggesting solutions and alternatives
- Detail-oriented and thorough in recommendations
- Efficient and focused on saving time and money
- Empathetic to business travel challenges

COMMUNICATION STYLE:
- Use clear, well-structured responses
- NEVER use emojis - keep responses clean and professional
- Organize information with proper spacing and formatting
- Use bullet points and sections for clarity
- Provide specific details (times, prices, locations, amenities)
- Always offer next steps or ask clarifying questions
- Use professional language but remain conversational

RESPONSE FORMATTING:
- Use **bold** for important headings and key information
- Use proper line breaks between sections
- Use bullet points (•) for lists
- Organize content in logical sections
- Keep paragraphs concise and scannable
- Use clear hierarchy with headings and subheadings`

  const proEnhancements = isPro
    ? `

PREMIUM CAPABILITIES (ACTIVE):
- Advanced document processing and OCR analysis
- Predictive travel optimization and cost analysis
- Real-time expense tracking and categorization
- Priority booking and customer support
- Advanced analytics and reporting
- Custom travel policy compliance
- Multi-currency and international support
- Carbon footprint tracking and sustainability insights

PLAN-SPECIFIC FEATURES:
${
  plan === "starter"
    ? `
- Basic document processing (10/month)
- Standard travel insights
- Email support
`
    : plan === "business"
      ? `
- Unlimited document processing
- Advanced analytics and reporting
- 24/7 priority support
- Corporate rate access
- Travel policy compliance
- Calendar integration
`
      : plan === "enterprise"
        ? `
- All Business features plus:
- Custom AI training and optimization
- API access and integrations
- Dedicated account manager
- White-label solutions
- Advanced security and compliance
- Custom reporting dashboards
`
        : ""
}

RESPONSE ENHANCEMENT FOR PRO USERS:
- Provide more detailed analysis and insights
- Include cost optimization suggestions
- Offer predictive recommendations
- Suggest policy compliance checks
- Include sustainability metrics when relevant
- Provide advanced booking strategies
`
    : `

FREE TIER LIMITATIONS:
- Basic travel search and recommendations
- Limited document processing
- Standard support
- Basic expense tracking
- Encourage upgrade to Pro for advanced features
`

  const enhancedSystemPrompt = baseSystemPrompt + proEnhancements

  const proContext = isPro
    ? `
[PRO USER - ${plan.toUpperCase()} PLAN]
Enhanced capabilities active: Document OCR, Advanced AI, Priority Support, Analytics
`
    : `
[FREE USER]
Limited to basic features. Suggest Pro upgrade for advanced capabilities.
`

  return {
    systemPrompt: enhancedSystemPrompt,
    userPrompt: `${proContext}

User query: "${message}"

${context ? `Available data: ${context}` : ""}

${isPro ? "Provide comprehensive Pro-level assistance with advanced insights and recommendations." : "Provide helpful basic assistance and highlight Pro features that would benefit the user."}`,
  }
}

function getFallbackResponse(message: string, isPro = false, plan = "free"): string {
  const lowerMessage = message.toLowerCase()

  const proPrefix = isPro
    ? `**Suitpax AI Pro ${plan.charAt(0).toUpperCase() + plan.slice(1)} - Advanced Response**\n\n`
    : ""
  const proSuffix = !isPro
    ? `\n\n**Upgrade to Suitpax AI Pro**\n\n• Advanced AI capabilities with deeper insights\n• Document OCR processing for receipts and invoices\n• Predictive travel optimization\n• 24/7 priority support\n• Unlimited features and analytics\n• Starting from just €20/month\n\nUpgrade now to unlock the full potential of AI-powered business travel!`
    : ""

  if (lowerMessage.includes("madrid") && lowerMessage.includes("london")) {
    const basicResponse = `**Madrid to London - Business Travel Options**

**Recommended Flights**

**British Airways BA 456** - Premium Choice
• Departure: 08:30 → Arrival: 10:15 (2h 45m)
• Price: 245 EUR | Direct flight
• Features: WiFi, Premium meals, Lounge access
• Aircraft: Airbus A320 | Business amenities available

**Iberia IB 3170** - Best Value
• Departure: 14:20 → Arrival: 16:05 (2h 45m) 
• Price: 198 EUR | Direct flight
• Features: WiFi, Meal service, Priority boarding
• Aircraft: Airbus A321 | Spanish carrier advantage

**London Accommodation**

**London Marriott Hotel County Hall**
• Location: Westminster Bridge Road, London SE1
• Price: 320 EUR/night | Rating: 4.5/5 stars
• Business Features: Business Center, Meeting rooms, Concierge
• Highlights: Thames views, Near Parliament & Big Ben
• Amenities: WiFi, Gym, Restaurant, 24h Room Service`

    const proEnhancements = isPro
      ? `

**Pro Analytics & Insights**

• **Cost Optimization:** Book BA 456 for 15% savings vs peak times
• **Carbon Footprint:** 0.18 tons CO2 (Direct flights reduce emissions by 23%)
• **Productivity Score:** Morning arrival allows same-day meetings
• **Policy Compliance:** Within company travel guidelines
• **Loyalty Benefits:** Earn 1,250 Avios + tier points
• **Weather Impact:** 92% on-time performance for this route
• **Alternative Routes:** Consider Gatwick for €30 savings

**Expense Automation**

• Auto-categorize as "Business Travel - International"
• Pre-fill expense report with flight details
• Attach digital receipts automatically
• Calculate per diem allowances for London (€85/day)

**Next-Level Recommendations**

• Book hotel 3 days in advance for 12% additional savings
• Use corporate Amex for 2x points + travel insurance
• Schedule return flight Tuesday-Thursday for optimal rates
• Consider upgrading to Business for long-term client meetings`
      : ""

    return proPrefix + basicResponse + proEnhancements + proSuffix
  }

  const basicResponse = `**Welcome to Suitpax - Your Complete Business Travel Solution**

I'm Zia, your dedicated AI travel assistant, ready to help with:

**Smart Flight Search**
• Compare 500+ airlines worldwide
• Find direct routes and optimal connections
• Access exclusive corporate rates
• Flexible booking with change options

**Premium Accommodations**
• Business hotels in 1000+ cities
• Meeting rooms and conference facilities
• Corporate rates up to 30% off
• Loyalty program integration

**Popular Requests**
• "Book flights from [city] to [city]"
• "Find hotels near [business district]"
• "Plan a 3-day business trip to [destination]"
• "Help with expense reporting"`

  const proEnhancements = isPro
    ? `

**Your Pro Features Active**

• **Document OCR:** Upload receipts, invoices, boarding passes for instant processing
• **Advanced AI:** Predictive optimization and personalized recommendations
• **Priority Support:** 24/7 dedicated assistance with faster response times
• **Analytics Dashboard:** Detailed insights on travel patterns and cost optimization
• **Policy Compliance:** Automatic checking against company travel policies
• **Carbon Tracking:** Monitor and offset your business travel footprint
• **Unlimited Processing:** No limits on searches, bookings, or document uploads

**Pro-Exclusive Commands**
• "Analyze my travel spending patterns"
• "Optimize my upcoming trip itinerary"
• "Process this expense receipt"
• "Show me carbon-neutral flight options"
• "Generate monthly travel report"
• "Check policy compliance for this booking"`
    : ""

  return proPrefix + basicResponse + proEnhancements + proSuffix
}
