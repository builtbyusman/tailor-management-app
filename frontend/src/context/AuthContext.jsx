import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

  // ==========================================
  // TOKEN
  // ==========================================

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });


  // ==========================================
  // USER
  // ==========================================

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    try {
      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }

  });


  // ==========================================
  // LOGIN
  // ==========================================

  const login = (loginResponse) => {

    console.log(
      "Login response:",
      loginResponse
    );


    const receivedToken =
      loginResponse?.token ||
      loginResponse?.accessToken ||
      loginResponse?.data?.token ||
      loginResponse?.data?.accessToken;


    const receivedUser =
      loginResponse?.user ||
      loginResponse?.data?.user;


    if (!receivedToken) {
      throw new Error(
        "Login token not found in server response"
      );
    }


    // Save token

    localStorage.setItem(
      "token",
      receivedToken
    );

    setToken(receivedToken);


    // Save user

    if (receivedUser) {

      const normalizedUser = {
        ...receivedUser,
        role: receivedUser.role
          ? String(receivedUser.role).toUpperCase()
          : undefined,
      };


      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      setUser(normalizedUser);

      return {
        token: receivedToken,
        user: normalizedUser,
      };
    }


    return {
      token: receivedToken,
      user: null,
    };
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

  };


  // ==========================================
  // AUTH STATE
  // ==========================================

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// ==========================================
// USE AUTH
// ==========================================

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
