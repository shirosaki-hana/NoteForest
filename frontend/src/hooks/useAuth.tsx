import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPasswordSet: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  setupPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  checkPasswordStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  const checkPasswordStatus = async () => {
    try {
      const response = await fetch('/auth/status', {
        credentials: 'include',
      });
      const data = await response.json();
      setIsPasswordSet(data.passwordSet);
    } catch {
      setIsPasswordSet(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/auth/check', {
        credentials: 'include',
      });
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const setupPassword = async (password: string) => {
    try {
      const response = await fetch('/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setIsPasswordSet(true);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: '비밀번호 설정 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkPasswordStatus();
      await checkAuth();
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isPasswordSet,
        login,
        setupPassword,
        logout,
        checkAuth,
        checkPasswordStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
