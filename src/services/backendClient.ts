import axios from 'axios';
import env from '@/lib/env';

const backendClient = axios.create({
  baseURL: env('API_URL', 'http://localhost:8000'),
  timeout: 20000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});
export default backendClient;
