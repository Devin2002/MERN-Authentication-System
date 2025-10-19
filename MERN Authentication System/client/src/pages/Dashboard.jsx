import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <User className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600">You're successfully logged in</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
              <Shield size={32} className="mb-2" />
              <h3 className="font-semibold mb-1">Secure Account</h3>
              <p className="text-sm opacity-90">Your account is protected</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
              <CheckCircle size={32} className="mb-2" />
              <h3 className="font-semibold mb-1">
                {user?.isAccountVerified ? 'Verified' : 'Unverified'}
              </h3>
              <p className="text-sm opacity-90">
                {user?.isAccountVerified 
                  ? 'Email verified successfully' 
                  : 'Please verify your email'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
              <Mail size={32} className="mb-2" />
              <h3 className="font-semibold mb-1">Connected</h3>
              <p className="text-sm opacity-90">All systems operational</p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold text-gray-800">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Status:</span>
                <span className={`font-semibold ${
                  user?.isAccountVerified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {user?.isAccountVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="danger" 
            loading={loading} 
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;