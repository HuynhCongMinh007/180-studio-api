export interface ErrorResponseDto {
  success: false
  message: string
  messageCode: string
  error: {
    details: string | { field: string; message?: string }[]
  }
  path: string
  requestId: string
  timestamp: string
}
