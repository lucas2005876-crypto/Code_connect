import { useState, useEffect } from 'react'

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

      const respostaApi = await fetch(`http://localhost:3000/auth/register`, {
        method: 'POST', 
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      })

      if(!respostaApi.ok){
        throw new Error('Http error: ' + respostaApi.status)
      }

      return { success: true}
    } 
    catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {

      const respostaApi = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST', 
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

    

      if(!respostaApi.ok){
        throw new Error('Http error: ' + respostaApi.status)
      }

      const data = await respostaApi.json()

      setUser(data.user)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      localStorage.setItem('access_token', data.access_token)

      
      return { success: true, user }
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