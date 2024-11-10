import { NextResponse } from 'next/server'
import { model } from '@/lib/gemini'

export async function POST(req: Request) {
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Received upload request')

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error('No file uploaded')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log('File received:', file.name, 'Size:', file.size, 'bytes')

    const fileContent = await file.text()
    console.log('File content length:', fileContent.length, 'characters')

    console.log('Sending request to Gemini')
    const result = await model.generateContent(`
      You are a helpful assistant that summarizes documents.
      Please summarize the following document:

      ${fileContent}
    `)

    const summary = result.response.text()
    console.log('Received summary from Gemini:', summary)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error processing file:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Error processing file', details: errorMessage }, { status: 500 })
  }
}