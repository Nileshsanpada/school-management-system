import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'

function AppContent() {
  const { isAuthenticated } = useAuthContext()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  if (isAuthPage || !isAuthenticated) {
    return <AppRoutes />
  }

  return (
    <div className="app-container">
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="page-wrapper">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />
        <main className="content-container">
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}