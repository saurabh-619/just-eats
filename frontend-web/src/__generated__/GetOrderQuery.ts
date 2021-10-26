/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrderInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetOrderQuery
// ====================================================

export interface GetOrderQuery_getOrder_order_customer {
  __typename: "User";
  id: number;
  email: string;
}

export interface GetOrderQuery_getOrder_order_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface GetOrderQuery_getOrder_order_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
}

export interface GetOrderQuery_getOrder_order {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: GetOrderQuery_getOrder_order_customer;
  driver: GetOrderQuery_getOrder_order_driver | null;
  restaurant: GetOrderQuery_getOrder_order_restaurant | null;
}

export interface GetOrderQuery_getOrder {
  __typename: "GetOrderOutput";
  ok: boolean;
  error: string | null;
  order: GetOrderQuery_getOrder_order | null;
}

export interface GetOrderQuery {
  getOrder: GetOrderQuery_getOrder;
}

export interface GetOrderQueryVariables {
  input: GetOrderInput;
}
