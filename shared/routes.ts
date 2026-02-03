import { z } from 'zod';
import { insertProcedureSchema, procedures, practitioners, dossiers } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  procedures: {
    list: {
      method: 'GET' as const,
      path: '/api/procedures',
      responses: {
        200: z.array(z.custom<typeof procedures.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/procedures/:id',
      responses: {
        200: z.custom<typeof procedures.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/procedures',
      input: insertProcedureSchema,
      responses: {
        201: z.custom<typeof procedures.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/procedures/:id',
      input: insertProcedureSchema.partial(),
      responses: {
        200: z.custom<typeof procedures.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/procedures/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  practitioners: {
    list: {
      method: 'GET' as const,
      path: '/api/practitioners',
      responses: {
        200: z.array(z.custom<typeof practitioners.$inferSelect>()),
      },
    },
  },
  dossiers: {
    list: {
      method: 'GET' as const,
      path: '/api/dossiers',
      responses: {
        200: z.array(z.custom<typeof dossiers.$inferSelect>()),
      },
    },
  },
};

// ============================================
// URL HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type ProcedureInput = z.infer<typeof api.procedures.create.input>;
export type ProcedureResponse = z.infer<typeof api.procedures.create.responses[201]>;
