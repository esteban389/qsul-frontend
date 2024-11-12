const ENV_KEYS = {
  API_URL: 'NEXT_PUBLIC_API_URL',
} as const;

type EnvKeys = keyof typeof ENV_KEYS;

export default function env(key: EnvKeys | string, defaultValue: string) {
  const envKey = ENV_KEYS[key as EnvKeys] || key;
  const value = process.env[envKey];
  return value !== undefined ? value : defaultValue;
}
