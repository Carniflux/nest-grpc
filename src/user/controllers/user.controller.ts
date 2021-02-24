import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from '../models/user.interface';
import { from, Observable } from 'rxjs';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('EditUser', 'updateUser')
  update(user: User): Observable<User> {
    return from(this.userService.update(user));
  }
}
