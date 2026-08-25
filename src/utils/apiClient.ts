/**
 * Safe API client for handling JSON fetch requests with robust error extraction.
 * Prevents "Unexpected token '<', '<!doctype...' is not valid JSON" parsing crashes.
 */

export async function fetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error(
      netErr?.message || 'Network connection error. Please verify connection and retry.'
    );
  }

  const rawText = await response.text();
  let data: any = null;

  if (rawText && rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText);
    } catch (_jsonErr) {
      // If response is HTML or plain text (e.g. from reverse proxy or server error page)
      if (!response.ok) {
        throw new Error(
          `Server status ${response.status} (${response.statusText || 'Error'}). Please retry in a moment.`
        );
      }
      throw new Error(
        'Server returned an invalid response format. Please try again.'
      );
    }
  }

  if (!response.ok) {
    const errorMsg =
      data?.error?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return (data || {}) as T;
}
