import { Icon } from './Icon'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Paginação">
      <button type="button" aria-label="Página anterior" disabled={disabled || currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <Icon name="chevron-left" size={17} />
      </button>
      {pages.map((page) => <button className={page === currentPage ? 'active-page' : ''} key={page} type="button" aria-current={page === currentPage ? 'page' : undefined} disabled={disabled} onClick={() => onPageChange(page)}>{page}</button>)}
      <button type="button" aria-label="Próxima página" disabled={disabled || currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <Icon name="chevron-right" size={17} />
      </button>
    </nav>
  )
}
