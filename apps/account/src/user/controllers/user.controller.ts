import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { User } from '../models/user.interface';
import { Observable, Subject } from 'rxjs';
import { UserByName } from '@account/user/models/user-by-name.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('EditUser', 'updateUser')
  update(user: User) {
    this.userService.update(user);
  }

  @GrpcStreamMethod('EditUser', 'stream')
  stream(message$: Observable<UserByName>): Observable<Observable<User>> {
    const user$ = new Subject<Observable<User>>();
    const onNext = (userByName: UserByName) => {
      const item = this.userService.stream(userByName.name);
      user$.next(item);
    };
    const onComplete = () => user$.complete();
    message$.subscribe(onNext, null, onComplete);

    return user$.asObservable();
  }
}
