import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from '@account/user/models/user.entity';
import { Subscriber } from 'rxjs';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  subscriber: Subscriber<UserEntity>[] = [];

  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  afterUpdate(event: UpdateEvent<UserEntity>) {
    console.log(`AFTER ENTITY LOADED: `, event.entity);
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): Promise<any> | void {
    this.subscriber.map((value) => value.next(event.entity));
  }

  addSubscriber(subs: Subscriber<UserEntity>) {
    this.subscriber.push(subs);
  }
}
