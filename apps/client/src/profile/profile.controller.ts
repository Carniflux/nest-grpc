import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Put,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from '@account/user/models/user.interface';
import { UserDto } from '@account/user/models/user.dto';

interface UserServiceI {
  findUser(user: User): Observable<UserDto>;
  updateUser(user: User);
}

@Controller('profile')
export class ProfileController implements OnModuleInit {
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  private userService: UserServiceI;

  onModuleInit() {
    this.userService = this.client.getService<UserServiceI>('EditUser');
  }

  @Get(':id')
  getUser(@Param('id') id: number): Observable<UserDto> {
    console.log(id);
    return this.userService.findUser({ id: id });
  }

  // @Put('editUser')
  // updateUser(@Req) {}
}
