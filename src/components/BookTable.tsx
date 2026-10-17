import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { getBooksQueryOptions } from '../http/get-books'
import { deleteBook } from '../http/delete-book'
import { updateBook, type UpdateBookInput } from '../http/update-book'
import type { Book } from '../types/book'
import { Icon } from './Icon'
import { Pagination } from './Pagination'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'

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
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()
  const booksQuery = useQuery(getBooksQueryOptions(currentPage))
  const isLoading = booksQuery.isPending || booksQuery.isPlaceholderData
  const books =
    booksQuery.data && !booksQuery.isPlaceholderData
      ? normalizeBooks(booksQuery.data)
      : []
  const totalPages = booksQuery.data ? normalizeTotalPages(booksQuery.data) : 1
  const error =
    booksQuery.error instanceof Error
      ? booksQuery.error.message
      : booksQuery.error
        ? 'Não foi possível carregar os livros.'
        : null
  const isFetching = booksQuery.isFetching

  function handlePageChange(page: number) {
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
              <tr key={book.id}>
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
                    <EditBookDialog book={book} queryClient={queryClient} />
                    <DeleteBookDialog book={book} queryClient={queryClient} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        disabled={isLoading || isFetching}
        onPageChange={handlePageChange}
      />
    </>
  )
}

type EditBookDialogProps = {
  book: Book
  queryClient: ReturnType<typeof useQueryClient>
}

type EditBookForm = UpdateBookInput

function EditBookDialog({ book, queryClient }: EditBookDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<EditBookForm>(() => getBookForm(book))
  const updateMutation = useMutation({
    mutationFn: (input: EditBookForm) => updateBook(book.id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['books'],
        refetchType: 'all',
      })
      setOpen(false)
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setForm(getBookForm(book))
      updateMutation.reset()
    }
    setOpen(nextOpen)
  }

  function updateField<Key extends keyof EditBookForm>(field: Key, value: EditBookForm[Key]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="edit-action" aria-label={`Editar ${book.title}`}>
        <Icon name="edit" size={17} />
      </DialogTrigger>
      <DialogContent className="edit-dialog">
        <DialogHeader className="edit-dialog-header">
          <DialogTitle>Editar livro</DialogTitle>
          <DialogDescription>Atualize as informações do livro abaixo.</DialogDescription>
        </DialogHeader>
        <form
          className="edit-book-form"
          onSubmit={(event) => {
            event.preventDefault()
            updateMutation.mutate(form)
          }}
        >
          <div className="edit-book-fields">
            <label>
              <span>Título</span>
              <input
                required
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
            </label>
            <label>
              <span>Autor</span>
              <input
                required
                value={form.author}
                onChange={(event) => updateField('author', event.target.value)}
              />
            </label>
            <label>
              <span>Gênero</span>
              <input
                required
                value={form.genre}
                onChange={(event) => updateField('genre', event.target.value)}
              />
            </label>
            <label>
              <span>Número de páginas</span>
              <input
                required
                min={1}
                type="number"
                value={form.pages}
                onChange={(event) => updateField('pages', Number(event.target.value))}
              />
            </label>
            <label>
              <span>Avaliação</span>
              <input
                required
                max={10}
                min={0}
                step={0.1}
                type="number"
                value={form.rating}
                onChange={(event) => updateField('rating', Number(event.target.value))}
              />
            </label>
            <label>
              <span>Data de lançamento</span>
              <input
                required
                type="date"
                value={form.releaseDate}
                onChange={(event) => updateField('releaseDate', event.target.value)}
              />
            </label>
          </div>
          {updateMutation.error && (
            <p className="edit-dialog-error">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : 'Não foi possível atualizar o livro.'}
            </p>
          )}
          <DialogFooter className="edit-dialog-footer">
            <DialogClose
              render={
                <button type="button" className="edit-dialog-cancel" disabled={updateMutation.isPending}>
                  Cancelar
                </button>
              }
            />
            <button className="edit-dialog-submit" type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function getBookForm(book: Book): EditBookForm {
  return {
    title: book.title,
    author: book.author,
    genre: book.genre,
    pages: book.pages,
    rating: book.rating,
    releaseDate: book.releaseDateInput,
  }
}

type DeleteBookDialogProps = {
  book: Book
  queryClient: ReturnType<typeof useQueryClient>
}

function DeleteBookDialog({ book, queryClient }: DeleteBookDialogProps) {
  const [open, setOpen] = useState(false)
  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['books'],
        refetchType: 'all',
      })
      setOpen(false)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="delete-action"
        aria-label={`Excluir ${book.title}`}
        disabled={deleteMutation.isPending}
      >
        <Icon name="trash" size={17} />
      </AlertDialogTrigger>
      <AlertDialogContent className="delete-dialog">
        <AlertDialogHeader className="delete-dialog-header">
          <AlertDialogMedia className="delete-dialog-media">
            <Icon name="trash" size={18} />
          </AlertDialogMedia>
          <AlertDialogTitle>Excluir livro?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o livro &quot;{book.title}&quot;? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogClose className="delete-dialog-close" aria-label="Fechar confirmação">
          ×
        </AlertDialogClose>
        {deleteMutation.error && (
          <p className="delete-dialog-error">
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : 'Não foi possível excluir o livro.'}
          </p>
        )}
        <AlertDialogFooter className="delete-dialog-footer">
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-dialog-action"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(book.id)}
          >
            <Icon name="trash" size={14} />
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SkeletonRow() {
  return (
    <tr className="skeleton-row">
      <td aria-label="Carregando livro">
        <div className="book-title">
          <span className="skeleton-cover" />
          <span className="skeleton-line skeleton-title" />
        </div>
      </td>
      <td aria-label="Carregando autor">
        <span className="skeleton-line" />
      </td>
      <td aria-label="Carregando gênero">
        <span className="skeleton-line skeleton-short" />
      </td>
      <td aria-label="Carregando páginas">
        <span className="skeleton-line skeleton-number" />
      </td>
      <td aria-label="Carregando avaliação">
        <span className="skeleton-line skeleton-rating" />
      </td>
      <td aria-label="Carregando lançamento">
        <span className="skeleton-line skeleton-date" />
      </td>
      <td aria-label="Carregando ações">
        <span className="skeleton-line skeleton-actions" />
      </td>
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
      id: String(item.id ?? item.book_id ?? item.livro_id ?? ''),
      title,
      author: String(item.author ?? item.autor ?? 'Autor não informado'),
      genre: String(item.genre ?? item.genero ?? 'Gênero não informado'),
      pages: Number(item.pages ?? item.numero_paginas ?? 0),
      rating: Number(item.rating ?? item.avaliacao ?? 0),
      releaseDate: formatReleaseDate(item.releaseDate ?? item.release_date ?? item.data_lancamento),
      releaseDateInput: formatDateInput(
        item.releaseDate ?? item.release_date ?? item.data_lancamento
      ),
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

function formatDateInput(value: unknown): string {
  if (!value) return ''

  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

function normalizeTotalPages(payload: unknown): number {
  const response = payload as { livros?: { last_page?: unknown } }
  const totalPages = Number(response.livros?.last_page ?? 1)

  return Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1
}
