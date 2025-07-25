import { createContext, useState, ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb, { PocketBaseError } from "@/utils/backend/pb"
import { Imobiliaria } from "@/types/Imobiliarias"

interface AuthImobiliariaContextProps {
  isAuthenticated: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (data: RegisterData) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  logout: () => void
}

export const AuthImobiliariaContext =
  createContext<AuthImobiliariaContextProps | null>(null)

interface AuthImobiliariaProviderProps {
  children: ReactNode
}

type RegisterData = Omit<Imobiliaria, "id"> & {
  passwordConfirm: string
}

export const AuthImobiliariaProvider = ({
  children,
}: AuthImobiliariaProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await pb.collection("imobiliarias").authWithPassword(email, password)
      setIsAuthenticated(true)
      navigate("/imobiliaria/formulario")
    } catch (err) {
      pb.handleError(err as PocketBaseError)
      throw err
    }
  }

  const registerWithEmail = async (data: RegisterData) => {
    try {
      const { passwordConfirm, ...rest } = data
      await pb.collection("imobiliarias").create({
        ...rest,
        emailVisibility: true,
        passwordConfirm,
      })

      // foi comentado o login automático após o cadastro, já que não é mais necessário o login com redirecionamento para entrar como "imobiliária"

      // await loginWithEmail(rest.email, rest.password)
      navigate("/painel-adm-imobiliarias")
    } catch (err) {
      pb.handleError(err as PocketBaseError)
      throw err
    }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await pb.collection("imobiliarias").requestPasswordReset(email)
      alert(
        "Instruções para redefinir a senha foram enviadas para o email informado."
      )
    } catch (err) {
      pb.handleError(err as PocketBaseError)
      throw err
    }
  }

  const logout = () => {
    pb.logout()
    setIsAuthenticated(false)
    navigate("/imobiliaria/entrar")
  }

  return (
    <AuthImobiliariaContext.Provider
      value={{
        isAuthenticated,
        loginWithEmail,
        registerWithEmail,
        requestPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthImobiliariaContext.Provider>
  )
}
