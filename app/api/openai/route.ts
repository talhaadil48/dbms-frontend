import { console } from "inspector"
import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client with the OPEN_KEY environment variable
const openai = new OpenAI({
  apiKey: process.env.OPEN_KEY,
})

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log(body)
    const { message, characteristics, chatbotName, userName } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!characteristics || !Array.isArray(characteristics)) {
      return NextResponse.json({ error: "Characteristics must be an array" }, { status: 400 })
    }

    // Format the characteristics as a string
    const characteristicsText = characteristics.map((c) => `- ${c}`).join("\n")

    // Create a system prompt that includes the chatbot's characteristics
    const systemPrompt = `
You are ${chatbotName}, an AI assistant with the following characteristics:
${characteristicsText}

IMPORTANT INSTRUCTIONS:
1. ONLY answer questions that are related to your characteristics and knowledge.
2. If asked about something outside your characteristics, politely explain that you can only help with topics related to your characteristics.
3. Keep your responses concise, helpful, and friendly.
4. Address the user as ${userName}.
5. Do not make up information that isn't related to your characteristics.
6. Maintain a consistent personality based on your characteristics.
`

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    })

    // Extract the response
    const response =
      completion.choices[0]?.message?.content || "I apologize, but I am unable to provide a response at this time."

    // Return the response
    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error calling OpenAI:", error)
    return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
  }
}
