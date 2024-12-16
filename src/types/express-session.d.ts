import { SessionData } from 'express-session';

declare module 'express-session' {
  interface Session {
    user?: {
      username: string;
      password: string;
    };
    destroy: (callback: (err: any) => void) => void; 
  }
}