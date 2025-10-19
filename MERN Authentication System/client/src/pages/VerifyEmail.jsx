import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setAlert({ type: 'error', message: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    const result = await verifyEmail(otp);
    setLoading(false);

    if (result.success) {
      setAlert({ type: 'success', message: 'Email verified successfully!' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      setAlert({ type: 'error', message: result.message });
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Verify Email</h1>
          <p className="text-gray-600 mt-2">Enter the OTP sent to your email</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              value={otp}
              onChange={handleOtpChange}
              className="w-full text-center text-2xl tracking-widest px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          
          <Button type="submit" loading={loading}>
            Verify Email
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;