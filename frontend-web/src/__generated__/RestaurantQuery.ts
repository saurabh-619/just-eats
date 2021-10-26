/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInputDto } from "./globalTypes";

// ====================================================
// GraphQL query operation: RestaurantQuery
// ====================================================

export interface RestaurantQuery_restaurant_restaurant_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface RestaurantQuery_restaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface RestaurantQuery_restaurant_restaurant_menu_options {
  __typename: "DishOptions";
  name: string;
  extra: number | null;
  choices: RestaurantQuery_restaurant_restaurant_menu_options_choices[] | null;
}

export interface RestaurantQuery_restaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  desc: string;
  price: number;
  photo: string | null;
  options: RestaurantQuery_restaurant_restaurant_menu_options[] | null;
}

export interface RestaurantQuery_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  address: string;
  coverImg: string;
  isPromoted: boolean;
  category: RestaurantQuery_restaurant_restaurant_category | null;
  menu: RestaurantQuery_restaurant_restaurant_menu[] | null;
}

export interface RestaurantQuery_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: RestaurantQuery_restaurant_restaurant | null;
}

export interface RestaurantQuery {
  restaurant: RestaurantQuery_restaurant;
}

export interface RestaurantQueryVariables {
  input: RestaurantInputDto;
}
