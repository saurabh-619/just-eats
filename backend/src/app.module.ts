import { Module } from '@nestjs/common/decorators';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { Order } from './orders/entities/Order.entity';
import { OrderItem } from './orders/entities/OrderItem.entity';
import { OrdersModule } from './orders/orders.module';
import { Category } from './restaurants/entities/Category.entity';
import { Dish } from './restaurants/entities/Dish.entity';
import { Restaurant } from './restaurants/entities/Restaurant.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { User } from './users/entities/User.entity';
import { Verification } from './users/entities/Verification.entity';
import { UsersModule } from './users/users.module';
import { dotenvConfig, graphqlConfig } from './utils/configs';
import { __dev__, __prod__ } from './utils/constants';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/Payment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot(dotenvConfig),
    GraphQLModule.forRoot(graphqlConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: __dev__,
      logging: __dev__,
      ...(__prod__ && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
        Payment,
      ],
    }),
    JwtModule.forRoot({ privateKey: process.env.PRIVATE_KEY }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      from: process.env.MAILGUN_FROM,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    UploadsModule,
  ],
  providers: [],
})
export class AppModule {}
