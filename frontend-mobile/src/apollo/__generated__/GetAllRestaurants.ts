/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInputDto } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAllRestaurants
// ====================================================

export interface GetAllRestaurants_allRestaurants_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface GetAllRestaurants_allRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  address: string;
  isPromoted: boolean;
  category: GetAllRestaurants_allRestaurants_restaurants_category | null;
}

export interface GetAllRestaurants_allRestaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalItems: number | null;
  restaurants: GetAllRestaurants_allRestaurants_restaurants[] | null;
}

export interface GetAllRestaurants {
  allRestaurants: GetAllRestaurants_allRestaurants;
}

export interface GetAllRestaurantsVariables {
  input: RestaurantsInputDto;
}
