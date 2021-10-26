import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/User.entity';
import { GetAllCategoriesOutput } from './dtos/all-categories.dto';
import {
  CreateRestaurantDto,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantOutput,
  DeleteRestaurantDto,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantDto,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { Category } from './entities/Category.entity';
import { Restaurant } from './entities/Restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { RestaurantsInputDto, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInputDto, RestaurantOutput } from './dtos/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { Dish } from './entities/Dish.entity';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { EditDishOutput, EditDishInput } from './dtos/edit-dish.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/my-restaurant';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner']) // can be accessed inside the handler with Reflector
  createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestInput: CreateRestaurantDto,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(authUser, createRestInput);
  }

  @Query(() => MyRestaurantsOutput)
  @Role(['Owner'])
  myRestaurants(@AuthUser() authUser: User): Promise<MyRestaurantsOutput> {
    return this.restaurantService.myRestaurants(authUser);
  }

  @Query(() => MyRestaurantOutput)
  @Role(['Owner'])
  myRestaurant(
    @AuthUser() authUser: User,
    @Args('input') myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    return this.restaurantService.myRestaurant(authUser, myRestaurantInput);
  }

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurants(
    @AuthUser() authUser: User,
    @Args('input') editRestaurantInput: EditRestaurantDto,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurants(
      authUser,
      editRestaurantInput,
    );
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() authUser: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantDto,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      authUser,
      deleteRestaurantInput,
    );
  }

  @Query(() => RestaurantsOutput)
  allRestaurants(
    @Args('input') restaurantInput: RestaurantsInputDto,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantInput);
  }

  @Query(() => RestaurantOutput)
  restaurant(
    @Args('input') restaurantInput: RestaurantInputDto,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ) {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(() => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurantsByCategories(category);
  }

  @Query(() => GetAllCategoriesOutput)
  allCategories(): Promise<GetAllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query(() => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @AuthUser() authUser: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(authUser, createDishInput);
  }

  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  editDish(@AuthUser() authUser, @Args('input') editDishInput: EditDishInput) {
    return this.restaurantService.editDish(authUser, editDishInput);
  }

  @Mutation(() => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @AuthUser() authUser,
    @Args('input') deleteDishInput: DeleteDishInput,
  ) {
    return this.restaurantService.deleteDish(authUser, deleteDishInput);
  }
}
