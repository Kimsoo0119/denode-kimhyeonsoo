import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SuccessInterceptor } from '@core/interceptors/success.interceptor';
import { CustomExceptionFilter } from '@core/filters/custom-exception.filter';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { UnauthorizedExceptionFilter } from '@core/filters/unauthorized-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new SuccessInterceptor(),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new CustomExceptionFilter(),
    new UnauthorizedExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('DENODE API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
