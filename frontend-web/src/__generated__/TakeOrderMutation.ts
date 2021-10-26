/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TakeOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: TakeOrderMutation
// ====================================================

export interface TakeOrderMutation_takeOrder {
  __typename: "TakeOrderOutput";
  ok: boolean;
  error: string | null;
}

export interface TakeOrderMutation {
  takeOrder: TakeOrderMutation_takeOrder;
}

export interface TakeOrderMutationVariables {
  input: TakeOrderInput;
}
