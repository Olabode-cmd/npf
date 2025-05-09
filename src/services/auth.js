import { BASE_URL } from './api';

export async function login(officer_id, password) {
  try {
    console.log("Sending Login Request:", { officer_id, password });

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ officer_id, password }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error Response Body:", errorBody);
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log(data)
    const { access_token, refresh_token } = data;

    // Ensure tokens are present before storing
    if (access_token && refresh_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    } else {
      console.error('Tokens not found in response:', data);
      throw new Error('Invalid login response');
    }

    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}
