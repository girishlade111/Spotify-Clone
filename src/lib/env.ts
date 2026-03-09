/**
 * Environment Variable Validation
 * Throws clear errors if required environment variables are missing
 */

const requiredEnvVars = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const;

type RequiredEnvVar = (typeof requiredEnvVars)[number];

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
}

export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getRequiredEnvVar(name: RequiredEnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Please add ${name} to your .env.local file.`
    );
  }
  return value;
}

export function getOptionalEnvVar(name: string, defaultValue?: string): string | undefined {
  return process.env[name] ?? defaultValue;
}

// Auto-validate on module load in development
if (process.env.NODE_ENV === 'development') {
  const result = validateEnv();
  if (!result.valid) {
    console.warn(
      'Missing environment variables:',
      result.missing.join(', '),
      '\nPlease check your .env.local file.'
    );
  }
}
