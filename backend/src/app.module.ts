import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';
import { ExecutivesModule } from './executives/executives.module';
import { RolesModule } from './roles/roles.module';
import { MediaModule } from './media/media.module';
import { FaqModule } from './faq/faq.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { SettingsModule } from './settings/settings.module';

import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

import { ApplicationController } from './application/application.controller';
import { ApplicationService } from './application/application.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    AreasModule,
    ExecutivesModule,
    RolesModule,
    MediaModule,
    FaqModule,
    EventsModule,
    ProjectsModule,
    SettingsModule,
  ],
  controllers: [AppController, AdminController, ApplicationController],
  providers: [AppService, AdminService, ApplicationService],
})
export class AppModule {}
