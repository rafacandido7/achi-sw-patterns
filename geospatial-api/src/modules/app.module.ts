import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule, GroupsModule, PermissionsModule, UsersModule } from '.'
import { AuthGuard } from './auth/auth.guard'

import { GlobalExceptionFilter } from '../shared/filters/global-exception.filter'
import { VehiclesModule } from './vehicles/vehicles.module'
import { CacheModule } from './cache/cache.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    GroupsModule,
    PermissionsModule,
    UsersModule,
    VehiclesModule,
    CacheModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
