/**
 * Verifies if a given URL is genuine and reachable on the internet.
 * 
 * @param url The fully qualified URL to test (e.g. https://google.com).
 * @param timeoutMs Timeout in milliseconds (default 5000ms).
 * @returns Promise resolving to true if reachable, false otherwise.
 */
export async function checkUrlReachability(url: string, timeoutMs: number = 5000): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // mode: 'no-cors' is crucial for web platforms to avoid blocking the check due to CORS policies.
    // The fetch will succeed (with status 0 for opaque responses) if the domain/server is reachable,
    // and fail (throwing an error) if the domain does not exist or network is offline.
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log('Reachability check failed:', error);
    return false;
  }
}
