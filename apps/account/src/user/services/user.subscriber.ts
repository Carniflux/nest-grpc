import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '@account/user/models/user.entity';
import { Subscriber } from 'rxjs';
import { UserDto } from '@account/user/models/user.dto';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  subscriber: Subscriber<UserEntity>[] = [];
  userDto = new UserDto();

  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  afterUpdate(event: UpdateEvent<UserEntity>): Promise<any> | void {
    event.connection
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: this.userDto.id })
      .getOne()
      .then((user) => {
        this.subscriber.map((value) => value.next(user));
      });
  }

  beforeUpdate(event: UpdateEvent<UserEntity>) {
    this.userDto.id = event.entity.id;
  }

  addSubscriber(subs: Subscriber<UserEntity>) {
    this.subscriber.push(subs);
  }
}
