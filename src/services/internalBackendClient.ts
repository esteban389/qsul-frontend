import axios from 'axios';
import env from '@/lib/env';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false,
});
const internalBackendClient = axios.create({
  baseURL: env('INTERNAL_API_URL', 'http://localhost:8000'),
  timeout: 20000,
  httpsAgent: agent,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    next: {
      revalidate: 60 * 60 * 24,
    },
  },
});
export default internalBackendClient;
