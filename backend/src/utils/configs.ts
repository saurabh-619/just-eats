import { ConfigModuleOptions } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import * as Joi from 'joi';
import { ConnectionOptions } from 'typeorm';
import { __dev__, __prod__ } from './constants';

export const dotenvConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: __dev__ ? '.env.development' : '.env.test',
  ignoreEnvFile: __prod__, // dont use any env files on the prod // prod file in project is just for prod cross-env
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'testing')
      .required(),
    DB_HOST: Joi.string(),
    DB_PORT: Joi.number(),
    DB_USERNAME: Joi.string(),
    DB_PASSWORD: Joi.string(),
    DB_NAME: Joi.string(),

    PRIVATE_KEY: Joi.string().required(),

    MAILGUN_API_KEY: Joi.string().required(),
    MAILGUN_DOMAIN_NAME: Joi.string().required(),
    MAILGUN_FROM: Joi.string().required(),

    CLOUDINARY_CLOUD_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
  }),
};

export const graphqlConfig: GqlModuleOptions = {
  playground: __dev__,
  installSubscriptionHandlers: true,
  autoSchemaFile: true, // if true, types generated will be stored in memory unlike if path is given
  // Extract token from ws context  and put it in GraphQL context
  subscriptions: {
    'subscriptions-transport-ws': {
      onConnect: (connectionParams) => {
        // connectionParams contains token
        return { token: connectionParams['X-JWT'] }; // received by GraphQL context
      },
    },
  },
  // Extract token from HTTP req context and put it in GraphQL context
  context: ({ req }) => {
    if (req) {
      return { token: req.headers['x-jwt'] };
    }
  },
};

export const postgresConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
};
