import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import DashboardPage from './pages/DashboardPage'
import SchemeDetailPage from './pages/SchemeDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import SavedSchemesPage from './pages/SavedSchemesPage'
import FeedbackPage from './pages/FeedbackPage'
import Chatbot from './components/Chatbot'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scheme/:id" element={<SchemeDetailPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/saved" element={<SavedSchemesPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
          <Chatbot />
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
