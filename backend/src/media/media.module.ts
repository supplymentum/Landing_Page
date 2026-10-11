import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AdminMediaController } from './admin-media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminMediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
