import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // Send cookies (refresh token)
});

// Attach access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sa_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-refresh on 401
let refreshing = false;
let waitQueue = [];

const processQueue = (error, token = null) => {
    waitQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    waitQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
            if (refreshing) {
                return new Promise((resolve, reject) => {
                    waitQueue.push({ resolve, reject });
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return api(original);
                });
            }
            original._retry = true;
            refreshing = true;
            try {
                const { data } = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
                const { accessToken } = data.data;
                localStorage.setItem('sa_access_token', accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);
                return api(original);
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                localStorage.removeItem('sa_access_token');
                window.location.href = '/login';
                return Promise.reject(refreshErr);
            } finally {
                refreshing = false;
            }
        }
        return Promise.reject(err);
    }
);

export default api;
