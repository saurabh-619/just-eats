import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/Core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/Restaurant.entity';
import { Order } from 'src/orders/entities/Order.entity';
import { Payment } from 'src/payments/entities/Payment.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}

// Create Graphql enum
registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  email: string;

  @Column({ select: false }) // never comes as o/p from findOne method
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ default: false })
  @Field(() => Boolean)
  @IsBoolean()
  verified: boolean;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  @Field((type) => UserRole) // for graphql we have to register enum first
  role: UserRole; //client, owner, delivery

  @Field(() => [Restaurant])
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.driver)
  rides: Order[];

  @Field(() => [Payment])
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  // Events
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        // do not create the hash unless user has changed password
        this.password = await bcrypt.hash(this.password, 10);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException("Couldn't create account");
    }
  }

  // Normal class functions
  async checkPassword(inputPassword: string) {
    try {
      const ok = await bcrypt.compare(inputPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException("Couldn't login into the account");
    }
  }
}
