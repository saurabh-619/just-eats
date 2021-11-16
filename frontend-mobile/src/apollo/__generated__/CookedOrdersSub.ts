/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: CookedOrdersSub
// ====================================================

export interface CookedOrdersSub_cookedOrder_customer {
  __typename: "User";
  id: number;
  email: string;
}

export interface CookedOrdersSub_cookedOrder_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface CookedOrdersSub_cookedOrder_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
}

export interface CookedOrdersSub_cookedOrder {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: CookedOrdersSub_cookedOrder_customer;
  driver: CookedOrdersSub_cookedOrder_driver | null;
  restaurant: CookedOrdersSub_cookedOrder_restaurant | null;
}

export interface CookedOrdersSub {
  cookedOrder: CookedOrdersSub_cookedOrder;
}
