import { OFFLINE_QUEUE_POLL_INTERVAL_MS, OFFLINE_QUEUE_STORAGE_KEY } from './constants'
import type { OfflineQueueAction } from './types'

// In-memory queue to avoid constant localStorage parsing
let memoryQueue: OfflineQueueAction[] | null = null

function isBrowser() {
  return typeof window !== 'undefined'
}

function readQueueRaw(): OfflineQueueAction[] {
  if (!isBrowser()) return []
  
  // Use memory queue if already loaded
  if (memoryQueue) return memoryQueue

  const raw = localStorage.getItem(OFFLINE_QUEUE_STORAGE_KEY)
  if (!raw) {
    memoryQueue = []
    return memoryQueue
  }
  
  try {
    const parsed = JSON.parse(raw) as OfflineQueueAction[]
    memoryQueue = Array.isArray(parsed) ? parsed : []
    return memoryQueue
  } catch {
    memoryQueue = []
    return memoryQueue
  }
}

function writeQueueRaw(actions: OfflineQueueAction[]) {
  if (!isBrowser()) return
  memoryQueue = actions
  localStorage.setItem(OFFLINE_QUEUE_STORAGE_KEY, JSON.stringify(actions))
}

export function getOfflineQueue(): OfflineQueueAction[] {
  return readQueueRaw()
}

export function setOfflineQueue(actions: OfflineQueueAction[]) {
  writeQueueRaw(actions)
}

export function getOfflineQueueCount(): number {
  return readQueueRaw().length
}

function generateActionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function enqueueOfflineAction(
  action: Omit<OfflineQueueAction, 'id' | 'timestamp' | 'retries'>,
): OfflineQueueAction {
  const next: OfflineQueueAction = {
    ...action,
    id: generateActionId(),
    timestamp: Date.now(),
    retries: 0,
  }
  const queue = [...readQueueRaw()] // Copy to avoid mutation issues
  queue.push(next)
  writeQueueRaw(queue)
  return next
}

export function updateOfflineAction(
  actionId: string,
  patch: Partial<OfflineQueueAction>,
): OfflineQueueAction | null {
  const queue = [...readQueueRaw()]
  const idx = queue.findIndex((item) => item.id === actionId)
  if (idx === -1) return null
  queue[idx] = { ...queue[idx], ...patch }
  writeQueueRaw(queue)
  return queue[idx]
}

export function removeOfflineAction(actionId: string): void {
  const queue = [...readQueueRaw()]
  const next = queue.filter((item) => item.id !== actionId)
  writeQueueRaw(next)
}

export function subscribeOfflineQueue(
  onChange: (actions: OfflineQueueAction[]) => void,
): () => void {
  if (!isBrowser()) return () => undefined

  const emit = () => onChange(readQueueRaw())
  const onStorage = (event: StorageEvent) => {
    if (event.key === OFFLINE_QUEUE_STORAGE_KEY) {
      // Force reload from localStorage on external change
      memoryQueue = null 
      emit()
    }
  }

  window.addEventListener('storage', onStorage)
  const interval = window.setInterval(emit, OFFLINE_QUEUE_POLL_INTERVAL_MS)
  emit()

  return () => {
    window.removeEventListener('storage', onStorage)
    window.clearInterval(interval)
  }
}
