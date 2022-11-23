export interface Handler {
  handle: (req: Request) => Promise<Response>;
}
