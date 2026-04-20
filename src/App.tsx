import { ControlCenter } from './components/ControlCenter'
import { PreviewDashboard } from './components/PreviewDashboard'

function App() {
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
