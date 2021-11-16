/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditOrderMutation
// ====================================================

export interface EditOrderMutation_editOrder {
  __typename: "EditOrderOutput";
  ok: boolean;
  error: string | null;
}

export interface EditOrderMutation {
  editOrder: EditOrderMutation_editOrder;
}

export interface EditOrderMutationVariables {
  input: EditOrderInput;
}
