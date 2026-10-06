import { Icon } from './Icon'

export function LibraryToolbar() {
  return (
    <div className="toolbar">
      <label className="search-field">
        <Icon name="search" size={18} />
        <input
          type="search"
          placeholder="Buscar por título ou autor..."
          aria-label="Buscar por título ou autor"
        />
        <Icon name="search" size={16} />
      </label>
      <button className="select-field" type="button">
        <span>Todos os gêneros</span>
        <Icon name="chevron-down" size={16} />
      </button>
      <button className="select-field sort-field" type="button">
        <span>Ordenar por</span>
        <Icon name="sliders" size={15} />
      </button>
      <strong className="book-count">6 livros cadastrados</strong>
    </div>
  )
}
