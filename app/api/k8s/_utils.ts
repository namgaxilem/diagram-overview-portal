import { execFile } from 'child_process';

export interface KubectlResult {
  stdout: string;
  stderr: string;
}

export interface KubectlError extends Error {
  stdout?: string;
  stderr?: string;
  code?: number;
}

export function kubectl(
  args: string[],
  options?: { timeout?: number; maxBuffer?: number }
): Promise<KubectlResult> {
  return new Promise((resolve, reject) => {
    execFile(
      'kubectl',
      args,
      {
        maxBuffer: options?.maxBuffer ?? 10 * 1024 * 1024,
        timeout: options?.timeout ?? 30000,
      },
      (error, stdout, stderr) => {
        if (error) {
          const err = error as KubectlError;
          err.stdout = stdout;
          err.stderr = stderr;
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });
}

export function getAge(timestamp: string): string {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  return `${diffMins}m`;
}
