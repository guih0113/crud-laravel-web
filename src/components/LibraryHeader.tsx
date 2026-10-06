import { Icon } from './Icon'

export function LibraryHeader() {
  return (
    <header className="library-header">
      <div>
        <h1>Livros</h1>
        <p>Explore, organize e descubra novas histórias.</p>
      </div>
      <button className="new-book-button" type="button">
        <Icon name="plus" size={17} />
        Novo livro
      </button>
    </header>
  )
}
