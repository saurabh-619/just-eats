/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateDishInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateDishMutation
// ====================================================

export interface CreateDishMutation_createDish {
  __typename: "CreateDishOutput";
  ok: boolean;
  error: string | null;
}

export interface CreateDishMutation {
  createDish: CreateDishMutation_createDish;
}

export interface CreateDishMutationVariables {
  input: CreateDishInput;
}
