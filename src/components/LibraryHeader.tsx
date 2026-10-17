import { AddBookDialog } from './AddBookDialog'

export function LibraryHeader() {
  return (
    <header className="library-header">
      <div>
        <h1>Livros</h1>
        <p>Explore, organize e descubra novas histórias.</p>
      </div>
      <AddBookDialog />
    </header>
  )
}
