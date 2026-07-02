import type { ReactNode } from "react"

type AsyncSectionProps<T> = {
    isLoading: boolean
    isError: boolean
    data: T[] | undefined
    loadingFallback?: ReactNode
    errorFallback?: ReactNode
    emptyFallback?: ReactNode
    children: (data: T[]) => ReactNode
}

export function AsyncSection<T>({isLoading, isError, data, loadingFallback, errorFallback, emptyFallback, children}: AsyncSectionProps<T>) {
    if (isLoading) return loadingFallback
    if (isError) return errorFallback
    if (!data || data.length === 0) return emptyFallback
    return children(data)
}