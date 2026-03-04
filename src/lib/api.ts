import { ApiClient } from '@/lib/apiClient'

// App-level API client configured from Vite environment variables.
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
export const api = new ApiClient(baseUrl)
