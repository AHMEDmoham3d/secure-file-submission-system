import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isLocked) {
      setIsLocked(true);
    }
  }, [countdown, isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (id === 'RW0.01') {
        navigate('/upload');
      } else if (id.toLowerCase() === 'cover') {
        setCountdown(15);
        setIsLocked(true);
        setError('Please wait 15 seconds...');
      } else if (id.toLowerCase() === 'admin') {
        navigate('/admin-login');
      } else {
        setError('Invalid ID. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 transform transition-all">
        <div className="text-center mb-8">
          <div className="mx-auto bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Secure File Submission</h1>
          <p className="text-gray-600 mt-2">Enter your ID to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
              Access ID
            </label>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isLocked || isLoading}
              className={`w-full px-4 py-3 rounded-md border ${
                error ? 'border-red-300' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              placeholder="Enter your ID"
            />
          </div>

          {error && (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              {countdown > 0 && (
                <p className="text-gray-600 mt-2">
                  Locked for {countdown} seconds
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLocked || !id || isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium 
            ${
              isLocked || !id
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors flex items-center justify-center`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;