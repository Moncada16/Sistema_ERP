import { rules } from '../../../middleware/validator';

// 📝 Esquema de validación para registro
export const registerSchema = {
  nombre: [
    rules.required,
    rules.minLength(2),
    rules.maxLength(50)
  ],
  email: [
    rules.required,
    rules.email
  ],
  telefono: [
    rules.required,
    rules.phone
  ],
  password: [
    rules.required,
    rules.password
  ],
  confirmPassword: [
    rules.required,
    rules.custom((value: string, { password }: any) => value === password)
  ]
};

// 🔐 Esquema de validación para login
export const loginSchema = {
  email: [
    rules.required,
    rules.email
  ],
  password: [
    rules.required
  ]
};