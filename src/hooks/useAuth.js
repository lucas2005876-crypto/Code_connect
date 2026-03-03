import { useState, useEffect } from 'react'
import { http } from '../api'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error)
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const register = async (name, email, password) => {
    try {

      await http.post(`auth/register`, {}, {
          name: name,
          email: email,
          password: password
        
      })

      return { success: true}
    } 
    catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {

      const respostaApi = await http.post(`auth/login`, {
          email: email,
          password: password
      })
      const data = respostaApi.data

      setUser(data.user)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      localStorage.setItem('access_token', data.access_token)

      
      return { success: true, user: data.user }
    } 
    catch (error) {
      return { success: false, error: error.message }
    }
      
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout
  }
} 