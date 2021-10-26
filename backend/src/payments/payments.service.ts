import { Injectable } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/Restaurant.entity';
import { User } from 'src/users/entities/User.entity';
import { LessThan, Repository } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payments.dto';
import { Payment } from './entities/Payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    authUser: User,
    { restaurantId, transactionId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurantRepo.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: "Couldn't found the restaurant",
        };
      }

      if (restaurant.ownerId !== authUser.id) {
        return {
          ok: false,
          error: "You're not authourized to make this request",
        };
      }
      const payment = await this.paymentRepo.save(
        this.paymentRepo.create({ transactionId, user: authUser, restaurant }),
      );

      restaurant.isPromoted = true;
      const date = new Date();

      date.setDate(date.getDate() + 7);
      console.log({ date });
      restaurant.promotedUntill = date;

      await this.restaurantRepo.save([
        {
          id: restaurantId,
          ...restaurant,
        },
      ]);

      return {
        ok: true,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: 'Something went wrong. Payment failed to save.',
      };
    }
  }

  async getPayments(authUser: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.paymentRepo.find({
        where: {
          user: authUser,
        },
      });
      return {
        ok: true,
        payments,
      };
    } catch (e) {
      console.log({ error: e.message });
      return {
        ok: false,
        error: 'Something went wrong. Payment failed to save.',
      };
    }
  }

  @Interval(10000000)
  async checkPromotedRestaurants() {
    console.log("Checking restaurants' subscription");

    const restaurants = await this.restaurantRepo.find({
      isPromoted: true,
      promotedUntill: LessThan(new Date()),
    });

    console.log({ restaurants });

    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntill = null;
      await this.restaurantRepo.save(restaurant);
    });
  }
}
