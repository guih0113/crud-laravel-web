import { keepPreviousData, queryOptions } from '@tanstack/react-query'

export async function getBooks(page?: number): Promise<unknown> {
  const url = `http://localhost:8000/api/books?page=${page ?? 1}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os livros (${response.status})`)
  }

  return response.json()
}

export function getBooksQueryOptions(page: number) {
  return queryOptions({
    queryKey: ['books', page] as const,
    queryFn: () => getBooks(page),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  })
}