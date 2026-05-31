export type Page = 'home' | 'fallacies' | 'detector' | 'about'

type NavItem = {
  label: string
  page: Page
}

type HeaderProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: NavItem[] = [
  { label: 'How it works', page: 'fallacies' },
  { label: 'Demo', page: 'detector' },
  { label: 'About', page: 'about' },
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
            aria-current={currentPage === item.page ? 'page' : undefined}
            className={currentPage === item.page ? 'active' : undefined}
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
