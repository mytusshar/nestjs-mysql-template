import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { winstonLoggerService } from './config/logger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: winstonLoggerService() });
    app.useGlobalPipes(new ValidationPipe());
    const port = process.env.PORT || 3000;
    const config = new DocumentBuilder()
        .setTitle('NestJs Service')
        .setDescription('Backend APIs for NestJs application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors();
    await app.listen(port);
    Logger.log(` Running on Port ${port}`);
}
bootstrap();
