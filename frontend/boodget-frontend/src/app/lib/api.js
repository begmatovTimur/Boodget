const BASE_URL = 'http://127.0.0.1:8000/';

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    let accessToken = token || localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');

    const headers = {
        'Content-Type': 'application/json',
    };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    let config = {
        method,
        headers,
    };
    if (body) config.body = JSON.stringify(body);

    let response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401 && refreshToken) {
        // Try to refresh access token
        const refreshRes = await fetch(`${BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshRes.ok) {
            const { access } = await refreshRes.json();
            localStorage.setItem('access', access); // update token
            headers['Authorization'] = `Bearer ${access}`; // update header
            config.headers = headers; // reassign

            // Retry original request
            response = await fetch(`${BASE_URL}${endpoint}`, config);
        } else {
            throw new Error('Refresh token expired. Please log in again.');
        }
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');

    return data;
};
