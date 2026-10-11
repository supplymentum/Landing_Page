import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { MediaModule } from '../media/media.module';
import { AdminProjectsController } from './admin-projects.controller';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [SupabaseModule, MediaModule],
  controllers: [ProjectsController, AdminProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
