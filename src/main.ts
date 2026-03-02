import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);

  // app.useGlobalFilters(new AllExseptionsFilter());

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Mini Job Processing Platform')
    .setDescription(
      'API for creating, managing, and processing background jobs with authentication, role-based access, and metrics',
    )
    .setVersion('1.0')
    .addTag(
      'Tasks, Background Jobs, NestJS, BullMQ, Authentication, Metrics, Rate Limiting',
    )
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
  });
}
bootstrap();
