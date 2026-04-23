import { useEffect, useState, useMemo } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { hexToHsl } from '@/utils/color'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Laptop, Smartphone, Tablet, Moon, Sun } from 'lucide-react'
import { Badge } from './ui/badge'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Switch } from './ui/switch'
import { Label } from './ui/label'

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
  const styleVariables = useMemo(() => ({
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
  } as React.CSSProperties), [activeColors, store.typography, store.geometry])

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
    const headingUrl = store.typography.headingFont.replace(/ /g, '+')
    const bodyUrl = store.typography.bodyFont.replace(/ /g, '+')
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
          <button onClick={() => setViewport('mobile')} className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
            <Smartphone className="w-4 h-4" />
          </button>
          <button onClick={() => setViewport('tablet')} className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
            <Tablet className="w-4 h-4" />
          </button>
          <button onClick={() => setViewport('desktop')} className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
            <Laptop className="w-4 h-4" />
          </button>
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
          <div className="p-8 space-y-8" style={{ fontFamily: 'var(--font-body)' }}>
            <header className="flex justify-between items-center mb-12">
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', letterSpacing: `${store.typography.letterSpacing}em`, lineHeight: store.typography.lineHeight }} className="text-4xl font-bold">
                  {store.meta.projectName || 'Welcome to StyleMark'}
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                  This is a live preview of your generated design system.
                </p>
              </div>
              <div className="flex gap-2">
                <Button>Primary Action</Button>
                <Button variant="outline">Secondary</Button>
              </div>
            </header>

            <Tabs defaultValue="dashboard">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Revenue</CardTitle>
                      <CardDescription>Monthly target</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$45,231.89</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Subscriptions</CardTitle>
                      <CardDescription>Active users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">+2,350</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Sales</CardTitle>
                      <CardDescription>Quarterly report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">+12,234</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4].map(i => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">User {i}</TableCell>
                            <TableCell>Completed</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell className="text-right">$250.00</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Alerts</h3>
                  <div className="grid gap-4 max-w-md">
                    <Alert>
                      <AlertTitle>Default Alert</AlertTitle>
                      <AlertDescription>
                        This is a standard alert message without special styling.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTitle>Destructive Alert</AlertTitle>
                      <AlertDescription>
                        This indicates a critical error or destructive action warning.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Toggles</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode-components" />
                    <Label htmlFor="airplane-mode-components">Airplane Mode</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="components" className="space-y-8 max-w-2xl">
                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Inputs</h3>
                  <div className="grid gap-4 max-w-sm">
                    <Input placeholder="Default input..." />
                    <Input defaultValue="Filled input" />
                    <Input disabled placeholder="Disabled input" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Alerts</h3>
                  <div className="grid gap-4 max-w-md">
                    <Alert>
                      <AlertTitle>Default Alert</AlertTitle>
                      <AlertDescription>
                        This is a standard alert message without special styling.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTitle>Destructive Alert</AlertTitle>
                      <AlertDescription>
                        This indicates a critical error or destructive action warning.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Toggles</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Airplane Mode</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-8 max-w-3xl">
                <div className="space-y-4">
                  <div className="grid gap-1 border-b pb-4">
                    <h1 style={{ fontFamily: 'var(--font-heading)', letterSpacing: `${store.typography.letterSpacing}em`, lineHeight: store.typography.lineHeight }} className="text-4xl font-extrabold lg:text-5xl">
                      Heading 1: The quick brown fox
                    </h1>
                    <p className="text-sm text-muted-foreground font-mono">4rem / var(--font-heading) / 800</p>
                  </div>

                  <div className="grid gap-1 border-b pb-4">
                    <h2 style={{ fontFamily: 'var(--font-heading)', letterSpacing: `${store.typography.letterSpacing}em`, lineHeight: store.typography.lineHeight }} className="text-3xl font-semibold transition-colors first:mt-0">
                      Heading 2: Jumps over the lazy dog
                    </h2>
                    <p className="text-sm text-muted-foreground font-mono">3rem / var(--font-heading) / 600</p>
                  </div>

                  <div className="grid gap-1 border-b pb-4">
                    <h3 style={{ fontFamily: 'var(--font-heading)', letterSpacing: `${store.typography.letterSpacing}em`, lineHeight: store.typography.lineHeight }} className="text-2xl font-semibold">
                      Heading 3: Pack my box with five dozen liquor jugs
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">2rem / var(--font-heading) / 600</p>
                  </div>

                  <div className="grid gap-1 border-b pb-4">
                    <h4 style={{ fontFamily: 'var(--font-heading)', letterSpacing: `${store.typography.letterSpacing}em`, lineHeight: store.typography.lineHeight }} className="text-xl font-semibold">
                      Heading 4: How vexingly quick daft zebras jump
                    </h4>
                    <p className="text-sm text-muted-foreground font-mono">1.5rem / var(--font-heading) / 600</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Body Text</h3>
                    <p style={{ lineHeight: store.typography.lineHeight }} className="[&:not(:first-child)]:mt-6">
                      The king, seeing how much mother and daughter suffered, resolved to free them from this persecution. He ordered his soldiers to capture the dwarf, but the little man was so quick and cunning that he always managed to escape.
                    </p>
                    <p style={{ lineHeight: store.typography.lineHeight }} className="[&:not(:first-child)]:mt-6">
                      One day, the princess was walking in the garden when the dwarf appeared before her. "I have a proposition for you," he said. "If you can guess my name, I will leave you and your mother in peace. But if you fail, you must marry me."
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-xl font-semibold">Blockquote</h3>
                  <blockquote className="mt-6 border-l-2 pl-6 italic">
                    "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for a good joke."
                  </blockquote>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}