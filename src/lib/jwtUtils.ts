import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Secret from .env file

/**
 * Function to decode the token and extract the userId
 * @param token JWT token
 * @returns userId or null if the token is invalid
 */
export const decodeToken = (token: string): string | null => {
  if (!token || !JWT_SECRET) {
    console.error('Token or secret key is missing.');
    return null;
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET); // Decode and verify the token
    if (decoded && decoded.userId) {
      return decoded.userId; // Extract the userId
    } else {
      console.error('User ID not found in token.');
      return null;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Function to decode the token without verification (only for client-side)
 * @param token JWT token
 * @returns decoded token or null
 */
export const decodeTokenWithoutVerification = (token: string): any | null => {
  if (!token) {
    console.error('Token is missing.');
    return null;
  }

  try {
    return jwt.decode(token); // Decode without verification (not recommended for production)
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
