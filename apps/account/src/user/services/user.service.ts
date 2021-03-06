import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  update(user: User): Observable<any> {
    return from(this.userRepo.update(user.id, user));
  }

  stream(userName: string): Observable<UserEntity> {
    const find = (user_name: string) =>
      from(
        this.userRepo.findOne({ where: { name: user_name } }).then((value) => {
          return value;
        }),
      );

    return find(userName);
  }
}
