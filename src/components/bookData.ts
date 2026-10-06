export type Book = {
  title: string
  author: string
  genre: string
  pages: number
  rating: number
  releaseDate: string
  coverLabel: string
  coverClass: string
}

export const books: Book[] = [
  {
    title: 'O Hobbit',
    author: 'J. R. R. Tolkien',
    genre: 'Fantasia',
    pages: 310,
    rating: 9.6,
    releaseDate: '21/09/1937',
    coverLabel: 'O Hobbit',
    coverClass: 'cover-hobbit'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Ficção Científica',
    pages: 328,
    rating: 8.9,
    releaseDate: '08/06/1949',
    coverLabel: '1984',
    coverClass: 'cover-1984'
  },
  {
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    genre: 'Ficção',
    pages: 96,
    rating: 8.1,
    releaseDate: '06/04/1943',
    coverLabel: 'O Pequeno\nPríncipe',
    coverClass: 'cover-prince'
  },
  {
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Romance',
    pages: 256,
    rating: 8.7,
    releaseDate: '1899-01-01',
    coverLabel: 'Dom\nCasmurro',
    coverClass: 'cover-casmurro'
  },
  {
    title: 'A Revolução dos Bichos',
    author: 'George Orwell',
    genre: 'Fábula',
    pages: 112,
    rating: 8.3,
    releaseDate: '17/08/1945',
    coverLabel: 'A Revolução\ndos Bichos',
    coverClass: 'cover-animals'
  },
  {
    title: 'Duna',
    author: 'Frank Herbert',
    genre: 'Ficção Científica',
    pages: 688,
    rating: 9.2,
    releaseDate: '01/08/1965',
    coverLabel: 'DUNA',
    coverClass: 'cover-dune'
  }
]
