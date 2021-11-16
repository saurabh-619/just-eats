/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: PendingOrdersSub
// ====================================================

export interface PendingOrdersSub_pendingOrder_customer {
  __typename: "User";
  id: number;
  email: string;
}

export interface PendingOrdersSub_pendingOrder_driver {
  __typename: "User";
  id: number;
  email: string;
}

export interface PendingOrdersSub_pendingOrder_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
}

export interface PendingOrdersSub_pendingOrder {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  customer: PendingOrdersSub_pendingOrder_customer;
  driver: PendingOrdersSub_pendingOrder_driver | null;
  restaurant: PendingOrdersSub_pendingOrder_restaurant | null;
}

export interface PendingOrdersSub {
  pendingOrder: PendingOrdersSub_pendingOrder;
}
