import type { AuthProvider } from '@refinedev/core';
import { notification } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

import { disableAutoLogin, enableAutoLogin } from './hooks';

export const TOKEN_KEY = 'LEECOIS-AUTH';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      // Make API call to fetch user details
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password,
      });

      const user = response.data;
      // Check if the user is an admin
      if (user.isAdmin) {
        enableAutoLogin();
        Cookies.set(TOKEN_KEY, user.authentication.sessionToken, {
          expires: 7,
        });
        return {
          success: true,
          redirectTo: '/',
        };
      }
      // If the user is not an admin, show an error notification
      notification.error({
        message: 'Login failed',
        description:
          'You do not have the required permissions to access this application.',
      });
      return {
        success: false,
        error: {
          message: 'Login failed',
          name: 'Not authorized',
        },
      };
    } catch (error) {
      // Handle login error
      notification.error({
        message: 'Login failed',
        description: 'Invalid email or password.',
      });
      return {
        success: false,
        error: {
          message: 'Login failed',
          name: 'Invalid email or password',
        },
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      await authProvider.login({ email, password });
      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: {
          message: 'Register failed',
          name: 'Invalid email or password',
        },
      };
    }
  },
  updatePassword: async () => {
    notification.success({
      message: 'Updated Password',
      description: 'Password updated successfully',
    });
    return {
      success: true,
    };
  },
  forgotPassword: async ({ email }) => {
    notification.success({
      message: 'Reset Password',
      description: `Reset password link sent to "${email}"`,
    });
    return {
      success: true,
    };
  },
  logout: async () => {
    disableAutoLogin();
    Cookies.remove(TOKEN_KEY); // Remove the token from the cookie
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: 'Check failed',
        name: 'Token not found',
      },
      logout: true,
      redirectTo: '/login',
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      return null;
    }

    // Optionally, fetch user identity details using the token
    // For now, returning static user details
    return {
      id: 1,
      name: 'Ackerman',
      avatar: 'https://i.pravatar.cc/150',
    };
  },
};
