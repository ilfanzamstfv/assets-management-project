import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/global.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import ForgotPassword from './pages/auth/ForgotPassword'
import CodeVerification from './pages/auth/CodeVerification'
import ResetPassword from './pages/auth/ResetPassword'
import DashboardPage from './pages/dashboard/DashboardPage'
import ItemsPage from './pages/itemsPage/ItemsPage'
import StockPage from './pages/stockPage/StockPage'
import PurchasesPage from './pages/purchasePage/PurchasesPage'
import UsersPage from './pages/usersPage/UsersPage'
import MasterDataPage from './pages/masterDataPage/MasterDataPage'
import AuthCallback from './pages/auth/AuthCallback.jsx'
import { GooeyToaster } from './components/ui/goey-toaster'
import ProtectedRoute from './components/ProtectedRoute'
import { AssetProvider } from './context/AssetContext'
import AssetLayout from './components/asset/AssetLayout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GooeyToaster position="top-right" theme="dark" showProgress closeButton="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/code-verification" element={<CodeVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <AssetProvider>
                <AssetLayout />
              </AssetProvider>
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/home/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="purchases" element={<PurchasesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="master-data/categories" element={<MasterDataPage type="category" />} />
            <Route path="master-data/locations" element={<MasterDataPage type="location" />} />
            <Route path="master-data/suppliers" element={<MasterDataPage type="supplier" />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
