import type { UpdateBookInput } from './update-book'

export async function createBook(input: UpdateBookInput): Promise<void> {
  const response = await fetch('http://localhost:8000/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      titulo: input.title,
      autor: input.author,
      genero: input.genre,
      numero_paginas: input.pages,
      avaliacao: input.rating,
      data_lancamento: input.releaseDate,
    }),
  })

  if (!response.ok) {
    throw new Error(`Não foi possível cadastrar o livro (${response.status})`)
  }
}
