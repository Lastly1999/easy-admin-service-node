import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder().setTitle('easy-admin接口文档').setDescription('easy-admin信息化').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
    Logger.log('swagger api文档地址 http://127.0.0.1:5000/api-docs', 'SwaggerApiDoc');
}
