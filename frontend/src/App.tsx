import { useAuthStore } from './stores/auth-store'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <CustomersPage />
        </DashboardLayout>
      </ProtectedRoute>
    )
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App