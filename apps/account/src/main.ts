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
    url: '0.0.0.0:30101',
    package: 'user',
    protoPath: join(process.cwd(), 'libs/proto/user.proto'),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    microserviceOptions,
  );

  await app.listenAsync();
}
bootstrap();
