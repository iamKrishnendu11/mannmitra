// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../services/authApi.js';
import * as progressApi from '../services/progressApi.js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------------
  // 🔄 REFRESH USER + TOKEN + PROGRESS
  // --------------------------------------------------------
  const refresh = async () => {
    try {
      const data = await api.refresh(); // refresh cookies -> returns { accessToken, user }

      if (!data?.accessToken) {
        setUser(null);
        setAccessToken(null);
        setProgress(null);
        return null;
      }

      setAccessToken(data.accessToken);
      setUser(data.user);

      // get progress using /api/auth/me
      const meData = await api.me(data.accessToken);

      if (meData?.progress) {
        setProgress(meData.progress);
      } else {
        // fallback to old progressApi method
        const p = await progressApi.getProgress({
          user_email: data.user.email,
          accessToken: data.accessToken
        });
        setProgress(p || null);
      }

      return data;
    } catch (err) {
      console.error("refresh error", err);
      setUser(null);
      setAccessToken(null);
      setProgress(null);
      return null;
    }
  };

  // --------------------------------------------------------
  // Auto-login: refresh on mount
  // --------------------------------------------------------
  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  // --------------------------------------------------------
  // REGISTER
  // --------------------------------------------------------
  const signup = async ({ name, email, password }) => {
    const data = await api.register({ name, email, password });

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      setUser(data.user);

      const p = await progressApi.getProgress({
        user_email: data.user.email,
        accessToken: data.accessToken
      });
      setProgress(p);
    }

    return data;
  };

  // --------------------------------------------------------
  // LOGIN (signin)
  // --------------------------------------------------------
  const signin = async ({ email, password }) => {
    const data = await api.login({ email, password });

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      setUser(data.user);

      const meData = await api.me(data.accessToken);

      if (meData?.progress) {
        setProgress(meData.progress);
      } else {
        const p = await progressApi.getProgress({
          user_email: data.user.email,
          accessToken: data.accessToken
        });
        setProgress(p);
      }
    }

    return data;
  };

  // --------------------------------------------------------
  // LOGOUT (signout)
  // --------------------------------------------------------
  const signout = async () => {
    await api.logout();
    setUser(null);
    setAccessToken(null);
    setProgress(null);
  };

  // --------------------------------------------------------
  // UPDATE PROGRESS
  // --------------------------------------------------------
  const updateProgress = async (update) => {
    if (!accessToken || !progress) throw new Error("No progress or token");

    const updated = await progressApi.updateProgressById(
      progress._id,
      update,
      accessToken
    );

    setProgress(updated);
    return updated;
  };

  // --------------------------------------------------------
  // CREATE PROGRESS
  // --------------------------------------------------------
  const createProgressForUser = async (data) => {
    if (!accessToken) throw new Error("No token");

    const created = await progressApi.createProgress(data, accessToken);
    setProgress(created);
    return created;
  };

  // --------------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------------
  const value = {
    user,
    accessToken,
    progress,
    loading,
    signup,
    signin,          
    signout,         
    logout: signout,
    updateProgress,
    createProgressForUser,
    setProgress,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}