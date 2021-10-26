/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: SearchRestaurantQuery
// ====================================================

export interface SearchRestaurantQuery_searchRestaurant_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
}

export interface SearchRestaurantQuery_searchRestaurant_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  address: string;
  coverImg: string;
  isPromoted: boolean;
  category: SearchRestaurantQuery_searchRestaurant_restaurants_category | null;
}

export interface SearchRestaurantQuery_searchRestaurant {
  __typename: "SearchRestaurantOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalItems: number | null;
  restaurants: SearchRestaurantQuery_searchRestaurant_restaurants[];
}

export interface SearchRestaurantQuery {
  searchRestaurant: SearchRestaurantQuery_searchRestaurant;
}

export interface SearchRestaurantQueryVariables {
  input: SearchRestaurantInput;
}
