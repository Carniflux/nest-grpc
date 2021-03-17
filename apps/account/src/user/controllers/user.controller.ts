import { Controller, Inject } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';
import { UserDto } from '@account/user/models/user.dto';
import { map } from 'rxjs/operators';
import { UserSubscriber } from '@account/user/services/user.subscriber';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(UserSubscriber)
    private userSubscriber: UserSubscriber,
  ) {}

  @GrpcMethod('EditUser', 'updateUser')
  update(dto: UserDto) {
    this.userService.update(dto);
  }

  @GrpcMethod('EditUser', 'stream')
  stream({ id }: UserDto): Observable<UserDto> {
    const user$ = new Subject<UserDto>();
    const sub$ = new Observable<UserDto>((subscriber) => {
      this.userSubscriber.addSubscriber(subscriber);
    }).pipe(
      map((user) => {
        if (user.id === id) {
          user$.next(user);
        }
      }),
    );

    const getUser$ = this.userService
      .stream(id)
      .pipe(map((userEn) => user$.next(userEn)));
    getUser$.subscribe();
    sub$.subscribe();
    /* Течёт память */
    return user$.asObservable();
  }
}
