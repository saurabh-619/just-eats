import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/Core.entity';
import { Order } from 'src/orders/entities/Order.entity';
import { Payment } from 'src/payments/entities/Payment.entity';
import { User } from 'src/users/entities/User.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './Category.entity';
import { Dish } from './Dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((is) => String)
  @Column()
  @IsString()
  @MinLength(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL', // on category deleted, set the category=NULL in this restaurant doc too
  })
  category: Category;

  // on owner deleted, delete this restaurant doc too (as no owner - no restaurant)
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants, { onDelete: 'CASCADE' })
  owner: User;

  @Field(() => [Dish], { nullable: true })
  @OneToMany(() => Dish, (dish) => dish.restaurant)
  menu?: Dish[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.restaurant)
  orders?: Order[];

  // @Field(() => [Payment])
  // @OneToMany(() => Payment, (payment) => payment.restaurant)
  // payments: Payment[];

  @Field(() => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntill: Date;

  // Get owner id
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;
}
