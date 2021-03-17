import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { from, Observable, of } from 'rxjs';
import { UserDto } from '@account/user/models/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  update(user: UserDto) {
    from(this.userRepo.update(user.id, user));
  }

  stream(userId: number): Observable<UserEntity> {
    return from(this.userRepo.findOne({ where: { id: userId } }));
  }
}
