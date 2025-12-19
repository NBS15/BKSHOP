import { create } from 'zustand';
import { auth, authApi, googleProvider, type User } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error?: string;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: undefined,

  loginWithGoogle: async () => {
    set({ loading: true, error: undefined });
    try {
      await authApi.signInWithPopup(auth, googleProvider);
      set({ loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erreur de connexion Google';
      set({ loading: false, error: message });
    }
  },

  loginWithEmail: async (email, password) => {
    set({ loading: true, error: undefined });
    try {
      await authApi.signInWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Email/mot de passe invalide';
      set({ loading: false, error: message });
    }
  },

  registerWithEmail: async (email, password) => {
    set({ loading: true, error: undefined });
    try {
      await authApi.createUserWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Échec de l'inscription";
      set({ loading: false, error: message });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authApi.signOut(auth);
      set({ user: null, loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Échec de la déconnexion';
      set({ loading: false, error: message });
    }
  },
}));

// Abonnement global à Firebase Auth pour tenir le store à jour
authApi.onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});
