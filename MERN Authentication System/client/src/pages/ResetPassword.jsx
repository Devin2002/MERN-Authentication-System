import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { authAPI } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Password reset successful!' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setAlert({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Password reset failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setFormData(prev => ({ ...prev, otp: value }));
      if (errors.otp) {
        setErrors(prev => ({ ...prev, otp: '' }));
      }
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
          <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600 mt-2">Create a new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              maxLength="6"
              value={formData.otp}
              onChange={handleOtpChange}
              className={`w-full text-center text-xl tracking-widest px-4 py-3 bg-gray-50 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all ${
                errors.otp ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
          </div>
          
          <Input
            icon={Lock}
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          
          <Input
            icon={Lock}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          
          <Button type="submit" loading={loading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;