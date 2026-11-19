import type { SavedProgress } from '../domain/progress'

const PROGRESS_KEY = 'mydiet.quiz.progress'

export function readProgress(): SavedProgress | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || 'null') as SavedProgress | null
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function writeProgress(progress: SavedProgress) {
  try { sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)) } catch { /* private mode */ }
}
