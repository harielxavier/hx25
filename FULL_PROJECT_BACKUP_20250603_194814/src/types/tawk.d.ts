interface TawkToAPI {
  [key: string]: any;
}

declare global {
  interface Window {
    Tawk_API?: TawkToAPI;
    Tawk_LoadStart?: Date;
  }
}

export {};
