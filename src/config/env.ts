export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'React Demo',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  isDev: import.meta.env.DEV,
} as const;
