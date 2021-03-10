import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { from, Observable, of } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  update(user: User): Observable<User> {
    from(this.userRepo.update(user.id, user));
    return of(user);
  }

  stream(userId: number): Observable<UserEntity> {
    return from(this.userRepo.findOne({ where: { id: userId } }));
  }
}
