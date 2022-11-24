/**
 * Fetcher is a function that fetches a URL.
 *
 * @todo extend FakeServer to simulate server responses on the client.
 */
export interface Fetcher {
  fetch: typeof fetch;
}
