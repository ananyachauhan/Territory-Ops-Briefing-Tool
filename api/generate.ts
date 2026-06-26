import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateBriefing } from './lib/generateBriefing'

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
