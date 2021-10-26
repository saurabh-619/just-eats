import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/Dish.entity';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  //PartialType makes all the properties from Dish Entity optional
  'name',
  'options',
  'price',
  'desc',
]) {
  @Field(() => Int)
  dishId: number;
}

@ObjectType()
export class EditDishOutput extends CoreOutput {}
