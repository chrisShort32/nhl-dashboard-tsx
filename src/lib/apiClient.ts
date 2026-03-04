export type ApiError = {
    message: string
    status?: number
    details?: unknown
}

// Shared request options used by typed `get` and `post` helpers.
type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
    headers?: Record<string, string>
    body?: unknown
}

// Joins a base URL and path without duplicate slashes.
function joinUrl(base: string, path: string) {
    if (!base) return path
    const b = base.endsWith('/') ? base.slice(0, -1) : base
    const p = path.startsWith('/') ? path : `/${path}`
    return `${b}${p}`
}

// Parses JSON when possible, but gracefully returns raw text when not JSON.
async function parseJsonSafe(res: Response) {
    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

// Thin API client wrapper with consistent JSON headers and error normalization.
export class ApiClient {
    constructor(private readonly baseUrl: string) {}

    async request<T>(path: string, options:RequestOptions = {}): Promise<T> {
        const url = joinUrl(this.baseUrl, path)

        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers ?? {}),
            },
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
        })

        const data = await parseJsonSafe(res)

        if (!res.ok) {
            const err: ApiError = {
                message:
                    typeof data === 'object' && data && 'message' in (data as any)
                        ? String((data as any).message)
                        : `Request failed (${res.status})`,
                status: res.status,
                details: data,
            }
            throw err
        }

        return data as T
    }

    get<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
        return this.request<T>(path, {...options, method: 'GET'})
    }

    post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) {
        return this.request<T>(path, {...options, method: 'POST', body})
    }
}
