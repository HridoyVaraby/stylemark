import { useState } from "react"
import LZString from 'lz-string'
import { QRCodeSVG } from 'qrcode.react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useStore } from 'zustand'
import { useThemeStore } from '@/store/useThemeStore'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { generateMarkdown } from '@/utils/generateMarkdown'
import { generateCss } from '@/utils/generateCss'
import { generateTailwindConfig } from '@/utils/generateTailwindConfig'
import { Download, Upload } from 'lucide-react'
import { getVibePreset, type VibeType } from '@/utils/vibePresets'

const GOOGLE_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display']

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
    const {
      setMeta: _setMeta,
      setLightColors: _setLightColors,
      setDarkColors: _setDarkColors,
      setTypography: _setTypography,
      setGeometry: _setGeometry,
      setEffects: _setEffects,
      applyPreset: _applyPreset,
      loadState: _loadState,
      ...data
    } = state
    downloadBlob(JSON.stringify(data, null, 2), `${store.meta.projectName || 'stylemark'}-session.json`, 'application/json')
  }

  const handleExportMarkdown = () => downloadBlob(generateMarkdown(useThemeStore.getState()), `${store.meta.projectName || 'stylemark'}-StyleMark.md`, 'text/markdown')

  const handleExportCss = () => downloadBlob(generateCss(useThemeStore.getState()), 'globals.css', 'text/css')

  const handleExportTailwindConfig = () => downloadBlob(generateTailwindConfig(useThemeStore.getState()), 'tailwind.config.js', 'application/javascript')
  const applyVibe = (vibe: VibeType) => {
    store.applyPreset(getVibePreset(vibe, store.meta.projectName, store.lightColors, store.darkColors))
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

        {/* Vibe Presets */}
        <section className="space-y-4">
          <h2 className="font-semibold">Vibe Presets</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => applyVibe('luxury')}>Elegant Luxury</Button>
            <Button variant="outline" onClick={() => applyVibe('saas')}>Minimalist SaaS</Button>
            <Button variant="outline" className="col-span-2" onClick={() => applyVibe('playful')}>Playful</Button>
          </div>
        </section>

        {/* Color System */}
        <section className="space-y-4">
          <h2 className="font-semibold">Color System</h2>
          {Object.entries(store.meta.baseTheme === 'dark' ? store.darkColors : store.lightColors).map(([key, val]) => {
            if (key.endsWith('Foreground')) return null;
            return (
            <div key={key} className="flex items-center gap-4">
              <input
                type="color"
                className="w-10 h-10 p-0 border-0 rounded cursor-pointer shrink-0"
                value={val as string}
                onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ [key]: e.target.value }) : store.setLightColors({ [key]: e.target.value })}
              />
              <div className="flex-1">
                <Label className="capitalize">{key}</Label>
                <Input value={val as string} onChange={(e) => store.meta.baseTheme === 'dark' ? store.setDarkColors({ [key]: e.target.value }) : store.setLightColors({ [key]: e.target.value })} className="font-mono text-sm mt-1" />
              </div>
            </div>
            )
          })}
        </section>

        {/* Typography */}
        <section className="space-y-4">
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
          <div className="space-y-4 pt-2">
            <div className="flex justify-between">
              <Label>Base Size ({store.typography.baseSize}rem)</Label>
            </div>
            <Slider
              value={[store.typography.baseSize]}
              min={0.75} max={1.5} step={0.0625}
              onValueChange={([v]) => store.setTypography({ baseSize: v })}
            />
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between">
              <Label>Letter Spacing ({store.typography.letterSpacing}em)</Label>
            </div>
            <Slider
              value={[store.typography.letterSpacing]}
              min={-0.1} max={0.2} step={0.01}
              onValueChange={([v]) => store.setTypography({ letterSpacing: v })}
            />
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between">
              <Label>Line Height ({store.typography.lineHeight})</Label>
            </div>
            <Slider
              value={[store.typography.lineHeight]}
              min={1} max={2} step={0.05}
              onValueChange={([v]) => store.setTypography({ lineHeight: v })}
            />
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