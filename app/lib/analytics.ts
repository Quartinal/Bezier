export class Analytics {
  private static instance: Analytics;
  private events: Record<string, number> = {};
  private startTime: number;

  private constructor() {
    this.startTime = Date.now();
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  trackEvent(category: string, action: string, label?: string): void {
    const event = `${category}:${action}${label ? `:${label}` : ""}`;
    this.events[event] = (this.events[event] || 0) + 1;
  }

  trackTiming(category: string, variable: string, time: number): void {
    this.trackEvent("timing", category, `${variable}:${time}ms`);
  }

  getSessionDuration(): number {
    return Date.now() - this.startTime;
  }

  getEventCount(category: string, action?: string): number {
    const prefix = action ? `${category}:${action}` : category;
    return Object.entries(this.events)
      .filter(([key]) => key.startsWith(prefix))
      .reduce((sum, [, count]) => sum + count, 0);
  }

  getAllEvents(): Record<string, number> {
    return { ...this.events };
  }

  clear(): void {
    this.events = {};
    this.startTime = Date.now();
  }
}
