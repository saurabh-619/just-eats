/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderUpdateInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OrderUpdatesSub
// ====================================================

export interface OrderUpdatesSub_orderUpdate_customer {
  __typename: "User";
  id: number;
  email: string;
}

export interface OrderUpdatesSub_orderUpdate_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface OrderUpdatesSub_orderUpdate_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
}

export interface OrderUpdatesSub_orderUpdate {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: OrderUpdatesSub_orderUpdate_customer;
  driver: OrderUpdatesSub_orderUpdate_driver | null;
  restaurant: OrderUpdatesSub_orderUpdate_restaurant | null;
}

export interface OrderUpdatesSub {
  orderUpdate: OrderUpdatesSub_orderUpdate;
}

export interface OrderUpdatesSubVariables {
  input: OrderUpdateInput;
}
