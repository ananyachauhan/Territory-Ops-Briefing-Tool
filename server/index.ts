import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { generateBriefing } from '../api/lib/generateBriefing'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
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
    res.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate briefing'
    res.status(500).json({ error: message })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
