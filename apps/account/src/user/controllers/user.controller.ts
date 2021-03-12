import { Controller, Inject } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { User } from '../models/user.interface';
import { Observable, of, Subject } from 'rxjs';
import { UserDto } from '@account/user/models/user.dto';
import { filter, map, mergeMap } from 'rxjs/operators';
import { UserSubscriber } from '@account/user/services/user.subscriber';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(UserSubscriber)
    private userSubscriber: UserSubscriber,
  ) {}

  @GrpcMethod('EditUser', 'updateUser')
  update(user: User) {
    this.userService.update(user);
  }

  @GrpcStreamMethod('EditUser', 'stream')
  stream(message$: Observable<User>): Observable<UserDto> {
    const userDto = new UserDto();
    const user$ = new Subject<UserDto>();
    const sub$ = new Observable<UserDto>((subscriber) => {
      this.userSubscriber.addSubscriber(subscriber);
      message$.pipe(map((userId) => (userDto.id = userId.id)));
    }).pipe(
      map((user) => user$.next(filter<UserDto>(() => user.id === userDto.id))),
    );

    const getUser$ = of(message$).pipe(
      mergeMap((obs) =>
        obs.pipe(
          mergeMap((user) =>
            this.userService.stream(user.id).pipe(
              map((userEn) => {
                const userDto = new UserDto();
                userDto.id = userEn.id;
                userDto.name = userEn.name;
                userDto.password = userEn.password;
                userDto.email = userEn.email;
                user$.next(userDto);
              }),
            ),
          ),
        ),
      ),
    );
    getUser$.subscribe();
    sub$.subscribe();
    return user$.asObservable();
  }
}
