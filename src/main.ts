import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClientOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

const microserviceOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(__dirname, '../src/user/user.proto'),
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(microserviceOptions);
  app.startAllMicroservices();
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
