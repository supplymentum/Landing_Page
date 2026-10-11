import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminAreasController } from './admin-areas.controller';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [SupabaseModule, MediaModule],
  controllers: [AreasController, AdminAreasController],
  providers: [AreasService],
  exports: [AreasService],
})
export class AreasModule {}
