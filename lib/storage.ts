import type { AllResults, TestId } from './data'

const STORAGE_KEY = 'discovery_suite_v1'
const ANSWERS_KEY = 'discovery_suite_answers_v1'

export function loadResults(): AllResults {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function saveResults(results: AllResults): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
  } catch {}
}

export function saveTestResult(testId: TestId, data: unknown): void {
  const current = loadResults()
  const completedAt = current.completedAt || {}
  saveResults({
    ...current,
    [testId]: data,
    completedAt: { ...completedAt, [testId]: new Date().toISOString() },
  })
}

export function clearResults(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(ANSWERS_KEY)
}

// In-progress answer saving
export function loadAnswers(testId: TestId): Record<number, unknown> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    const all = raw ? JSON.parse(raw) : {}
    return all[testId] || {}
  } catch { return {} }
}

export function saveAnswers(testId: TestId, answers: Record<number, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    const all = raw ? JSON.parse(raw) : {}
    localStorage.setItem(ANSWERS_KEY, JSON.stringify({ ...all, [testId]: answers }))
  } catch {}
}

export function clearAnswers(testId: TestId): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    const all = raw ? JSON.parse(raw) : {}
    delete all[testId]
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(all))
  } catch {}
}

// Reminder signup
export function saveReminderEmail(email: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('discovery_reminder_email', email)
    localStorage.setItem('discovery_reminder_signed_up', new Date().toISOString())
  } catch {}
}

export function hasReminderSignup(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('discovery_reminder_email')
}

// Payment status
// Known v2 testing mode: results are temporarily unlocked for everyone so
// the assessment scoring and results experience can be validated before the
// paywall is rebuilt and reintroduced.
export function markResultsPaid(testIds: string[]): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getPaidTests()
    const all = [...new Set([...existing, ...testIds])]
    localStorage.setItem('discovery_paid_tests', JSON.stringify(all))
  } catch {}
}

export function getPaidTests(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('discovery_paid_tests')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function isTestPaid(_testId: TestId): boolean {
  return true
}
