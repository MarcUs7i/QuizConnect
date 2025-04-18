import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { CodeInput } from '../components/CodeInput';
import { Button } from '../components/Button';
import { login, adminLogin } from '../lib/api';
import { useAuthStore } from '../store/auth';

export const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore(state => state.setToken);

  const handleLogin = async (code: string) => {
    try {
      setError(null);
      const response = isAdmin 
        ? await adminLogin(code)
        : await login(code);

      if (response.success) {
        setToken(response.accessToken, isAdmin);
        navigate(isAdmin ? '/admin' : '/dashboard');
      } else {
        setError(response.errorMessage || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">QuizConnect</h1>
          <p className="text-gray-400">Enter your {isAdmin ? 'admin' : 'user'} code to continue</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="flex justify-center mb-8">
            <CodeInput onComplete={handleLogin} />
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setIsAdmin(!isAdmin)}
              className="mt-4"
            >
              Switch to {isAdmin ? 'User' : 'Admin'} Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};