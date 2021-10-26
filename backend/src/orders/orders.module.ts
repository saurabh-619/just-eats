import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/Dish.entity';
import { Restaurant } from 'src/restaurants/entities/Restaurant.entity';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Dish, Restaurant])],
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
