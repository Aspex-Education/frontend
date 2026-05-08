import { jwtDecode } from 'jwt-decode';

export function getUserEmailFromToken(): string | null {
  try {
    const token = localStorage.getItem('currentUser');
    if (!token) return null;

    const user = JSON.parse(token);
    if (!user || !user.token) return null;

    const decoded: any = jwtDecode(user.token);
    return decoded.sub || decoded.email || null; 
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}