import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';

export interface SupabaseUser {
  id: string;
  email: string;
  full_name?: string;
}

/**
 * Valida el access token de Supabase Auth (login con Google) que el
 * frontend envía en el header Authorization, y deja al usuario
 * disponible en request.supabaseUser.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { supabaseUser?: SupabaseUser }>();

    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Debes iniciar sesión con Google para continuar.',
      );
    }

    const token = authHeader.slice('Bearer '.length).trim();

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user?.email) {
      throw new UnauthorizedException('Tu sesión no es válida o expiró.');
    }

    const fullName = data.user.user_metadata?.full_name as string | undefined;

    request.supabaseUser = {
      id: data.user.id,
      email: data.user.email,
      full_name: fullName,
    };

    return true;
  }
}
