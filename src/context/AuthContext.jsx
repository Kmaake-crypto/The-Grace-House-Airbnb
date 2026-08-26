import { useState } from 'react'
import { usersApi } from '../services/api.js'
import { AuthContext } from './auth.js'

const STORAGE_KEY = 'airbnb-auth'

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

function sessionFromResponse(response) {
  const payload = response?.data ?? response
  return {
    user: payload?.user ?? payload?.account ?? null,
    token: payload?.token ?? payload?.accessToken ?? null,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  function saveSession(response) {
    const nextSession = sessionFromResponse(response)
    setSession(nextSession)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
    return nextSession
  }

  async function login(credentials) {
    return saveSession(await usersApi.login(credentials))
  }

  async function register(details) {
    const response = await usersApi.register(details)
    const nextSession = sessionFromResponse(response)
    if (nextSession.token) return saveSession(response)
    return login({ email: details.email, password: details.password })
  }

  function logout() {
    setSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user: session?.user,
    token: session?.token,
    isAuthenticated: Boolean(session?.token),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}