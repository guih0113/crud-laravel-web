import { useEffect, useState } from 'react'

import { getBooks } from '../http/get-books'
import type { Book } from './bookData'
import { Icon } from './Icon'
import { Pagination } from './Pagination'

function Cover({ book }: { book: Book }) {
  return (
    <div className={`book-cover ${book.coverClass}`}>
      {book.coverLabel.split('\n').map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

function Rating({ value }: { value: number }) {
  return (
    <div className="rating">
      <span aria-label={`${value} de 10`}>★★★★★</span>
      <b>{value.toFixed(1)}</b>
    </div>
  )
}

export function BookTable() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let isCurrent = true

    getBooks(currentPage)
      .then((payload) => {
        if (isCurrent) {
          setBooks(normalizeBooks(payload))
          setTotalPages(normalizeTotalPages(payload))
          setIsLoading(false)
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Não foi possível carregar os livros.'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [currentPage])

  function handlePageChange(page: number) {
    setBooks([])
    setIsLoading(true)
    setError(null)
    setCurrentPage(page)
  }

  return (
    <>
      <div className="table-scroll">
        <table className="book-table">
        <thead>
          <tr>
            <th>Livro</th>
            <th>Autor</th>
            <th>Gênero</th>
            <th>Páginas</th>
            <th>Avaliação</th>
            <th>Lançamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}
          {!isLoading && error && (
            <tr>
              <td className="table-message table-error" colSpan={7}>
                {error}
              </td>
            </tr>
          )}
          {!isLoading && !error && books.length === 0 && (
            <tr>
              <td className="table-message" colSpan={7}>
                Nenhum livro encontrado.
              </td>
            </tr>
          )}
          {books.map((book) => (
            <tr key={book.title}>
              <td>
                <div className="book-title">
                  <Cover book={book} />
                  <strong>{book.title}</strong>
                </div>
              </td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.pages}</td>
              <td>
                <Rating value={book.rating} />
              </td>
              <td>{book.releaseDate}</td>
              <td>
                <div className="row-actions">
                  <button type="button" aria-label={`Visualizar ${book.title}`}>
                    <Icon name="eye" size={17} />
                  </button>
                  <button type="button" aria-label={`Editar ${book.title}`}>
                    <Icon name="edit" size={17} />
                  </button>
                  <button
                    className="delete-action"
                    type="button"
                    aria-label={`Excluir ${book.title}`}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} disabled={isLoading} onPageChange={handlePageChange} />
    </>
  )
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td aria-label="Carregando livro"><div className="book-title"><span className="skeleton-cover" /><span className="skeleton-line skeleton-title" /></div></td>
      <td aria-label="Carregando autor"><span className="skeleton-line" /></td>
      <td aria-label="Carregando gênero"><span className="skeleton-line skeleton-short" /></td>
      <td aria-label="Carregando páginas"><span className="skeleton-line skeleton-number" /></td>
      <td aria-label="Carregando avaliação"><span className="skeleton-line skeleton-rating" /></td>
      <td aria-label="Carregando lançamento"><span className="skeleton-line skeleton-date" /></td>
      <td aria-label="Carregando ações"><span className="skeleton-line skeleton-actions" /></td>
    </tr>
  )
}

function normalizeBooks(payload: unknown): Book[] {
  const response = payload as {
    data?: unknown
    books?: unknown
    livros?: { data?: unknown }
  }
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.books)
        ? response.books
        : Array.isArray(response.livros?.data)
          ? response.livros.data
          : []

  return records.map((record, index) => {
    const item = record as Record<string, unknown>
    const title = String(item.title ?? item.titulo ?? item.name ?? `Livro ${index + 1}`)

    return {
      title,
      author: String(item.author ?? item.autor ?? 'Autor não informado'),
      genre: String(item.genre ?? item.genero ?? 'Gênero não informado'),
      pages: Number(item.pages ?? item.numero_paginas ?? 0),
      rating: Number(item.rating ?? item.avaliacao ?? 0),
      releaseDate: formatReleaseDate(item.releaseDate ?? item.release_date ?? item.data_lancamento),
      coverLabel: title,
      coverClass: 'cover-default'
    }
  })
}

function formatReleaseDate(value: unknown): string {
  if (!value) return 'Data não informada'

  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function normalizeTotalPages(payload: unknown): number {
  const response = payload as { livros?: { last_page?: unknown } }
  const totalPages = Number(response.livros?.last_page ?? 1)

  return Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1
}
