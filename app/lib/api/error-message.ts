type ApiErrorLike = {
  response?: {
    data?: {
      message?: string
      error?: string
    }
    statusText?: string
  }
  message?: string
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const candidate = error as ApiErrorLike

  return (
    candidate?.response?.data?.message ??
    candidate?.response?.data?.error ??
    candidate?.message ??
    candidate?.response?.statusText ??
    fallback
  )
}
