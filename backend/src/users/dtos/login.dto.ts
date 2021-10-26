import { ObjectType, PickType, InputType, Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/User.entity';

@InputType()
export class LoginInputDto extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutputDto extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
