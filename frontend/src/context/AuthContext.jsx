import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../services/authApi";

//create context
const AuthContext = createContext(null);

//create provider
export function AuthProvider({ children }) {
  //init
  const [user, setUser] = useState(() => {
    
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  // login user then store in localstorage
  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token } = await authApi.login(credentials);

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    setLoading(true);
    try {
      //make api call to create new user 
      console.log("user data : " , data);

      const { user: newUser, token } = await authApi.signup(data);
      
      //set in localstorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  //remove token from localstorage and set current usr null
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
