import { Request, Response, NextFunction } from 'express';

// 🎯 Tipo para funciones de controlador
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * 🛡️ Wrapper para manejar errores en funciones asíncronas
 * Elimina la necesidad de try/catch en cada controlador
 * 
 * @param fn Función asíncrona a ejecutar
 * @returns Función con manejo de errores
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};