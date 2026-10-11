import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { FaqController } from './faq.controller';
import { AdminFaqController } from './admin-faq.controller';
import { FaqService } from './faq.service';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [FaqController, AdminFaqController],
  providers: [FaqService],
})
export class FaqModule {}
