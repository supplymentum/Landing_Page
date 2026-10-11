import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase env vars not configured.');
      throw new Error('Supabase credentials missing');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Successfully logged in on Supabase.');
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
