import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    console.log('Received callback data:', { token: !!token, userData: !!userData });

    if (token && userData) {
      try {
        // Parse user data
        const parsedUserData = JSON.parse(userData);
        console.log('Parsed user data:', parsedUserData);
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(parsedUserData));
        
        // Update auth context
        setUser(parsedUserData);
        setToken(token);
        
        console.log('Authentication successful, redirecting to home...');
        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/login');
      }
    } else {
      console.error('Missing token or user data in callback');
      navigate('/login');
    }
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 