import { useState } from 'react';
import { useAuthStore } from '../store/auth';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, loading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await registerWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center animate-fade-in">
        
        {/* Left Side - Hero Content */}
        <div className="hidden lg:block space-y-8 text-left">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <img 
              src={`${import.meta.env.BASE_URL}bk_shop.webp`} 
              alt="BK Shop" 
              className="relative w-32 h-32 object-cover rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          
          <div>
            <h1 className="text-6xl font-extrabold mb-4 leading-tight">
              Bienvenue sur <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BK Shop</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md leading-relaxed">
              Découvrez une expérience de shopping unique avec nos collections exclusives et profitez d'offres exceptionnelles.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-primary mb-1">100+</p>
              <p className="text-sm font-medium text-gray-500">Produits Exclusifs</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-secondary mb-1">24/7</p>
              <p className="text-sm font-medium text-gray-500">Support Client</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="lg:hidden text-center mb-8">
                <img src={`${import.meta.env.BASE_URL}bk_shop.webp`} alt="BK Shop" className="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BK Shop</h1>
              </div>

              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {isRegister ? 'Créer un compte' : 'Bon retour !'}
              </h2>
              <p className="text-gray-500 mb-8">
                {isRegister ? 'Rejoignez-nous dès aujourd\'hui' : 'Connectez-vous pour continuer'}
              </p>

              {error && (
                <div className="alert alert-error gap-3 mb-6 shadow-lg animate-fade-in text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8a8 8 0 110 16 8 8 0 010-16z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-5">
                <div className="form-control w-full">
                  <label className="label pl-1">
                    <span className="label-text font-semibold text-gray-700">Email</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10 bg-white/50 focus:bg-white focus:input-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      required
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label pl-1">
                    <span className="label-text font-semibold text-gray-700">Mot de passe</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="input input-bordered w-full pl-10 bg-white/50 focus:bg-white focus:input-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                </div>

                <button 
                  className={`btn btn-primary btn-lg w-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 mt-2 rounded-xl ${loading ? 'loading' : ''}`} 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : (isRegister ? '✨ Créer mon compte' : '🔐 Se connecter')}
                </button>
              </form>

              <div className="divider my-6 text-gray-400 text-sm">ou continuer avec</div>

              <button
                className={`btn btn-outline btn-lg w-full flex items-center justify-center gap-3 transition-all hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 rounded-xl bg-white/50 ${loading ? 'btn-disabled' : ''}`}
                onClick={loginWithGoogle}
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12 c3.059,0,5.842,1.158,7.961,3.039l5.657-5.657C33.64,6.053,29.082,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.158,7.961,3.039l5.657-5.657 C33.64,6.053,29.082,4,24,4C17.312,4,11.011,8.989,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.197l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.204,0-9.619-3.317-11.283-7.976l-6.49,5.004 C10.957,39.556,16.951,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.094,5.584c0.001-0.001,0.002-0.001,0.003-0.002 l6.19,5.238C35.819,39.205,44,33,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Google
              </button>

              <div className="text-center mt-6">
                {isRegister ? (
                  <p className="text-sm text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <button className="link link-primary font-bold hover:text-primary transition-colors" onClick={() => setIsRegister(false)}>Se connecter</button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Pas encore de compte ?{' '}
                    <button className="link link-primary font-bold hover:text-primary transition-colors" onClick={() => setIsRegister(true)}>Créer un compte</button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
