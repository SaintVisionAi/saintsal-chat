import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Call your backend superman-complete.mjs on port 3001
    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        history: history || []
      })
    })

    if (!response.ok) {
      throw new Error('Backend failed')
    }

    const data = await response.json()

    return NextResponse.json({ 
      response: data.response || data.message || 'No response from AI'
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Fallback response for testing
    return NextResponse.json({ 
      response: `I received your message: "${message}"\n\nI'm SAINT SAL™ powered by HACP™ protocol. The backend connection is being configured.`
    })
  }
}
