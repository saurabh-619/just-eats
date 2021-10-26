import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { Restaurant } from '../entities/Restaurant.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateRestaurantDto extends PickType(
  Restaurant,
  ['name', 'coverImg', 'address'],
  InputType, // converts Resturant type to InputType as CreateRestaurantDto is InputType
) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  restaurantId?: number;
}
