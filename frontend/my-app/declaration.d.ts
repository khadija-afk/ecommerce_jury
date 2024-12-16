declare module "js-cookie" {
    const Cookies: {
      get(name: string): string | undefined;
      set(name: string, value: string, options?: { expires?: number | Date; path?: string; domain?: string; secure?: boolean; sameSite?: string }): void;
      remove(name: string, options?: { path?: string; domain?: string }): void;
    };
    export default Cookies;
  }
  