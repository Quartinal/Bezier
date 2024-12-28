interface StorageOptions {
  prefix?: string;
  encrypt?: boolean;
}

export class Storage {
  private prefix: string;
  private encrypt: boolean;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || "browser_";
    this.encrypt = options.encrypt || false;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private async encryptData(data: unknown): Promise<string> {
    if (!this.encrypt) return JSON.stringify(data);

    const text = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(text);

    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      dataBuffer,
    );

    const exportedKey = await crypto.subtle.exportKey("raw", key);

    return JSON.stringify({
      key: Array.from(new Uint8Array(exportedKey)),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    });
  }

  private async decryptData(text: string): Promise<unknown> {
    if (!this.encrypt) return JSON.parse(text);

    const { key, iv, data } = JSON.parse(text);

    const importedKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(key),
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      importedKey,
      new Uint8Array(data),
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(this.getKey(key));
    if (!data) return null;

    try {
      return (await this.decryptData(data)) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    const encrypted = await this.encryptData(value);
    localStorage.setItem(this.getKey(key), encrypted);
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  async getAll(): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        const value = await this.get(key.slice(this.prefix.length));
        if (value !== null) {
          result[key.slice(this.prefix.length)] = value;
        }
      }
    }

    return result;
  }
}
