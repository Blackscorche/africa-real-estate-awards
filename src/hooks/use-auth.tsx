import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const DEMO_STORAGE_KEY = "area_demo_session";

export interface DemoSessionData {
  user: User;
  isAdmin: boolean;
}

type AuthState = {
  ready: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  signInDemo: (role: "admin" | "user") => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  ready: false,
  session: null,
  user: null,
  isAdmin: false,
  signInDemo: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check for demo session in localStorage
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DemoSessionData;
        setDemoUser(parsed.user);
        setIsAdmin(parsed.isAdmin);
        setReady(true);
      }
    } catch {
      // storage unavailable
    }

    // 2. Check Supabase auth
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) {
        setSession(s);
        setDemoUser(null);
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
      setReady(true);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        setDemoUser(null);
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
      setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const uid = session?.user.id;
  useEffect(() => {
    if (!uid) {
      if (!demoUser) setIsAdmin(false);
      return;
    }
    supabase.rpc("has_role", { _user_id: uid, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [uid, demoUser]);

  function signInDemo(role: "admin" | "user") {
    const isAdm = role === "admin";
    const mockUser: User = {
      id: isAdm ? "e5a2fb16-6824-4793-99fa-592ba78b6520" : "2f55f208-5f7e-4ceb-b7ff-9cb0e95c2051",
      app_metadata: {},
      user_metadata: {
        full_name: isAdm ? "African Real Estate Admin" : "Olumide Bakare",
      },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: isAdm ? "admin@africarealestateawards.org" : "voter@africarealestateawards.org",
      phone: "+234 800 123 4567",
      role: isAdm ? "admin" : "authenticated",
      updated_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ user: mockUser, isAdmin: isAdm }));
    } catch {
      // storage blocked
    }

    setDemoUser(mockUser);
    setIsAdmin(isAdm);
    setReady(true);
  }

  async function signOut() {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // storage blocked
    }
    setDemoUser(null);
    setSession(null);
    setIsAdmin(false);
    await qc.cancelQueries();
    qc.removeQueries({ queryKey: ["me"] });
    qc.removeQueries({ queryKey: ["admin"] });
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const activeUser = session?.user ?? demoUser ?? null;

  return (
    <AuthContext.Provider value={{ ready, session, user: activeUser, isAdmin, signInDemo, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
