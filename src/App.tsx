import { useEffect } from 'react'
import { useThemeStore } from './store/useThemeStore'
import LZString from 'lz-string'
import { ControlCenter } from './components/ControlCenter'
import { PreviewDashboard } from './components/PreviewDashboard'

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
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Left Pane: Control Center */}
      <div className="w-[400px] flex-shrink-0 border-r bg-muted/20 overflow-y-auto">
        <ControlCenter />
      </div>

      {/* Right Pane: Live Preview Dashboard */}
      <div className="flex-1 bg-muted/10 overflow-hidden relative">
        <PreviewDashboard />
      </div>
    </div>
  )
}

export default App
