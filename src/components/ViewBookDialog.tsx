import type { Book } from '../types/book'
import { Icon } from './Icon'
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

type ViewBookDialogProps = {
  book: Book
}

export function ViewBookDialog({ book }: ViewBookDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="view-action" aria-label={`Visualizar ${book.title}`}>
        <Icon name="eye" size={17} />
      </DialogTrigger>
      <DialogContent className="view-dialog">
        <DialogHeader className="view-dialog-header">
          <DialogTitle>Detalhes do livro</DialogTitle>
          <DialogDescription>Confira as informações cadastradas na biblioteca.</DialogDescription>
        </DialogHeader>
        <div className="view-book-summary">
          <div className={`view-book-cover ${book.coverClass}`}>
            {book.coverLabel.split('\n').map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div className="view-book-content">
            <h3>{book.title}</h3>
            <dl className="view-book-details">
              <div>
                <dt>Autor</dt>
                <dd>{book.author}</dd>
              </div>
              <div>
                <dt>Gênero</dt>
                <dd>{book.genre}</dd>
              </div>
              <div>
                <dt>Páginas</dt>
                <dd>{book.pages}</dd>
              </div>
              <div>
                <dt>Avaliação</dt>
                <dd>
                  <span className="view-book-rating" aria-label={`${book.rating} de 10`}>
                    ★★★★★
                  </span>{' '}
                  {book.rating.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt>Data de lançamento</dt>
                <dd>{book.releaseDate}</dd>
              </div>
            </dl>
          </div>
        </div>
        <DialogFooter className="view-dialog-footer">
          <DialogClose
            render={
              <button className="view-dialog-close" type="button">
                Voltar para a lista
              </button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
