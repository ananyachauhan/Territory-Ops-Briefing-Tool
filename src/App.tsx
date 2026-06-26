import { useState } from 'react'
import { BriefingCard } from './components/BriefingCard'
import { Header } from './components/Header'
import { InputForm } from './components/InputForm'
import { SYSTEM_PROMPT, buildUserMessage } from './prompts'
import type { BriefingResponse, FormData } from './types'
import { calculateMetrics, parseFormData } from './utils/calculations'

const initialForm: FormData = {
  businessGoal: '',
  revenueTarget: '',
  currentRevenue: '',
  currentJobsPerDay: '',
  numberOfTechnicians: '',
  averageRevenuePerJob: '',
  workingDaysRemaining: '',
}

function App() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [briefings, setBriefings] = useState<BriefingResponse>({
    leadership: '',
    technician: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState<'leadership' | 'technician' | null>(
    null,
  )

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const parsedPreview = parseFormData(form)
  const metricsPreview = parsedPreview ? calculateMetrics(parsedPreview) : null

  const handleGenerate = async () => {
    setError('')

    const parsed = parseFormData(form)
    if (!parsed) {
      setError('Please fill in all fields with valid values.')
      return
    }

    const metrics = calculateMetrics(parsed)
    const userMessage = buildUserMessage(parsed, metrics)

    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          userMessage,
        }),
      })

      const contentType = response.headers.get('content-type') ?? ''
      const raw = await response.text()

      if (!contentType.includes('application/json')) {
        throw new Error(
          response.ok
            ? 'Server returned an unexpected response.'
            : 'API route not found. Redeploy with the latest code and set GROQ_API_KEY in Vercel.',
        )
      }

      const data = JSON.parse(raw) as {
        error?: string
        leadership?: string
        technician?: string
      }

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to generate briefing')
      }

      if (!data.leadership || !data.technician) {
        throw new Error('Response missing leadership or technician fields')
      }

      setBriefings({
        leadership: data.leadership,
        technician: data.technician,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (field: 'leadership' | 'technician') => {
    const text = briefings[field]
    if (!text) return

    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden">
      <Header />

      <main className="flex flex-1 flex-col gap-4 p-4 lg:grid lg:min-h-0 lg:grid-cols-[minmax(300px,380px)_1fr] lg:gap-3 lg:p-3">
        <section className="flex flex-col rounded-sm border border-tesla-border bg-white p-4 shadow-sm lg:min-h-0 lg:overflow-y-auto lg:p-3">
          <InputForm
            form={form}
            metrics={metricsPreview}
            onChange={handleChange}
            onSubmit={handleGenerate}
            loading={loading}
          />
          {error && (
            <p className="mt-2 shrink-0 text-xs text-tesla-red lg:text-[11px]">{error}</p>
          )}
        </section>

        <section className="flex flex-col gap-4 lg:min-h-0 lg:gap-3">
          <BriefingCard
            label="Leadership Briefing"
            text={briefings.leadership}
            onCopy={() => handleCopy('leadership')}
            copied={copiedField === 'leadership'}
            accent="blue"
          />
          <BriefingCard
            label="Technician Briefing"
            text={briefings.technician}
            onCopy={() => handleCopy('technician')}
            copied={copiedField === 'technician'}
            accent="red"
          />
        </section>
      </main>

      <footer className="shrink-0 border-t border-tesla-border bg-tesla-bg px-4 py-3 lg:px-6 lg:py-2">
        <p className="text-center text-xs leading-relaxed text-tesla-muted lg:text-[11px]">
          © Created by someone who aspires to work at Tesla
        </p>
      </footer>
    </div>
  )
}

export default App
