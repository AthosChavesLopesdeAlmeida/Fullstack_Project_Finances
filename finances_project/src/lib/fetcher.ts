export async function apiFetch(path: string, options: RequestInit = {}) {
  const method = options.method ?? (options.body ? 'POST' : 'GET')

  const res = await fetch(path, {
    ...options,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  const text = await res.text()

  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: 'Resposta inválida do servidor' }
    }
  }

  return { ok: res.ok, status: res.status, data }
}