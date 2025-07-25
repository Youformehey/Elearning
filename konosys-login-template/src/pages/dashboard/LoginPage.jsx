import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, UsersRound, BookUser } from 'lucide-react';
import "../../index.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('etudiant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const roles = [
    { value: 'etudiant', label: 'Étudiant', icon: <GraduationCap size={18} className="inline mr-2" /> },
    { value: 'prof', label: 'Professeur', icon: <BookUser size={18} className="inline mr-2" /> },
    { value: 'admin', label: 'Administrateur', icon: <ShieldCheck size={18} className="inline mr-2" /> },
    { value: 'parent', label: 'Parent', icon: <UsersRound size={18} className="inline mr-2" /> },
  ];

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("handleSubmit appelé", { email, password, role });
  setError(null);

  if (!email.trim() || !password.trim() || !role) {
    setError('Veuillez remplir tous les champs.');
    return;
  }

  setLoading(true);

  try {
    const endpointMap = {
      etudiant: '/api/students/login',
      prof: '/api/teachers/login',
      admin: '/api/admins/login',
      parent: '/api/parents/login',
    };

    const endpoint = endpointMap[role];

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });

    const data = await res.json();
    console.log("Réponse du serveur:", data);

    if (!res.ok || (data.message && res.status !== 200)) {
      throw new Error(data.message || 'Erreur de connexion');
    }

    // Ajoute cette ligne pour forcer le rôle côté frontend
    data.role = role;

    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);

    if (role === 'prof') {
      localStorage.setItem('userEmail', data.email);
    }

    switch (role) {
      case 'parent':
        navigate('/espace-parent');
        break;
      case 'prof':
        navigate('/prof');
        break;
      case 'admin':
        navigate('/dashboard');
        break;
      case 'etudiant':
      default:
        navigate('/student');
        break;
    }
  } catch (err) {
    setError(err.message);
    console.error("Erreur lors de la connexion:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex flex-col items-center justify-center px-4">
      <img src="/image pfe.png" alt="Logo" className="w-32 mb-3 animate-fadeIn" />
      <h1 className="text-white text-4xl font-bold mb-1 tracking-wide">LEARNUP</h1>
      <p className="text-blue-400 uppercase text-sm tracking-widest mb-6">Learn. Grow. Succeed.</p>

      <div className="mb-6 w-full max-w-lg text-center">
        <label className="block text-white mb-2 text-lg font-semibold">Rôle</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-[#111827] text-white text-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={loading}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0f172a]/90 shadow-2xl p-10 rounded-2xl w-full max-w-lg space-y-6"
      >
        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        <div>
          <label className="text-white font-semibold text-lg">Identifiant</label>
          <input
            type="email"
            placeholder="janesmith@example.com"
            className="mt-2 w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-white font-semibold text-lg">Mot de passe</label>
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={role === 'prof' ? 'current-password' : 'off'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:underline"
              disabled={loading}
            >
              {showPassword ? 'Cacher' : 'Afficher'}
            </button>
          </div>
        </div>

        <div className="text-right">
          <a href="/forgot-password" className="text-blue-400 text-sm hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-xl transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Connexion...' : 'Connexion'}
        </button>
      </form>
    </div>
  );
}
