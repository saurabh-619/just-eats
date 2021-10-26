import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/Core.entity';
import { Restaurant } from 'src/restaurants/entities/Restaurant.entity';
import { User } from 'src/users/entities/User.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field(() => String)
  @Column()
  transactionId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant) // if we cate about ManyToOne, we dont have to write OneToMany but if we care about OneToMany then we have to write ManyToOne
  restaurant: Restaurant;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
