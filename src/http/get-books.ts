export async function getBooks(page?: number): Promise<unknown> {
  const url = `http://localhost:8000/api/books?page=${page ?? 1}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os livros (${response.status})`)
  }

  return response.json()
}