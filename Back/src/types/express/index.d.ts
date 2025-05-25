import 'express'

declare module 'express' {
  export interface Request {
    user?: {
      userId: number;
      empresaId: number | null;
      rol: string;
    }
  }
}
export {};