import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @CreateDateColumn() // automatically sets value when created
  @Field((type) => Date)
  createdAt: Date;

  @CreateDateColumn() // automatically sets value when updated
  @Field((type) => Date)
  updatedAt: Date;
}
