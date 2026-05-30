export type Page = 'home' | 'about'

type NavItem = {
  label: string
  page: Page
}

type HeaderProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: NavItem[] = [
  { label: 'About', page: 'about' },
  { label: 'How it works', page: 'home' },
  { label: 'Demo', page: 'home' },
]

function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <button
        className="brand"
        type="button"
        onClick={() => onNavigate('home')}
        aria-label="Pikmin home"
      >
        <span className="brand-mark" />
        Pikmin
      </button>

      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            className={currentPage === item.page && item.page === 'about' ? 'active' : undefined}
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.page)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

export default Header
