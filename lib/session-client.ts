// lib/session-client.ts
export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/session', { credentials: 'include' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}
