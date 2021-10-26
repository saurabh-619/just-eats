import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/Dish.entity';
import { Restaurant } from 'src/restaurants/entities/Restaurant.entity';
import { User, UserRole } from 'src/users/entities/User.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order, OrderStatus } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import {
  NEW_COOKED_ORDER,
  NEW_ORDER_UPDATE,
  NEW_PENDING_ORDER,
  PUB_SUB,
} from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createOrder(
    authUser: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurantRepo.findOne(restaurantId);

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      let orderPrice = 0;
      const createdOrderItems: OrderItem[] = [];

      // returning error inside forEach doesnt work as it just comes out of function hence we will use for of
      for (const orderItem of items) {
        const dish = await this.dishRepo.findOne(orderItem.dishId);

        if (!dish) {
          // abort the whole operation
          return {
            ok: false,
            error: "Dish couldn't found",
          };
        }

        orderPrice += dish.price;

        for (const chosenOption of orderItem.options) {
          const availableDishOption = dish.options.find(
            (avaiDishOption) => avaiDishOption.name === chosenOption.name,
          );
          if (availableDishOption) {
            if (availableDishOption.extra) {
              orderPrice += availableDishOption.extra;
            } else {
              const availableChoice = availableDishOption.choices.find(
                (availChoice) => availChoice.name === chosenOption.choice,
              );
              orderPrice += availableChoice.extra || 0;
            }
          }
        }

        const newOrderItem = await this.orderItemRepo.save(
          this.orderItemRepo.create({ dish, options: orderItem.options }),
        );
        createdOrderItems.push(newOrderItem);
      }

      const order = await this.orderRepo.save(
        this.orderRepo.create({
          customer: authUser,
          restaurant,
          total: orderPrice,
          items: createdOrderItems,
        }),
      );

      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrder: { order, ownerId: restaurant.ownerId },
      });
      return {
        ok: true,
        orderId: order.id,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: "Couldn't place the order",
      };
    }
  }

  async getOrders(
    authUser: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[] = [];
      if (authUser.role === UserRole.Client) {
        orders = await this.orderRepo.find({
          where: {
            customer: authUser,
            ...(status && { status }),
          },
          relations: ['items', 'items.dish'],
        });
        console.log({ orders });
      } else if (authUser.role === UserRole.Delivery) {
        orders = await this.orderRepo.find({
          where: {
            driver: authUser,
            ...(status && { status }),
          },
          relations: ['dish', 'items'],
        });
      } else if (authUser.role === UserRole.Owner) {
        const restaurants = await this.restaurantRepo.find({
          where: {
            owner: authUser,
          },
          relations: ['orders', 'orders.items'],
        });

        orders = restaurants.map((rest) => rest.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }

        console.log({ orders });
      }

      return {
        ok: true,
        orders,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: "Couldn't load the orders",
      };
    }
  }

  canSeeOrder(authUser: User, order: Order): boolean {
    let canSee = true;
    if (authUser.role === UserRole.Client && order.customerId !== authUser.id) {
      canSee = false;
    }

    if (authUser.role === UserRole.Delivery && order.driverId !== authUser.id) {
      canSee = false;
    }

    if (
      authUser.role === UserRole.Owner &&
      order.restaurant.ownerId !== authUser.id
    ) {
      canSee = false;
    }
    return canSee;
  }

  async getOrder(
    authUser: User,
    { id: OrderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orderRepo.findOne(OrderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: "Couldn't found the order",
        };
      }

      if (!this.canSeeOrder(authUser, order)) {
        return {
          ok: false,
          error: "You're not authorized for this request",
        };
      }

      return {
        ok: true,
        order,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: "Couldn't load the order",
      };
    }
  }

  async editOrder(
    authUser: User,
    { id: orderId, status }: EditOrderInput,
  ): Promise<EditOrderOutput> {
    try {
      const order = await this.orderRepo.findOne(orderId, {
        relations: ['items', 'items.dish'],
      });
      if (!order) {
        return {
          ok: false,
          error: "Couldn't found the order",
        };
      }

      if (!this.canSeeOrder(authUser, order)) {
        return {
          ok: false,
          error: "You're not authorized for this request",
        };
      }

      let canEdit = true;
      if (authUser.role === UserRole.Client) {
        canEdit = false;
      }

      if (authUser.role === UserRole.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false;
        }
      }

      if (authUser.role === UserRole.Delivery) {
        if (
          status !== OrderStatus.PickedUp &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }
      if (!canEdit) {
        return {
          ok: false,
          error: "You're not authorized to edit",
        };
      }
      const updates = await this.orderRepo.save([
        {
          id: orderId,
          status,
        },
      ]);

      if (authUser.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          // Update all delivery boyz
          await this.pubSub.publish(NEW_COOKED_ORDER, {
            cookedOrder: { ...order, status },
          });
        }
      }
      // Update all concerned users
      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdate: { ...order, status },
      });

      return {
        ok: true,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: "Couldn't edit the order",
      };
    }
  }

  async takeOrder(
    authUser: User,
    { id: orderId }: TakeOrderInput,
  ): Promise<TakeOrderOutput> {
    try {
      const order = await this.orderRepo.findOne(orderId, {
        relations: ['items', 'items.dish'],
      });
      if (!order) {
        return {
          ok: false,
          error: "Couldn't found the order",
        };
      }

      if (order.driver) {
        return { ok: false, error: 'This order already picked up by a driver' };
      }

      await this.orderRepo.save([
        {
          id: orderId,
          driver: authUser,
        },
      ]);

      await this.pubSub.publish(NEW_ORDER_UPDATE, {
        orderUpdate: { ...order, driver: authUser },
      });

      return {
        ok: true,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: "Couldn't took the order",
      };
    }
  }
}
