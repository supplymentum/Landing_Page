import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SupabaseUser } from './supabase-auth.guard';

/**
 * Inyecta el usuario autenticado con Google que dejó SupabaseAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SupabaseUser => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { supabaseUser: SupabaseUser }>();

    return request.supabaseUser;
  },
);
