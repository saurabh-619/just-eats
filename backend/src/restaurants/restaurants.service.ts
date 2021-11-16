import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { EditProfileInputDto } from 'src/users/dtos/edit-profile.dto';
import { User } from 'src/users/entities/User.entity';
import { ILike, Like, Raw, Repository } from 'typeorm';
import { GetAllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
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
import { CategoryRepository } from './repositories/category.repository';
import { RestaurantsInputDto, RestaurantsOutput } from './dtos/restaurants.dto';
import { RestaurantInputDto, RestaurantOutput } from './dtos/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { QUERY_LIMIT_RESTAURANTS } from 'src/utils/constants';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { Dish } from './entities/Dish.entity';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/my-restaurant';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(CategoryRepository)
    private readonly categoryRepo: CategoryRepository, // custom repo
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestInput: CreateRestaurantDto,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurantRepo.create(createRestInput);
      newRestaurant.owner = owner;

      const category: Category = await this.categoryRepo.getOrCreate(
        createRestInput.categoryName,
      );

      newRestaurant.category = category;
      const rest = await this.restaurantRepo.save(newRestaurant);
      console.log({ rest });
      return { ok: true, restaurantId: newRestaurant.id };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Something went wrong' };
    }
  }

  async myRestaurants(authUser: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurantRepo.find({
        where: {
          owner: authUser,
        },
        relations: ['category'],
      });

      return {
        ok: true,
        restaurants,
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: "Couldn't load your restaurants" };
    }
  }

  async myRestaurant(
    authUser: User,
    { id: restaurantId }: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    console.log({ authUser });
    try {
      const restaurant = await this.restaurantRepo.findOne(
        {
          id: restaurantId,
          owner: authUser,
        },
        {
          relations: ['category', 'menu', 'orders'],
        },
      );
      return {
        ok: true,
        restaurant,
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: "Couldn't load your restaurant" };
    }
  }

  async editRestaurants(
    authUser: User,
    editRestaurantInput: EditRestaurantDto,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepo.findOne(
        editRestaurantInput.restaurantId,
      );

      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }

      if (authUser.id !== restaurant.ownerId) {
        return { ok: false, error: 'You are not owner of this restaurant' };
      }

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categoryRepo.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurantRepo.save([
        {
          id: editRestaurantInput.restaurantId, // In this way you have to send id, otherwise typworm will create new doc
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return { ok: true };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Something went wrong!' };
    }
  }

  async deleteRestaurant(
    authUser: User,
    { restaurantId }: DeleteRestaurantDto,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurantRepo.findOne(restaurantId);

      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }

      if (authUser.id !== restaurant.ownerId) {
        return { ok: false, error: 'You are not owner of this restaurant' };
      }

      await this.restaurantRepo.delete(restaurantId);
      return { ok: true };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Something went wrong!' };
    }
  }

  async allCategories(): Promise<GetAllCategoriesOutput> {
    try {
      const categories = await this.categoryRepo.find({});
      console.log({ rest: categories.map((c) => c.restaurants) });
      return { ok: true, categories };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Something went wrong!' };
    }
  }

  async countRestaurantsByCategories(category: Category): Promise<number> {
    return this.restaurantRepo.count({ category });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categoryRepo.findOne(
        {
          slug,
        },
        { relations: ['restaurants'] },
      );

      if (!category) {
        return { ok: false, error: 'Category not found' };
      }

      const restaurants = await this.restaurantRepo.find({
        where: {
          category,
        },
        take: 5,
        skip: (page - 1) * 5,
        order: {
          isPromoted: 'DESC',
        },
      });

      category.restaurants = restaurants;

      const totalResults = await this.countRestaurantsByCategories(category);
      return {
        ok: true,
        category,
        totalItems: totalResults,
        totalPages: Math.ceil(totalResults / 5),
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Something went wrong!' };
    }
  }

  async allRestaurants({
    page,
  }: RestaurantsInputDto): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] =
        await this.restaurantRepo.findAndCount({
          skip: (page - 1) * QUERY_LIMIT_RESTAURANTS,
          take: QUERY_LIMIT_RESTAURANTS,
          order: {
            isPromoted: 'DESC',
          },
          relations: ['category'],
        });

      return {
        ok: true,
        restaurants,
        totalItems: totalResults,
        totalPages: Math.ceil(totalResults / QUERY_LIMIT_RESTAURANTS),
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Could not load restaurants' };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInputDto): Promise<RestaurantOutput> {
    console.log('findRestaurantById');
    try {
      const restaurant = await this.restaurantRepo.findOne(restaurantId, {
        relations: ['category', 'owner', 'menu'],
      });
      if (!restaurant) {
        return { ok: false, error: 'Restaurant not found' };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Could not find restaurant' };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalItems] = await this.restaurantRepo.findAndCount({
        where: {
          // name: ILike(`%${query}%`), ILIKE is case-insensitive
          // OR
          name: Raw((name) => `${name} ILIKE '%${query}%'`),
        },
        skip: (page - 1) * QUERY_LIMIT_RESTAURANTS,
        take: QUERY_LIMIT_RESTAURANTS,
      });

      return {
        ok: true,
        totalItems,
        totalPages: Math.ceil(totalItems / QUERY_LIMIT_RESTAURANTS),
        restaurants: restaurants,
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  async createDish(
    authUser: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurantRepo.findOne(
        createDishInput.restaurantId,
      );

      if (!restaurant) {
        return { ok: false, error: 'Restaurant could not found' };
      }

      if (authUser.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'You are not authorized to complete this request ',
        };
      }

      const dish = await this.dishRepo.save(
        this.dishRepo.create({ ...createDishInput, restaurant }),
      );

      console.log({ dish });
      return { ok: true };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  async editDish(
    authUser: User,
    editDishInput: EditDishInput, // do not destructure as undefined args(in any) can't be staored in db
  ): Promise<EditDishOutput> {
    try {
      const dish = await this.dishRepo.findOne(editDishInput.dishId, {
        relations: ['restaurant'],
      });

      // Defensice prog (to catch all errros possible)
      if (!dish) {
        return { ok: false, error: 'Dish could not found' };
      }

      if (dish.restaurant.ownerId !== authUser.id) {
        return {
          ok: false,
          error: 'You are not authorized to complete this request ',
        };
      }

      await this.dishRepo.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  async deleteDish(
    authUser: User,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishRepo.findOne(dishId, {
        relations: ['restaurant'],
      });

      // Defensice prog (to catch all errros possible)
      if (!dish) {
        return { ok: false, error: 'Dish could not found' };
      }

      if (dish.restaurant.ownerId !== authUser.id) {
        return {
          ok: false,
          error: 'You are not authorized to complete this request ',
        };
      }

      await this.dishRepo.delete(dishId);
      return { ok: true };
    } catch (e) {
      console.log({ error: e.message });
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }
}
