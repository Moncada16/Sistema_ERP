import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errorHandler';

// 🔍 Tipos de validación
type ValidationRule = (value: any, context?: any) => boolean | Promise<boolean>;
type ValidationSchema = Record<string, ValidationRule[]>;

// 📝 Reglas de validación comunes
export const rules = {
  // 🔤 Validaciones de texto
  required: (value: any) => value !== undefined && value !== null && value.toString().trim() !== '',
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  email: (value: string) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
  phone: (value: string) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value),
  
  // 🔢 Validaciones numéricas
  isNumber: (value: any) => !isNaN(Number(value)),
  min: (min: number) => (value: number) => Number(value) >= min,
  max: (max: number) => (value: number) => Number(value) <= max,
  
  // 📅 Validaciones de fecha
  isDate: (value: any) => !isNaN(Date.parse(value)),
  futureDate: (value: string) => new Date(value) > new Date(),
  pastDate: (value: string) => new Date(value) < new Date(),
  
  // 🔐 Validaciones de contraseña
  password: (value: string) => {
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  // 🎯 Validaciones personalizadas
  custom: (validationFn: (value: any, context?: any) => boolean) => (value: any, reqContext?: any) => validationFn(value, reqContext)
};

// 🛡️ Middleware de validación
export const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: Record<string, string[]> = {};

      // ✨ Validar cada campo según el esquema
      for (const [field, validations] of Object.entries(schema)) {
        const value = req.body[field];
        const fieldErrors: string[] = [];

        // 🔄 Ejecutar cada regla de validación
        for (const validation of validations) {
          const isValid = await Promise.resolve(validation(value, req.body));
          if (!isValid) {
            fieldErrors.push(getErrorMessage(validation));
          }
        }

        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      }

      // ❌ Si hay errores, lanzar excepción
      if (Object.keys(errors).length > 0) {
        throw new ValidationError(JSON.stringify(errors));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// 📝 Obtener mensaje de error según la regla
function getErrorMessage(validation: ValidationRule): string {
  if (validation === rules.required) return 'Este campo es obligatorio';
  if (validation === rules.email) return 'Email inválido';
  if (validation === rules.phone) return 'Teléfono inválido';
  if (validation === rules.password) return 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales';
  if (validation === rules.isNumber) return 'Debe ser un número';
  if (validation === rules.isDate) return 'Fecha inválida';
  if (validation === rules.futureDate) return 'La fecha debe ser futura';
  if (validation === rules.pastDate) return 'La fecha debe ser pasada';
  return 'Valor inválido';
}