import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { TransformInterceptor } from './common/Interceptors/transform.interceptor';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/v1');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await setupSwagger(app);
    await app.listen(5000);
}
bootstrap();
