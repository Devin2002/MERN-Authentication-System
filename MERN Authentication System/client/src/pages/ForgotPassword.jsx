import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authAPI } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setAlert({ type: 'error', message: 'Please enter your email' });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.sendResetOtp(email);
      
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Reset OTP sent to your email' });
        setTimeout(() => navigate('/reset-password', { state: { email } }), 2000);
      } else {
        setAlert({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send OTP' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to reset password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Button type="submit" loading={loading}>
            Send Reset OTP
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;