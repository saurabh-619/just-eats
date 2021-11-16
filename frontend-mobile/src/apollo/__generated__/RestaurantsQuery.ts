/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInputDto } from "./globalTypes";

// ====================================================
// GraphQL query operation: RestaurantsQuery
// ====================================================

export interface RestaurantsQuery_allRestaurants_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
  coverImg: string | null;
  restaurantCount: number;
}

export interface RestaurantsQuery_allRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  address: string;
  coverImg: string;
  isPromoted: boolean;
  category: RestaurantsQuery_allRestaurants_restaurants_category | null;
}

export interface RestaurantsQuery_allRestaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalItems: number | null;
  restaurants: RestaurantsQuery_allRestaurants_restaurants[] | null;
}

export interface RestaurantsQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface RestaurantsQuery_allCategories {
  __typename: "GetAllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: RestaurantsQuery_allCategories_categories[] | null;
}

export interface RestaurantsQuery {
  allRestaurants: RestaurantsQuery_allRestaurants;
  allCategories: RestaurantsQuery_allCategories;
}

export interface RestaurantsQueryVariables {
  input: RestaurantsInputDto;
}
