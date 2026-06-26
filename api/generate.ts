import type { VercelRequest, VercelResponse } from '@vercel/node'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

function parseBriefingJson(text: string): {
  leadership?: string
  technician?: string
} {
  const trimmed = text.trim()
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON object found in response')
  }
  return JSON.parse(jsonMatch[0]) as { leadership?: string; technician?: string }
}

export async function generateBriefing(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
): Promise<{ leadership: string; technician: string }> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  const data = (await response.json()) as {
    error?: { message?: string }
    choices?: Array<{ message?: { content?: string } }>
  }

  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Groq API request failed')
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('No text response from Groq')
  }

  const parsed = parseBriefingJson(content)

  if (!parsed.leadership || !parsed.technician) {
    throw new Error('Response missing leadership or technician fields')
  }

  return {
    leadership: parsed.leadership,
    technician: parsed.technician,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'GROQ_API_KEY is not configured' })
    return
  }

  const { systemPrompt, userMessage } = req.body as {
    systemPrompt?: string
    userMessage?: string
  }

  if (!systemPrompt || !userMessage) {
    res.status(400).json({ error: 'systemPrompt and userMessage are required' })
    return
  }

  try {
    const result = await generateBriefing(systemPrompt, userMessage, apiKey)
    res.status(200).json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate briefing'
    res.status(500).json({ error: message })
  }
}
