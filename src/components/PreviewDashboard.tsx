import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import { hexToHsl } from '@/utils/color'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Laptop, Smartphone, Tablet, Moon, Sun, LayoutDashboard, Settings, Users, Activity, CreditCard, Bell, Search } from 'lucide-react'
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
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-8">
        <div
          className={`${viewportWidths[viewport]} h-[800px] rounded-xl border border-slate-700 shadow-2xl transition-all duration-300 mx-auto overflow-hidden bg-background text-foreground flex ${isDark ? 'dark' : ''}`}
          style={styleVariables}
        >
          {/* Mock Sidebar */}
          <div className="w-64 border-r bg-card flex-shrink-0 hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b">
              <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                {store.meta.projectName || 'StyleMark'}
              </div>
            </div>
            <div className="p-4 space-y-2 flex-1">
              <Button variant="secondary" className="w-full justify-start">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Users className="w-4 h-4 mr-2" /> Team
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Activity className="w-4 h-4 mr-2" /> Analytics
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <CreditCard className="w-4 h-4 mr-2" /> Billing
              </Button>
            </div>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Mock Header */}
            <div className="h-16 border-b bg-background flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-64 hidden sm:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 bg-muted/50 border-none" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                  SM
                </div>
              </div>
            </div>

            {/* Inside the injected scope */}
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1" style={{ fontFamily: 'var(--font-body)' }}>
              <Tabs defaultValue="dashboard" className="w-full">
                <div className="flex items-center justify-between mb-8">
                  <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                  </TabsList>
                  <div className="hidden sm:flex gap-2">
                    <Button variant="outline">Export Data</Button>
                    <Button>Create New</Button>
                  </div>
                </div>
              
              <TabsContent value="dashboard" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle style={{ fontFamily: 'var(--font-heading)' }}>Account Settings</CardTitle>
                      <CardDescription>Update your account preferences here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" defaultValue="Jane Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="jane@example.com" />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="notifications" defaultChecked />
                        <Label htmlFor="notifications">Receive marketing emails</Label>
                      </div>
                    </CardContent>
                    <div className="px-6 py-4 border-t bg-muted/50 flex justify-end gap-2 rounded-b-xl">
                      <Button variant="ghost">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </Card>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-lg font-semibold">Status Overview</h3>
                      <div className="grid gap-4">
                        <Alert>
                          <Bell className="h-4 w-4" />
                          <AlertTitle>System Update</AlertTitle>
                          <AlertDescription>
                            A new software version is available for download.
                          </AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                          <AlertTitle>Payment Failed</AlertTitle>
                          <AlertDescription>
                            Please update your billing information to continue your subscription.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 style={{ fontFamily: 'var(--font-heading)' }} className="text-lg font-semibold">Project Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Production</Badge>
                        <Badge variant="secondary">Staging</Badge>
                        <Badge variant="outline">Backend</Badge>
                        <Badge variant="destructive">Deprecated</Badge>
                      </div>
                    </div>
                  </div>
                </div>

              </TabsContent>

              <TabsContent value="components" className="space-y-12 max-w-3xl focus-visible:outline-none focus-visible:ring-0">
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

              <TabsContent value="typography" className="space-y-8 max-w-3xl focus-visible:outline-none focus-visible:ring-0">
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
    </div>
  )
}