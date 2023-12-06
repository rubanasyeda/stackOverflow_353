import { createContext, useState, useEffect } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState(()=>{
        // Attempt to retrieve authentication data from storage on initial load
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {};
    });

    useEffect(() => {
        // Update storage whenever auth state changes
        localStorage.setItem('auth', JSON.stringify(auth));
      }, [auth]);
    // console.log("Auth info:", auth);
    // console.log("Auth info username:", auth.username);
    return(
        <AuthContext.Provider value = {{auth,setAuth}}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;