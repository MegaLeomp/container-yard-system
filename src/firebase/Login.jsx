import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      onLogin({
        uid: user.uid,
        email: user.email,
        name: user.email.split('@')[0]
      });
    } catch (error) {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Acesso ao Sistema</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="admin@empresa.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Sua senha"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Credenciais de Teste:</h3>
          <div className="text-sm space-y-1">
            <div><strong>Email:</strong> teste@empresa.com</div>
            <div><strong>Senha:</strong> teste123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;