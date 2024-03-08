import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  // Swagger Setup

  const config = new DocumentBuilder().addCookieAuth()
    .setTitle('Google Classroom Clone')
    .setDescription('The Google Classroom Clone API documentation')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.BACKEND_PORT).then(() => {
    console.log(`Server is running on ${process.env.MODE === "development" ? `http://localhost:${process.env.BACKEND_PORT}` : `https://${process.env.BACKEND_HOST}`}`)
  });
}
bootstrap();
