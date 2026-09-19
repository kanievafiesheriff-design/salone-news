import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem('salone_user'))
		} catch {
			return null
		}
	})

	useEffect(() => {
		if (user) localStorage.setItem('salone_user', JSON.stringify(user))
		else localStorage.removeItem('salone_user')
	}, [user])

	const signIn = useCallback((nextUser, token) => {
		localStorage.setItem('salone_token', token)
		setUser(nextUser)
	}, [])
	const signOut = useCallback(() => {
		localStorage.removeItem('salone_token')
		setUser(null)
	}, [])
	const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), signIn, signOut }), [user, signIn, signOut])
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
