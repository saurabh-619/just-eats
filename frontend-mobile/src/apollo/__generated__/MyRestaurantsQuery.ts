/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyRestaurantsQuery
// ====================================================

export interface MyRestaurantsQuery_myRestaurants_restaurants_category {
  __typename: "Category";
  id: number;
  name: string;
  slug: string;
  coverImg: string | null;
  restaurantCount: number;
}

export interface MyRestaurantsQuery_myRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  address: string;
  coverImg: string;
  isPromoted: boolean;
  category: MyRestaurantsQuery_myRestaurants_restaurants_category | null;
}

export interface MyRestaurantsQuery_myRestaurants {
  __typename: "MyRestaurantsOutput";
  ok: boolean;
  error: string | null;
  restaurants: MyRestaurantsQuery_myRestaurants_restaurants[] | null;
}

export interface MyRestaurantsQuery {
  myRestaurants: MyRestaurantsQuery_myRestaurants;
}
