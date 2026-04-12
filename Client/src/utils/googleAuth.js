import api from '../api/axios';

// Handle Google OAuth callback - send authorization code to backend
export const handleGoogleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');

    if (error) {
        console.error('Google OAuth error:', error);
        throw new Error(`Google OAuth error: ${error}`);
    }

    if (!code) {
        console.error('No authorization code received from Google');
        throw new Error('No authorization code received from Google');
    }

    try {
        // Get the current redirect URI dynamically
        const redirectUri = `${window.location.origin}/complete-profile`;
        console.log('Google OAuth callback - Redirect URI:', redirectUri);

        // Send authorization code to backend for processing
        const authResponse = await api.post('/auth/google/callback', {
            code,
            redirectUri,
            state
        });

        console.log('Google auth successful:', authResponse.data);
        return authResponse.data;
    } catch (error) {
        console.error('Google callback error:', error);

        // Provide more specific error messages
        if (error.response?.data?.error === 'GOOGLE_OAUTH_NOT_CONFIGURED') {
            throw new Error('Server is not properly configured for Google authentication. Please contact support.');
        }

        if (error.response?.data?.error === 'GOOGLE_API_ERROR') {
            throw new Error('Google authentication failed. Please try again.');
        }

        throw error;
    }
};