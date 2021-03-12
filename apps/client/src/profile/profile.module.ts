import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), 'libs/proto/user.proto'),
        },
      },
    ]),
  ],
  controllers: [ProfileController],
})
export class ProfileModule {}
