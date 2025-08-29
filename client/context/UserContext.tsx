import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserProfile = {
  firstName: string;
  lastName: string;
  email?: string;
};

type UserContextValue = {
  profile: UserProfile | null;
  fullName: string;
  setProfile: (p: UserProfile | null) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  logout: () => void;
};

const STORAGE_KEY = "userProfile";

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Prefetch profile from storage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((p: UserProfile | null) => {
    if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setAndPersist = useCallback(
    (p: UserProfile | null) => {
      setProfile(p);
      persist(p);
    },
    [persist],
  );

  const updateProfile = useCallback(
    (partial: Partial<UserProfile>) => {
      setAndPersist({
        ...(profile ?? { firstName: "", lastName: "" }),
        ...partial,
      });
    },
    [profile, setAndPersist],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("access");
    setAndPersist(null);
  }, [setAndPersist]);

  const fullName = useMemo(() => {
    if (!profile) return "Guest";
    const first = profile.firstName?.trim();
    const last = profile.lastName?.trim();
    return [first, last].filter(Boolean).join(" ") || "Guest";
  }, [profile]);

  const value: UserContextValue = useMemo(
    () => ({
      profile,
      fullName,
      setProfile: setAndPersist,
      updateProfile,
      logout,
    }),
    [profile, fullName, setAndPersist, updateProfile, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
