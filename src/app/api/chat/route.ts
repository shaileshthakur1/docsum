import { NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    console.log('History for startChat:', messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [msg.content], 
    })));

    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [msg.content],
      })),
    });

    const lastMessage = messages[messages.length - 1].content;
    console.log('Sending message to Gemini:', lastMessage);

    try {
      const result = await chat.sendMessage(lastMessage); 
      const response = await result.response.text(); // Ensure awaiting this
      console.log('Received response from Gemini:', response);
      return NextResponse.json({ response });
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return NextResponse.json({ error: 'Error sending message to chat model' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Error processing chat request' }, { status: 500 });
  }
}
