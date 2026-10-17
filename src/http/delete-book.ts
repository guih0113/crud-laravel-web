export async function deleteBook(bookId: string): Promise<void> {
  const response = await fetch(`http://localhost:8000/api/books/${bookId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Não foi possível excluir o livro (${response.status})`)
  }
}
