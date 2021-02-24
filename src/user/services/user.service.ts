import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { from, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  update(user: User): Observable<User> {
    const newUser = new UserEntity();
    newUser.name = user.name;
    newUser.password = user.password;
    newUser.email = user.email;
    return from(this.userRepo.save(newUser));
  }
}
