const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;

type EnvKeys = keyof typeof ENV;

export default function env(key: EnvKeys, defaultValue?: string) {
  const value = ENV[key];
  return value !== undefined ? value : defaultValue;
}
