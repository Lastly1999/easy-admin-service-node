import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { TransformInterceptor } from './common/Interceptors/transform.interceptor';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
