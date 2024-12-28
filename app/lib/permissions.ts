export type Permission =
  | "tabs"
  | "bookmarks"
  | "history"
  | "downloads"
  | "notifications"
  | "storage"
  | "webRequest"
  | "cookies"
  | "privacy";

export class PermissionManager {
  private static instance: PermissionManager;
  private permissions: Set<Permission> = new Set();

  private constructor() {}

  static getInstance(): PermissionManager {
    if (!PermissionManager.instance) {
      PermissionManager.instance = new PermissionManager();
    }
    return PermissionManager.instance;
  }

  async request(permission: Permission): Promise<boolean> {
    try {
      const result = await this.requestNativePermission(permission);
      if (result) {
        this.permissions.add(permission);
      }
      return result;
    } catch {
      return false;
    }
  }

  private async requestNativePermission(
    permission: Permission,
  ): Promise<boolean> {
    if ("permissions" in navigator) {
      try {
        const result = await navigator.permissions.query({
          name: permission as PermissionName,
        });
        return result.state === "granted";
      } catch {
        return false;
      }
    }
    return false;
  }

  has(permission: Permission): boolean {
    return this.permissions.has(permission);
  }

  revoke(permission: Permission): void {
    this.permissions.delete(permission);
  }

  clear(): void {
    this.permissions.clear();
  }

  getAll(): Permission[] {
    return Array.from(this.permissions);
  }
}
