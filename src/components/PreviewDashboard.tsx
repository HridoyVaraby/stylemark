import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { cn } from '@/lib/utils'
import { hexToHsl } from '@/utils/color'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Laptop, Smartphone, Tablet, Moon, Sun } from 'lucide-react'

export function PreviewDashboard() {
  const store = useThemeStore()
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isDark, setIsDark] = useState(false)

  // Sync isDark with baseTheme initially
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(store.meta.baseTheme === 'dark')
  }, [store.meta.baseTheme])

  // Inject CSS Variables
  const activeColors = isDark ? store.darkColors : store.lightColors;
  const styleVariables = {
    '--background': hexToHsl(activeColors.background),
    '--foreground': hexToHsl(activeColors.foreground),
    '--card': hexToHsl(activeColors.card),
    '--card-foreground': hexToHsl(activeColors.cardForeground),
    '--popover': hexToHsl(activeColors.popover),
    '--popover-foreground': hexToHsl(activeColors.popoverForeground),
    '--primary': hexToHsl(activeColors.primary),
    '--primary-foreground': hexToHsl(activeColors.primaryForeground),
    '--secondary': hexToHsl(activeColors.secondary),
    '--secondary-foreground': hexToHsl(activeColors.secondaryForeground),
    '--muted': hexToHsl(activeColors.muted),
    '--muted-foreground': hexToHsl(activeColors.mutedForeground),
    '--accent': hexToHsl(activeColors.accent),
    '--accent-foreground': hexToHsl(activeColors.accentForeground),
    '--destructive': hexToHsl(activeColors.destructive),
    '--destructive-foreground': hexToHsl(activeColors.destructiveForeground),
    '--border': hexToHsl(activeColors.border),
    '--input': hexToHsl(activeColors.input),
    '--ring': hexToHsl(activeColors.ring),
    '--success': hexToHsl(activeColors.success),
    letterSpacing: `${store.typography.letterSpacing}em`,
    lineHeight: `${store.typography.lineHeight}`,
    '--success-foreground': hexToHsl(activeColors.successForeground),
    '--warning': hexToHsl(activeColors.warning),
    '--warning-foreground': hexToHsl(activeColors.warningForeground),
    '--radius': store.geometry.radius,
    '--font-heading': `"${store.typography.headingFont}", sans-serif`,
    '--font-body': `"${store.typography.bodyFont}", sans-serif`,
    fontSize: `${store.typography.baseSize * 16}px`,
    fontFamily: 'var(--font-body)',
  } as React.CSSProperties

  // Inject Fonts
  useEffect(() => {
    const linkId = 'stylemark-fonts'
    let link = document.getElementById(linkId) as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    const headingUrl = encodeURIComponent(store.typography.headingFont)
    const bodyUrl = encodeURIComponent(store.typography.bodyFont)
    link.href = `https://fonts.googleapis.com/css2?family=${headingUrl}:wght@400;700&family=${bodyUrl}:wght@400;500&display=swap`
  }, [store.typography.headingFont, store.typography.bodyFont])

  const viewportWidths = {
    mobile: 'w-[375px]',
    tablet: 'w-[768px]',
    desktop: 'w-full',
  }

  const handleToggleDark = () => setIsDark(!isDark)

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Top Bar Controls */}
      <div className="h-14 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-4 text-white shrink-0">
        <div className="flex space-x-2 bg-slate-900 rounded-md p-1">
          {([
            { key: 'mobile', icon: Smartphone },
            { key: 'tablet', icon: Tablet },
            { key: 'desktop', icon: Laptop }
          ] as const).map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewport(key as "mobile" | "tablet" | "desktop")}
              className={cn('p-1.5 rounded', viewport === key ? 'bg-slate-700' : 'hover:bg-slate-800')}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <div className="text-sm font-medium">Live Preview</div>
        <Button variant="secondary" size="sm" onClick={handleToggleDark}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div
          className={`${viewportWidths[viewport]} h-full min-h-[600px] border shadow-2xl transition-all duration-300 mx-auto overflow-y-auto bg-background text-foreground ${isDark ? 'dark' : ''}`}
          style={styleVariables}
        >
          {/* Inside the injected scope */}
          <div className="flex h-full" style={{ fontFamily: 'var(--font-body)' }}>
              {/* Left Sidebar inside preview */}
              <div className="w-[240px] border-r bg-background shrink-0 flex flex-col p-4 space-y-6">
                <div className="font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
                  {store.meta.projectName || 'Acme Inc.'}
                </div>

                <div className="space-y-1">
                  <Button variant="destructive" className="w-full justify-start gap-2 bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)] hover:opacity-90">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
                    Quick Create
                  </Button>
                </div>

                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    Lifecycle
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    Analytics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    Projects
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Team
                  </Button>
                </div>

                <div className="pt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">Documents</div>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                      Data Library
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Reports
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Word Assistant
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                      More
                    </Button>
                  </div>
                </div>

                <div className="mt-auto space-y-1 pt-4">
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Get Help
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2 font-normal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    Search
                  </Button>
                  <div className="flex items-center gap-2 pt-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">CN</div>
                    <div className="text-sm">
                      <div className="font-semibold">shadcn</div>
                      <div className="text-xs text-muted-foreground">m@example.com</div>
                    </div>
                    <div className="ml-auto">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[var(--background)]">
                <div className="border-b px-6 py-4 flex items-center justify-between bg-background">
                  <div className="flex space-x-6 text-sm font-medium">
                    <button type="button" className="text-muted-foreground hover:text-foreground">Custom</button>
                    <button type="button" className="text-muted-foreground hover:text-foreground">Cards</button>
                    <button type="button" className="text-[var(--accent)] bg-accent/30 rounded-full px-3 py-1 font-semibold">Dashboard</button>
                    <button type="button" className="text-muted-foreground hover:text-foreground">Mail</button>
                    <button type="button" className="text-muted-foreground hover:text-foreground">Pricing</button>
                    <button type="button" className="text-muted-foreground hover:text-foreground">Color Palette</button>
                    <button type="button" className="text-muted-foreground hover:text-foreground"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <button type="button" className="flex items-center gap-1 font-medium hover:underline">Open in <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></button>
                    <div className="flex items-center space-x-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2-2h3"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6 flex-1">
                  <div className="flex items-center space-x-4 border-b pb-4 mb-6">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M2 15h10"></path><path d="m9 18 3-3-3-3"></path></svg>
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Documents</h2>
                  </div>

                  {/* Dashboard Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="shadow-sm border-muted">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>$1,250.00</p>
                          </div>
                          <div className="flex items-center text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                            +12.5%
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-muted/50">
                          <p className="text-sm font-medium flex items-center">Trending up this month <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></p>
                          <p className="text-sm text-muted-foreground">Visitors for the last 6 months</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-muted">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">New Customers</p>
                            <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>1,234</p>
                          </div>
                          <div className="flex items-center text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                            -20%
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-muted/50">
                          <p className="text-sm font-medium flex items-center">Down 20% this period <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg></p>
                          <p className="text-sm text-muted-foreground">Acquisition needs attention</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-muted">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
                            <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>45,678</p>
                          </div>
                          <div className="flex items-center text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                            +12.5%
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-muted/50">
                          <p className="text-sm font-medium flex items-center">Strong user retention <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></p>
                          <p className="text-sm text-muted-foreground">Engagement exceed targets</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-muted">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                            <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>4.5%</p>
                          </div>
                          <div className="flex items-center text-xs font-medium bg-muted/50 px-2 py-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                            +4.5%
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-muted/50">
                          <p className="text-sm font-medium flex items-center">Steady performance <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></p>
                          <p className="text-sm text-muted-foreground">Meets growth projections</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Chart Area */}
                  <Card className="shadow-sm border-muted mt-6">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Total Visitors</h3>
                          <p className="text-sm text-muted-foreground">Total for the last 3 months</p>
                        </div>
                        <div className="flex border rounded-md overflow-hidden text-sm">
                          <button className="px-3 py-1 bg-background hover:bg-muted/50">Last 3 months</button>
                          <button className="px-3 py-1 bg-accent/30 font-medium border-x text-[var(--destructive)]">Last 30 days</button>
                          <button className="px-3 py-1 bg-background hover:bg-muted/50">Last 7 days</button>
                        </div>
                      </div>

                      <div className="h-[300px] w-full relative mt-4 border-b">
                        {/* SVG Chart placeholder matching image */}
                        <svg viewBox="0 0 800 300" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
                            </linearGradient>
                            <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--destructive)" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="var(--destructive)" stopOpacity="0.01" />
                            </linearGradient>
                          </defs>
                          {/* Smooth curved path matching image closely */}
                          <path d="M0,250 C40,250 50,180 80,180 C110,180 120,260 160,260 C200,260 210,140 240,140 C270,140 280,240 320,240 C360,240 370,120 400,120 C430,120 440,260 480,260 C520,260 530,150 560,150 C590,150 600,230 640,230 C680,230 690,100 720,100 C750,100 770,200 800,200 L800,300 L0,300 Z" fill="url(#chartGradient2)" stroke="none" />
                          <path d="M0,250 C40,250 50,180 80,180 C110,180 120,260 160,260 C200,260 210,140 240,140 C270,140 280,240 320,240 C360,240 370,120 400,120 C430,120 440,260 480,260 C520,260 530,150 560,150 C590,150 600,230 640,230 C680,230 690,100 720,100 C750,100 770,200 800,200" fill="none" stroke="var(--destructive)" strokeWidth="3" />

                          <path d="M0,270 C30,270 40,210 70,210 C100,210 110,280 150,280 C190,280 200,170 230,170 C260,170 270,260 310,260 C350,260 360,150 390,150 C420,150 430,280 470,280 C510,280 520,180 550,180 C580,180 590,250 630,250 C670,250 680,130 710,130 C740,130 760,230 800,230 L800,300 L0,300 Z" fill="url(#chartGradient1)" stroke="none" />
                          <path d="M0,270 C30,270 40,210 70,210 C100,210 110,280 150,280 C190,280 200,170 230,170 C260,170 270,260 310,260 C350,260 360,150 390,150 C420,150 430,280 470,280 C510,280 520,180 550,180 C580,180 590,250 630,250 C670,250 680,130 710,130 C740,130 760,230 800,230" fill="none" stroke="var(--accent)" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="flex justify-between px-8 py-2 text-xs text-muted-foreground mt-2">
                        <span>Jun 2</span>
                        <span>Jun 4</span>
                        <span>Jun 6</span>
                        <span>Jun 8</span>
                        <span>Jun 10</span>
                        <span>Jun 12</span>
                        <span>Jun 15</span>
                        <span>Jun 17</span>
                        <span>Jun 19</span>
                        <span>Jun 21</span>
                        <span>Jun 24</span>
                        <span>Jun 27</span>
                        <span>Jun 30</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
