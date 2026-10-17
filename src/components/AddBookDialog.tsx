import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { createBook } from '../http/create-book'
import type { UpdateBookInput } from '../http/update-book'
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
import { Icon } from './Icon'

const emptyBook: UpdateBookInput = {
  title: '',
  author: '',
  genre: '',
  pages: 0,
  rating: 0,
  releaseDate: '',
}

export function AddBookDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<UpdateBookInput>(emptyBook)
  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['books'],
        refetchType: 'all',
      })
      setOpen(false)
      setForm(emptyBook)
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      createMutation.reset()
      setForm(emptyBook)
    }
    setOpen(nextOpen)
  }

  function updateField<Key extends keyof UpdateBookInput>(
    field: Key,
    value: UpdateBookInput[Key]
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="new-book-button">
        <Icon name="plus" size={17} />
        Novo livro
      </DialogTrigger>
      <DialogContent className="edit-dialog add-dialog">
        <DialogHeader className="edit-dialog-header">
          <DialogTitle>Novo livro</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para adicionar um novo livro à sua biblioteca.
          </DialogDescription>
        </DialogHeader>
        <form
          className="edit-book-form"
          onSubmit={(event) => {
            event.preventDefault()
            createMutation.mutate({
              ...form,
              pages: Number(form.pages),
              rating: Number(form.rating),
            })
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
                value={form.pages || ''}
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
                value={form.rating || ''}
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
          {createMutation.error && (
            <p className="edit-dialog-error">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : 'Não foi possível cadastrar o livro.'}
            </p>
          )}
          <DialogFooter className="edit-dialog-footer">
            <DialogClose
              render={
                <button
                  type="button"
                  className="edit-dialog-cancel"
                  disabled={createMutation.isPending}
                >
                  Cancelar
                </button>
              }
            />
            <button
              className="edit-dialog-submit"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
