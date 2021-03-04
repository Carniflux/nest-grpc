import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { User } from '../models/user.interface';
import { Observable, Subject } from 'rxjs';
import { UserByName } from '@account/user/models/user-by-name.interface';
import { UserDto } from '@account/user/models/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('EditUser', 'updateUser')
  update(user: User) {
    this.userService.update(user);
  }

  @GrpcStreamMethod('EditUser', 'stream')
  stream(message$: Observable<UserByName>): Observable<UserDto> {
    const user$ = new Subject<UserDto>();
    message$.subscribe({
      next: (value: User) =>
        this.userService.stream(value.name).subscribe({
          next: (value1) => {
            const userDto = new UserDto();
            userDto.id = value1.id;
            userDto.name = value1.name;
            userDto.password = value1.password;
            userDto.email = value1.email;
            console.log(userDto);
            return userDto;
          },
        }),
    });

    return user$.asObservable();
  }
}
