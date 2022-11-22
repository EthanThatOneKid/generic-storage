/**
 * FakeStorage implements Storage for testing.
 */
export class FakeStorage implements Storage {
  private data: Record<string, string> = {};
  private size = 0;

  public key(_: number): string | null {
    throw new Error("Method not implemented.");
  }

  public clear(): void {
    this.data = {};
    this.size = 0;
  }

  public getItem(key: string): string | null {
    return this.data[key] ?? null;
  }

  public removeItem(key: string): void {
    this.size--;
    delete this.data[key];
  }

  public setItem(key: string, value: string): void {
    if (!this.data[key]) {
      this.size++;
    }

    this.data[key] = value;
  }

  get length(): number {
    return this.size;
  }
}
