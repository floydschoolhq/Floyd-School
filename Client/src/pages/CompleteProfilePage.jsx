import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, ArrowRight } from 'lucide-react';
import { handleGoogleCallback } from '../utils/googleAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    mobileNumber: ''
  });

  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      try {
        // Check if this is a Google OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          toast.error(`Google OAuth error: ${error}`);
          navigate('/student/login');
          return;
        }

        if (code) {
          // Handle Google OAuth callback
          const authData = await handleGoogleCallback();
          
          // Store auth data
          localStorage.setItem('token', authData.token);
          localStorage.setItem('user', JSON.stringify(authData));
          
          setUserData({
            fullName: authData.name || '',
            mobileNumber: authData.mobileNumber || ''
          });

          // If user already has mobile number, redirect to dashboard
          if (authData.mobileNumber) {
            navigate('/student');
            return;
          }
        } else {
          // Check if user is already authenticated and needs profile completion
          const token = localStorage.getItem('token');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          
          if (token && user.provider === 'google' && !user.mobileNumber) {
            setUserData({
              fullName: user.name || '',
              mobileNumber: ''
            });
          } else if (token && user.mobileNumber) {
            navigate('/student');
            return;
          } else {
            // No valid auth, redirect to login
            navigate('/student/login');
            return;
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        
        // Provide specific error messages
        let errorMessage = 'Authentication failed. Please try again.';
        
        if (error.message.includes('Server is not properly configured')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (error.message.includes('Google authentication failed')) {
          errorMessage = 'Google authentication failed. Please try again.';
        } else if (error.message.includes('Google OAuth error')) {
          errorMessage = 'Google OAuth error. Please try again.';
        }
        
        toast.error(errorMessage);
        navigate('/student/login');
      } finally {
        setIsLoading(false);
      }
    };

    handleGoogleAuthCallback();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!userData.mobileNumber.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }

    // Basic mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(userData.mobileNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/complete-profile', {
        fullName: userData.fullName,
        mobileNumber: userData.mobileNumber
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast.success('Profile completed successfully!');
      navigate('/student');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error(error.response?.data?.message || 'Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Just a few more details to get you started with your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={userData.mobileNumber}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              We'll use this for important updates and verification
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Completing Profile...</span>
              </>
            ) : (
              <>
                <span>Complete Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By completing your profile, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfilePage;
