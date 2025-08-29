import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isCreatingAccount) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.email.split('@')[0],
          role: 'operador',
          createdAt: new Date()
        });
        
        alert('Conta criada com sucesso! Faça login.');
        setIsCreatingAccount(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        onLogin({
          uid: user.uid,
          email: user.email,
          name: user.email.split('@')[0] || 'Usuário'
        });
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este email já está em uso. Faça login ou use outro email.');
          break;
        case 'auth/invalid-email':
          setError('Email inválido. Verifique o formato.');
          break;
        case 'auth/weak-password':
          setError('Senha muito fraca. Use pelo menos 6 caracteres.');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado. Crie uma conta primeiro.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. Tente novamente.');
          break;
        default:
          setError('Erro: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        
        {/* Logo da Empresa - SUBSTITUA AQUI */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/logo.png"  // ← ALTERE PARA O NOME DA SUA IMAGEM
              alt="Logo da Empresa" 
              className="w-20 h-20 object-contain"  // Ajuste o tamanho se necessário
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">LFX Transportes</h1>
          <p className="text-sm text-gray-600">Sistema de Gerenciamento de Pátio</p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">
          {isCreatingAccount ? 'Criar Nova Conta' : 'Acesso ao Sistema'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
          >
            {isCreatingAccount ? 'Criar Conta' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsCreatingAccount(!isCreatingAccount)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            {isCreatingAccount ? 'Voltar para login' : 'Criar uma nova conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;