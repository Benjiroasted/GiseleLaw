import { z } from 'zod';
import {
  insertProcedureSchema,
  procedures,
  practitioners,
  dossiers,
  cnbDirectory,
  type InsertDossier,
} from './schema';

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
// LAWYER APPLICATION SCHEMA
// ============================================
export const lawyerApplicationSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  email: z.string().email('Email invalide'),
  phone: z.string().max(30).optional().or(z.literal('')),
  barreau: z.string().min(1, 'Barreau requis'),
  specialties: z.array(z.string()).default([]),
  locationCity: z.string().max(100).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  cnbMatchId: z.number().int().positive().optional().nullable(),
});

export type LawyerApplicationInput = z.infer<typeof lawyerApplicationSchema>;

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
    create: {
      method: 'POST' as const,
      path: '/api/dossiers',
      input: z.custom<InsertDossier>(),
      responses: {
        201: z.custom<typeof dossiers.$inferSelect>(),
        401: z.string(),
      },
    },
  },
  cnb: {
    barreaux: {
      method: 'GET' as const,
      path: '/api/cnb/barreaux',
      responses: {
        200: z.array(z.string()),
      },
    },
    match: {
      method: 'GET' as const,
      path: '/api/cnb/match',
      responses: {
        200: z.object({
          status: z.enum(['match_exact', 'match_ambiguous', 'no_match']),
          candidates: z.array(z.custom<typeof cnbDirectory.$inferSelect>()),
        }),
      },
    },
  },
  lawyers: {
    apply: {
      method: 'POST' as const,
      path: '/api/lawyers/apply',
      input: lawyerApplicationSchema,
      responses: {
        201: z.object({
          practitionerId: z.number(),
          verificationStatus: z.string(),
          cnbMatched: z.boolean(),
        }),
        400: errorSchemas.validation,
        409: errorSchemas.validation,
      },
    },
  },
  admin: {
    listApplications: {
      method: 'GET' as const,
      path: '/api/admin/lawyers',
      responses: {
        200: z.array(
          z.object({
            practitioner: z.custom<typeof practitioners.$inferSelect>(),
            cnbCandidate: z.custom<typeof cnbDirectory.$inferSelect>().nullable(),
            cnbAutoMatch: z.object({
              status: z.enum(['match_exact', 'match_ambiguous', 'no_match']),
              candidates: z.array(z.custom<typeof cnbDirectory.$inferSelect>()),
            }),
          }),
        ),
        401: errorSchemas.validation,
        403: errorSchemas.validation,
      },
    },
    approve: {
      method: 'POST' as const,
      path: '/api/admin/lawyers/:id/approve',
      input: z.object({ cnbMatchId: z.number().int().positive().nullable().optional() }),
      responses: {
        200: z.custom<typeof practitioners.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    reject: {
      method: 'POST' as const,
      path: '/api/admin/lawyers/:id/reject',
      input: z.object({ reason: z.string().min(1).max(500) }),
      responses: {
        200: z.custom<typeof practitioners.$inferSelect>(),
        404: errorSchemas.notFound,
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
