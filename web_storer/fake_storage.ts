const ErrMethodUnimplemented = new Error("Method not implemented");

/**
 * FakeStorage implements Storage for testing.
 */
export class FakeStorage implements Storage {
  private data: Record<string, string> = {};

  public get length(): number {
    throw ErrMethodUnimplemented;
  }

  public key(_: number): string | null {
    throw ErrMethodUnimplemented;
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
