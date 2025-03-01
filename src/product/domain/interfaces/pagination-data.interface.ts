export interface PaginationData<T> {
    data: T[]       
    total: number
    page: number
    perPage: number
}