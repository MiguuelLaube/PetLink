import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import type { Ong, UserProfile } from '@/schemas';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  ong: Ong | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  ong: null,
  loading: true,
  refresh: async () => {},
});

export const useAuth = () => useContext(AuthContext);
