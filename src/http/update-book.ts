export type UpdateBookInput = {
  title: string
  author: string
  genre: string
  pages: number
  rating: number
  releaseDate: string
}

export async function updateBook(bookId: string, input: UpdateBookInput): Promise<void> {
  const response = await fetch(`http://localhost:8000/api/books/${bookId}`, {
    method: 'PUT',
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
    throw new Error(`Não foi possível atualizar o livro (${response.status})`)
  }
}
