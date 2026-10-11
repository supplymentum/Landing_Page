import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminRolesController } from './admin-roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminRolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
