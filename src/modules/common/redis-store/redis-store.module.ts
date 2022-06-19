import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
                password: configService.get<number>('redis.password'),
                db: configService.get<number>('redis.db'),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class RedisStoreModule {}
