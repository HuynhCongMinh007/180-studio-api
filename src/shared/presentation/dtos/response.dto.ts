import { getRequestId } from '../request-context/request-context'

export interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
  nextPage: number | null
  prevPage: number | null
}

export class ResponseDto<T = unknown> {
  readonly success = true
  readonly message: string
  readonly requestId: string
  readonly timestamp: string
  readonly data: T
  readonly metadata?: PaginationMetadata

  constructor(params: {
    message: string
    data: T
    metadata?: PaginationMetadata
  }) {
    this.message = params.message
    this.data = params.data
    if (params.metadata !== undefined) {
      this.metadata = params.metadata
    }
    this.requestId = getRequestId() ?? ''
    this.timestamp = new Date().toISOString()
  }
}
