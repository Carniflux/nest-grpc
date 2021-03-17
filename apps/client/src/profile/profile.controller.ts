import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UserDto } from '@account/user/models/user.dto';

interface UserServiceI {
  findUser(userDto: UserDto): Observable<UserDto>;
  updateUser(user: UserDto);
}

@Controller('profile')
export class ProfileController implements OnModuleInit {
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  private userService: UserServiceI;

  onModuleInit() {
    this.userService = this.client.getService<UserServiceI>('EditUser');
  }

  @Post('updateUser')
  getUser(@Body() user: UserDto) {
    console.log(user);
    this.userService.updateUser(user);
  }

  // @Put('editUser')
  // updateUser(@Req) {}
}
