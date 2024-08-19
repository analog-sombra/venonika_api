import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { KnexModule } from 'nestjs-knex';
import KnexConfig from '../knexfile';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { CommentModule } from './event_comment/comment.module';
import { LikeModule } from './event_like/like.module';
import { GuildModule } from './guild/guild.module';
import { ResponseInterceptor } from './interceptor/responseInterceptor';
import { AllExceptionsFilter } from './lib/allExceptionFilter';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: KnexConfig,
    }),
    SessionModule,
    UserModule,
    EventModule,
    GuildModule,
    CategoryModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
