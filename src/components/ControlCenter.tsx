import { useState } from "react"
import LZString from 'lz-string'
import { QRCodeSVG } from 'qrcode.react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useStore } from 'zustand'
import { useThemeStore } from '@/store/useThemeStore'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { generateMarkdown } from '@/utils/generateMarkdown'
import { generateCss } from '@/utils/generateCss'
import { generateTailwindConfig } from '@/utils/generateTailwindConfig'
import { Download, Upload, Share2, Copy, Check, Undo, Redo } from 'lucide-react'

const GOOGLE_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display']

export const VIBE_PRESETS = {
  luxury: {
    meta: { baseTheme: 'dark' as const },
    lightColors: { primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', destructive: '#8b0000' },
    darkColors: { primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', destructive: '#8b0000' },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Lato', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
    geometry: { radius: '0rem', borderThickness: 1 },
    effects: { shadowDepth: 'flat' as const, transitionEasing: 'ease-in-out' as const }
  },
  saas: {
    meta: { baseTheme: 'light' as const },
    lightColors: { primary: '#2563eb', secondary: '#f1f5f9', accent: '#3b82f6', background: '#ffffff', foreground: '#0f172a', destructive: '#ef4444' },
    darkColors: { primary: '#3b82f6', secondary: '#1e293b', accent: '#2563eb', background: '#020817', foreground: '#f8fafc', destructive: '#ef4444' },
    typography: { headingFont: 'Inter', bodyFont: 'Inter', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
    geometry: { radius: '0.375rem', borderThickness: 1 },
    effects: { shadowDepth: 'elevated' as const, transitionEasing: 'ease-out' as const }
  },
  playful: {
    meta: { baseTheme: 'light' as const },
    lightColors: { primary: '#ec4899', secondary: '#fdf2f8', accent: '#8b5cf6', background: '#ffffff', foreground: '#111827', destructive: '#ef4444' },
    darkColors: { primary: '#f472b6', secondary: '#4c1d95', accent: '#a78bfa', background: '#030712', foreground: '#f9fafb', destructive: '#ef4444' },
    typography: { headingFont: 'Poppins', bodyFont: 'Poppins', baseSize: 1.125, letterSpacing: 0, lineHeight: 1.5 },
    geometry: { radius: '9999px', borderThickness: 2 },
    effects: { shadowDepth: 'floating' as const, transitionEasing: 'spring' as const }
  }
}

export function ControlCenter() {

  const pastStates = useStore(useThemeStore.temporal, (state) => state.pastStates)
  const futureStates = useStore(useThemeStore.temporal, (state) => state.futureStates)
  const undo = () => useThemeStore.temporal.getState().undo()
  const redo = () => useThemeStore.temporal.getState().redo()

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const stateToShare = {
      meta: store.meta,
      lightColors: store.lightColors,
      darkColors: store.darkColors,
      typography: store.typography,
      geometry: store.geometry,
      effects: store.effects
    }
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(stateToShare))
    const url = new URL(window.location.href)
    url.searchParams.set('theme', compressed)

    setShareUrl(url.toString())
    setIsShareDialogOpen(true)
    setCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const store = useThemeStore()

  const downloadBlob = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJson = () => {
    const state = useThemeStore.getState()
    const data = { ...state } as Record<string, unknown>
    delete data.setMeta
    delete data.setLightColors
    delete data.setDarkColors
    delete data.setTypography
    delete data.setGeometry
    delete data.setEffects
    delete data.applyPreset
    delete data.loadState
    downloadBlob(JSON.stringify(data, null, 2), `${store.meta.projectName || 'stylemark'}-session.json`, 'application/json')
  }

  const handleExportMarkdown = () => downloadBlob(generateMarkdown(useThemeStore.getState()), `${store.meta.projectName || 'stylemark'}-StyleMark.md`, 'text/markdown')

  const handleExportCss = () => downloadBlob(generateCss(useThemeStore.getState()), 'globals.css', 'text/css')

  const handleExportTailwindConfig = () => downloadBlob(generateTailwindConfig(useThemeStore.getState()), 'tailwind.config.js', 'application/javascript')
  const applyVibe = (vibe: 'luxury' | 'saas' | 'playful') => {
    const presets = {
      luxury: {
        meta: { baseTheme: 'dark' as const, projectName: store.meta.projectName },
        lightColors: { ...store.lightColors, primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', destructive: '#8b0000' },
        darkColors: { ...store.darkColors, primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', destructive: '#8b0000' },
        typography: { headingFont: 'Playfair Display', bodyFont: 'Lato', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '0rem', borderThickness: 1 },
        effects: { shadowDepth: 'flat' as const, transitionEasing: 'ease-in-out' as const }
      },
      saas: {
        meta: { baseTheme: 'light' as const, projectName: store.meta.projectName },
        lightColors: { ...store.lightColors, primary: '#2563eb', secondary: '#f1f5f9', accent: '#3b82f6', background: '#ffffff', foreground: '#0f172a', destructive: '#ef4444' },
        darkColors: { ...store.darkColors, primary: '#3b82f6', secondary: '#1e293b', accent: '#2563eb', background: '#020817', foreground: '#f8fafc', destructive: '#ef4444' },
        typography: { headingFont: 'Inter', bodyFont: 'Inter', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '0.375rem', borderThickness: 1 },
        effects: { shadowDepth: 'elevated' as const, transitionEasing: 'ease-out' as const }
      },
      playful: {
        meta: { baseTheme: 'light' as const, projectName: store.meta.projectName },
        lightColors: { ...store.lightColors, primary: '#ec4899', secondary: '#fdf2f8', accent: '#8b5cf6', background: '#ffffff', foreground: '#111827', destructive: '#ef4444' },
        darkColors: { ...store.darkColors, primary: '#f472b6', secondary: '#4c1d95', accent: '#a78bfa', background: '#030712', foreground: '#f9fafb', destructive: '#ef4444' },
        typography: { headingFont: 'Poppins', bodyFont: 'Poppins', baseSize: 1.125, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '9999px', borderThickness: 2 },
        effects: { shadowDepth: 'floating' as const, transitionEasing: 'spring' as const }
      }
    }
    store.applyPreset(presets[vibe])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold tracking-tight mb-1">StyleMark</h1>
        <p className="text-sm text-muted-foreground">Design System Configurator</p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={undo} disabled={pastStates.length === 0}>
            <Undo className="w-4 h-4 mr-2" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={futureStates.length === 0}>
            <Redo className="w-4 h-4 mr-2" /> Redo
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Top bar with preset selector */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1 border rounded p-1">
            <div className="w-4 h-4 bg-[#8b0000] rounded-sm"></div>
            <div className="w-4 h-4 bg-[#d4af37] rounded-sm"></div>
            <div className="w-4 h-4 bg-[#f5f5f5] rounded-sm"></div>
          </div>
          <Select value="luxury" onValueChange={(v) => applyVibe(v as "luxury" | "saas" | "playful")}>
            <SelectTrigger className="w-[180px] border-none bg-transparent shadow-none font-semibold">
              <SelectValue placeholder="Elegant Luxury" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="luxury">Elegant Luxury</SelectItem>
              <SelectItem value="saas">Minimalist SaaS</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 space-x-6">
            <TabsTrigger value="colors" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">Typography</TabsTrigger>
            <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">Other</TabsTrigger>
            <div className="flex-1"></div>
            <Button variant="ghost" size="sm" className="gap-2 h-8">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Generate
            </Button>
          </TabsList>

          <TabsContent value="colors" className="space-y-6 pt-6">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <Input placeholder="Search colors..." className="pl-9 bg-background" />
            </div>

            <Accordion type="multiple" defaultValue={['primary', 'secondary']} className="w-full">
              <AccordionItem value="primary" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline text-xs font-semibold text-muted-foreground">PRIMARY</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  <div className="flex items-center gap-4 bg-background p-2 rounded-md border">
                    <input type="color" className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" value={store.meta.baseTheme === 'dark' ? store.darkColors.background : store.lightColors.background} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ background: e.target.value }) : store.setLightColors({ background: e.target.value })} />
                    <Label className="w-20">Background</Label>
                    <Input value={store.meta.baseTheme === 'dark' ? store.darkColors.background : store.lightColors.background} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ background: e.target.value }) : store.setLightColors({ background: e.target.value })} className="h-8 flex-1 font-mono text-xs border-none bg-muted/50" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></Button>
                  </div>
                  <div className="flex items-center gap-4 bg-background p-2 rounded-md border">
                    <input type="color" className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" value={store.meta.baseTheme === 'dark' ? store.darkColors.foreground : store.lightColors.foreground} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ foreground: e.target.value }) : store.setLightColors({ foreground: e.target.value })} />
                    <Label className="w-20">Foreground</Label>
                    <Input value={store.meta.baseTheme === 'dark' ? store.darkColors.foreground : store.lightColors.foreground} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ foreground: e.target.value }) : store.setLightColors({ foreground: e.target.value })} className="h-8 flex-1 font-mono text-xs border-none bg-muted/50" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="secondary" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline text-xs font-semibold text-muted-foreground">SECONDARY</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  <div className="flex items-center gap-4 bg-background p-2 rounded-md border">
                    <input type="color" className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" value={store.meta.baseTheme === 'dark' ? store.darkColors.secondary : store.lightColors.secondary} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ secondary: e.target.value }) : store.setLightColors({ secondary: e.target.value })} />
                    <Label className="w-20">Background</Label>
                    <Input value={store.meta.baseTheme === 'dark' ? store.darkColors.secondary : store.lightColors.secondary} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ secondary: e.target.value }) : store.setLightColors({ secondary: e.target.value })} className="h-8 flex-1 font-mono text-xs border-none bg-muted/50" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></Button>
                  </div>
                  <div className="flex items-center gap-4 bg-background p-2 rounded-md border">
                    <input type="color" className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" value={store.meta.baseTheme === 'dark' ? store.darkColors.secondaryForeground : store.lightColors.secondaryForeground} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ secondaryForeground: e.target.value }) : store.setLightColors({ secondaryForeground: e.target.value })} />
                    <Label className="w-20">Foreground</Label>
                    <Input value={store.meta.baseTheme === 'dark' ? store.darkColors.secondaryForeground : store.lightColors.secondaryForeground} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ secondaryForeground: e.target.value }) : store.setLightColors({ secondaryForeground: e.target.value })} className="h-8 flex-1 font-mono text-xs border-none bg-muted/50" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {['ACCENT', 'BASE', 'CARD', 'POPOVER', 'MUTED', 'DESTRUCTIVE', 'BORDER & INPUT', 'CHART', 'SIDEBAR'].map(item => (
                <AccordionItem key={item} value={item.toLowerCase()} className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>{item}</span>
                  </AccordionTrigger>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6 pt-6">
            <div className="space-y-4">
              <h2 className="font-semibold">Typography</h2>
              <div className="space-y-2">
                <Label>Heading Font</Label>
                <Select value={store.typography.headingFont} onValueChange={(v) => store.setTypography({ headingFont: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GOOGLE_FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select value={store.typography.bodyFont} onValueChange={(v) => store.setTypography({ bodyFont: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GOOGLE_FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-6 pt-6">
            {/* Global Settings */}
            <section className="space-y-4">
              <h2 className="font-semibold">Global Settings</h2>
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={store.meta.projectName} onChange={(e) => store.setMeta({ projectName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Base Theme</Label>
                <Select value={store.meta.baseTheme} onValueChange={(v: 'light' | 'dark' | 'system') => store.setMeta({ baseTheme: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Geometry & Effects */}
            <section className="space-y-4">
              <h2 className="font-semibold">Geometry & Effects</h2>
              <div className="space-y-2">
                <Label>Border Radius</Label>
                <Select value={store.geometry.radius} onValueChange={(v) => store.setGeometry({ radius: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0rem">None (0)</SelectItem>
                    <SelectItem value="0.125rem">Small (sm)</SelectItem>
                    <SelectItem value="0.375rem">Medium (md)</SelectItem>
                    <SelectItem value="0.5rem">Large (lg)</SelectItem>
                    <SelectItem value="0.75rem">Extra Large (xl)</SelectItem>
                    <SelectItem value="9999px">Full (Pill)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between">
                  <Label>Border Thickness ({store.geometry.borderThickness}px)</Label>
                </div>
                <Slider
                  value={[store.geometry.borderThickness]}
                  min={0} max={4} step={1}
                  onValueChange={([v]) => store.setGeometry({ borderThickness: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Shadow Depth</Label>
                <Select value={store.effects.shadowDepth} onValueChange={(v: 'flat' | 'elevated' | 'floating') => store.setEffects({ shadowDepth: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="elevated">Elevated</SelectItem>
                    <SelectItem value="floating">Floating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-6 border-t bg-background space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" className="w-full" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button variant="outline" className="w-full" onClick={handleExportJson}>
            <Download className="w-4 h-4 mr-2" /> Session
          </Button>
          {/* Implement file upload via hidden input */}
          <Button variant="outline" className="w-full" onClick={() => document.getElementById('import-json')?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <input
            id="import-json"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  try {
                    const data = JSON.parse(e.target?.result as string)
                    store.loadState(data)
                  } catch (err) {
                    console.error('Failed to parse JSON', err)
                  }
                }
                reader.readAsText(file)
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleExportCss}>
            CSS
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleExportTailwindConfig}>
            Tailwind
          </Button>
          <Button className="flex-1" onClick={handleExportMarkdown}>
            Markdown
          </Button>
        </div>
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Theme</DialogTitle>
            <DialogDescription>
              Anyone with this link will see your exact theme configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            <div className="flex w-full items-center space-x-2">
              <Input
                readOnly
                value={shareUrl}
                className="flex-1"
              />
              <Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}