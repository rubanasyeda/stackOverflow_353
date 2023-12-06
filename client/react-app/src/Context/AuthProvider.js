import { createContext, useState } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({children}) =>{
    const [auth,setAuth] = useState({});
    console.log("Auth info:", auth);
    console.log("Auth info username:", auth.username);
    return(
        <AuthContext.Provider value = {{auth,setAuth}}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;