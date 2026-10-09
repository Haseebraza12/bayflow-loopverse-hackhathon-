import Link from 'next/link'

/** Customer-portal footer (spec 10 P-01 §5): Find a shop · Register your shop · Staff log in. */
export function PublicFooter() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© BayFlow — auto repair, without the phone calls.</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/#shops" className="hover:text-foreground hover:underline">
                Find a shop
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground hover:underline">
                Register your shop
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground hover:underline">
                Staff log in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
