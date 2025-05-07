const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  SESSION_COOKIE_NAME: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
  XSRF_TOKEN_NAME: process.env.NEXT_PUBLIC_XSRF_TOKEN_NAME,
  INTERNAL_API_URL: process.env.INTERNAL_API_URL,
} as const;

type EnvKeys = keyof typeof ENV;

export default function env(key: EnvKeys, defaultValue?: string) {
  const value = ENV[key];
  return value !== undefined ? value : defaultValue;
}
