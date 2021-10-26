import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './../../common/entities/Core.entity';
import { Dish, DishOptions } from 'src/restaurants/entities/Dish.entity';

@InputType('OrderItemOptionsInputType')
@ObjectType()
export class OrderItemOption {
  @Field(() => String)
  name: string;

  // choice chosen by user from all available choice => e.g,dish choices = ["Veg", "Non-Veg"], uses chooses choice="Veg"
  @Field(() => String, { nullable: true })
  choice?: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class OrderItem extends CoreEntity {
  @Field(() => Dish)
  @ManyToOne(() => Dish, { nullable: true, onDelete: 'SET NULL' }) // we dont care about inverse relationship
  dish: Dish;

  // Options that user cho0ses
  @Field(() => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
