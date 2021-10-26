import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/Category.entity';
import {
  PaginationInput,
  PaginationOutput,
} from './../../common/dtos/pagination.dto';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;
}
