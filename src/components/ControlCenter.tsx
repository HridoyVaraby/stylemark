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

const GOOGLE_FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display']

export function ControlCenter() {
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
        lightColors: { ...store.lightColors, primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', success: '#2e8b57', warning: '#d2691e', destructive: '#8b0000' },
        darkColors: { ...store.darkColors, primary: '#d4af37', secondary: '#1f1f1f', accent: '#a67c00', background: '#0a0a0a', foreground: '#f5f5f5', success: '#2e8b57', warning: '#d2691e', destructive: '#8b0000' },
        typography: { headingFont: 'Playfair Display', bodyFont: 'Lato', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '0rem', borderThickness: 1 },
        effects: { shadowDepth: 'flat' as const, transitionEasing: 'ease-in-out' as const }
      },
      saas: {
        meta: { baseTheme: 'light' as const, projectName: store.meta.projectName },
        lightColors: { ...store.lightColors, primary: '#2563eb', secondary: '#f1f5f9', accent: '#3b82f6', background: '#ffffff', foreground: '#0f172a', success: '#10b981', warning: '#f59e0b', destructive: '#ef4444' },
        darkColors: { ...store.darkColors, primary: '#3b82f6', secondary: '#1e293b', accent: '#2563eb', background: '#020817', foreground: '#f8fafc', success: '#10b981', warning: '#f59e0b', destructive: '#ef4444' },
        typography: { headingFont: 'Inter', bodyFont: 'Inter', baseSize: 1, letterSpacing: 0, lineHeight: 1.5 },
        geometry: { radius: '0.375rem', borderThickness: 1 },
        effects: { shadowDepth: 'elevated' as const, transitionEasing: 'ease-out' as const }
      },
      playful: {
        meta: { baseTheme: 'light' as const, projectName: store.meta.projectName },
        lightColors: { ...store.lightColors, primary: '#ec4899', secondary: '#fdf2f8', accent: '#8b5cf6', background: '#ffffff', foreground: '#111827', success: '#10b981', warning: '#f59e0b', destructive: '#ef4444' },
        darkColors: { ...store.darkColors, primary: '#f472b6', secondary: '#4c1d95', accent: '#a78bfa', background: '#030712', foreground: '#f9fafb', success: '#10b981', warning: '#f59e0b', destructive: '#ef4444' },
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
    </div>
  )
}
