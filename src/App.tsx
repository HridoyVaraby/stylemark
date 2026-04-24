import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'
import LZString from 'lz-string'
import { ControlCenter } from './components/ControlCenter'
import { PreviewDashboard } from './components/PreviewDashboard'
import { Button } from './components/ui/button'

function App() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const themeParam = params.get('theme')

    if (themeParam) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(themeParam)
        if (decompressed) {
          const state = JSON.parse(decompressed)
          useThemeStore.getState().loadState(state)
        }
      } catch (e) {
        console.error('Failed to parse theme from URL', e)
      }

      // Clean up the URL
      const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname
      window.history.replaceState({ path: newUrl }, '', newUrl)
    }
  }, [])
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Top Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0 z-10 relative text-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="m12 15 3-5 2 3-5 5Z"/></svg>
            StyleMark
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z"></path></svg>
            Export to Figma
          </Button>
          <div className="flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button variant="destructive" size="sm">Sign Up</Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
      {/* Left Pane: Control Center */}
      <div className="w-[400px] flex-shrink-0 border-r bg-muted/20 overflow-y-auto">
        <ControlCenter />
      </div>

      {/* Right Pane: Live Preview Dashboard */}
      <div className="flex-1 bg-muted/10 overflow-hidden relative">
        <PreviewDashboard />
      </div>
      </div>
    </div>
  )
}

export default App
