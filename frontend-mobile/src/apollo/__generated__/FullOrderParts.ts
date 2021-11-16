/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: FullOrderParts
// ====================================================

export interface FullOrderParts_customer {
  __typename: "User";
  id: number;
  email: string;
}

export interface FullOrderParts_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface FullOrderParts_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
}

export interface FullOrderParts {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: FullOrderParts_customer;
  driver: FullOrderParts_driver | null;
  restaurant: FullOrderParts_restaurant | null;
}
