import { useQuery } from '@tanstack/react-query'

import { getBooksQueryOptions } from '../http/get-books'

export function LibraryToolbar() {
  const booksQuery = useQuery(getBooksQueryOptions(1))
  const totalBooks = getTotalBooks(booksQuery.data)

  return (
    <div className="toolbar">
      <strong className="book-count">
        {booksQuery.isPending ? 'Carregando...' : `${totalBooks} livros cadastrados`}
      </strong>
    </div>
  )
}

function getTotalBooks(payload: unknown): number {
  if (!payload || typeof payload !== 'object') return 0

  const response = payload as {
    livros?: {
      total?: unknown
    }
  }
  const total = Number(response.livros?.total)

  return Number.isFinite(total) && total >= 0 ? total : 0
}
