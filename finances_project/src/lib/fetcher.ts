export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  return { ok: res.ok, status: res.status, data }
}