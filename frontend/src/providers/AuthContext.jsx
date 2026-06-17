import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        user: {}
    })
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:8080/auth/check", {
                    method: "GET",
                    credentials: 'include'
                })

                const data = await response.json();
                console.log(data)

                if (data.isLoggedIn) {
                    setAuth(data)
                } else {
                    navigate('/login')
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        checkAuth()
    }, [])

    if (loading) return null;

    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);