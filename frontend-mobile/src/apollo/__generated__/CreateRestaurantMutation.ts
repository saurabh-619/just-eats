/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRestaurantDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRestaurantMutation
// ====================================================

export interface CreateRestaurantMutation_createRestaurant {
  __typename: "CreateRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurantId: number | null;
}

export interface CreateRestaurantMutation {
  createRestaurant: CreateRestaurantMutation_createRestaurant;
}

export interface CreateRestaurantMutationVariables {
  input: CreateRestaurantDto;
}
