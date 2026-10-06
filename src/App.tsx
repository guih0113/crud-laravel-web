import { BookTable } from './components/BookTable'
import { LibraryHeader } from './components/LibraryHeader'
import { LibraryToolbar } from './components/LibraryToolbar'

export function App() {
  return (
    <main className="app-shell">
      <div className="library-page">
        <LibraryHeader />
        <LibraryToolbar />
        <BookTable />
      </div>
    </main>
  )
}
