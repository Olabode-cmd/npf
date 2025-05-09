import { BASE_URL } from './api';

export async function login(username, password) {
  try {
    console.log("Sending Login Request:", { username, password });

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error Response Body:", errorBody);
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}