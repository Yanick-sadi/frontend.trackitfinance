import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { userToken } = useSelector(state => state.auth);

  if (!userToken) {
    return { user: null };
  }

  try {
    const decodedToken = jwtDecode(userToken);
    return {
      user: {
        token: userToken,
        fullName: decodedToken.name,
        role: decodedToken.role,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid or expired token';
    toast.error(errorMessage, {
      duration: 2000,
    });
    return { user: null };
  }
};
