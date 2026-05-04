type BackdropPanel = {
  className: string
  label: string
  lines: string[]
}

const PANELS: BackdropPanel[] = [
  {
    className: 'is-route-map',
    label: 'routes.ts',
    lines: [
      'const routes = [',
      "  { path: '/', view: 'home' },",
      "  { path: '/projects', view: 'work' },",
      "  { path: '/blog', view: 'notes' },",
      ']',
    ],
  },
  {
    className: 'is-terminal',
    label: 'terminal',
    lines: [
      '$ git status',
      'On branch main',
      'Changes staged for commit',
      '$ pnpm ship --carefully',
    ],
  },
  {
    className: 'is-schema',
    label: 'system.ts',
    lines: [
      'type BuildValues = {',
      "  clarity: 'high'",
      "  reliability: 'steady'",
      "  product: 'intentional'",
      '}',
    ],
  },
  {
    className: 'is-commit',
    label: 'commit.md',
    lines: [
      'feat(ui): sharpen narrative',
      'fix(layout): reduce noise',
      'chore(dx): keep systems calm',
    ],
  },
]

export function MinimalEngineeringBackdrop() {
  return (
    <div aria-hidden="true" className="minimal-engineering-backdrop">
      <div className="minimal-engineering-grid" />
      <div className="minimal-engineering-orbit is-left" />
      <div className="minimal-engineering-orbit is-right" />
      {PANELS.map((panel) => (
        <div className={`minimal-engineering-panel ${panel.className}`} key={panel.label}>
          <div className="minimal-engineering-panel__bar">
            <span />
            <span />
            <span />
            <strong>{panel.label}</strong>
          </div>
          <pre className="minimal-engineering-panel__code">
            {panel.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </pre>
        </div>
      ))}
    </div>
  )
}
