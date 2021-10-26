import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
// PartialType makes all properties optional
export class EditRestaurantDto extends PartialType(CreateRestaurantDto) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
