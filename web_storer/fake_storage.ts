/**
 * FakeStorage implements Storage for testing.
 */
export class FakeStorage implements Storage {
  private data: Record<string, string> = {};

  public get length(): number {
    return 0;
  }

  public key(_: number): string | null {
    return null;
  }

  public clear(): void {
    this.data = {};
  }

  public getItem(key: string): string | null {
    return this.data[key] ?? null;
  }

  public removeItem(key: string): void {
    delete this.data[key];
  }

  public setItem(key: string, value: string): void {
    this.data[key] = value;
  }
}
