import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const register = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!gmailRegex.test(normalizedEmail)) {
      return {
        success: false,
        message: "Please use a valid Gmail address.",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long.",
      };
    }

    const users = getStoredUsers();
    const exists = users.some(
      (u) => u.email === normalizedEmail
    );

    if (exists) {
      return {
        success: false,
        message: "This account already exists. Please login.",
      };
    }

    const newUser = {
      email: normalizedEmail,
      password,
      name: normalizedEmail.split("@")[0],
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const loggedInUser = {
      email: newUser.email,
      name: newUser.name,
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return { success: true };
  };

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();

    const found = users.find(
      (u) =>
        u.email === normalizedEmail &&
        u.password === password
    );

    if (!found) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const loggedInUser = {
      email: found.email,
      name: found.name,
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}