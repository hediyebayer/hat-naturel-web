import { z } from 'zod';

/**
 * İletişim formu validation şeması.
 * Hata mesajları kasıtlı olarak key formatında — UI tarafında
 * useTranslations('errors') ile çevrilir.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'minLength:2'),
  email: z
    .string()
    .trim()
    .email('invalidEmail'),
  phone: z
    .string()
    .trim()
    .min(10, 'invalidPhone'),
  message: z
    .string()
    .trim()
    .min(10, 'minLength:10'),
});

export type ContactSchemaInput = z.infer<typeof contactSchema>;
