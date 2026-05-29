import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
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
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
