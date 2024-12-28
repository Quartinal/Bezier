export const urlUtils = {
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  normalizeUrl(url: string): string {
    if (!url) return "";

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      return url;
    }
  },

  getDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "";
    }
  },

  getFavicon(url: string): string {
    try {
      const domain = this.getDomain(url);
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return "";
    }
  },

  isInternalUrl(url: string): boolean {
    const internalProtocols = ["chrome:", "edge:", "about:", "browser:"];
    try {
      const urlObj = new URL(url);
      return internalProtocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  sanitizeUrl(url: string): string {
    const dangerousProtocols = ["javascript:", "data:", "vbscript:"];
    try {
      const urlObj = new URL(url);
      if (dangerousProtocols.includes(urlObj.protocol.toLowerCase())) {
        return "about:blank";
      }
      return url;
    } catch {
      return "about:blank";
    }
  },
};
