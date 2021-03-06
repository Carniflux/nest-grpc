import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { User } from '../models/user.interface';
import { Observable, of, Subject } from 'rxjs';
import { UserByName } from '@account/user/models/user-by-name.interface';
import { UserDto } from '@account/user/models/user.dto';
import { map, mergeMap } from 'rxjs/operators';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('EditUser', 'updateUser')
  update(user: User) {
    this.userService.update(user);
    this.stream(of({ name: user.name }));
  }

  @GrpcStreamMethod('EditUser', 'stream')
  stream(message$: Observable<UserByName>): Observable<UserDto> {
    const userDto = new UserDto();
    const user$ = of(userDto);
    const result = user$.pipe(
      mergeMap(() =>
        message$.pipe(
          mergeMap((userName) =>
            this.userService.stream(userName.name).pipe(
              map((userEn) => {
                userDto.id = userEn.id;
                userDto.name = userEn.name;
                userDto.password = userEn.password;
                userDto.email = userEn.email;
                return userDto;
              }),
            ),
          ),
        ),
      ),
    );
    result.subscribe();
    return result;
  }
}
