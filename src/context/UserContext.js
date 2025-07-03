"use client"

import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const clearUser = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    saveUser,
    clearUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
