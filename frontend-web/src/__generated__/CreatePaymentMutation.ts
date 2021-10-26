/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePaymentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePaymentMutation
// ====================================================

export interface CreatePaymentMutation_createPayment {
  __typename: "CreatePaymentOutput";
  ok: boolean;
  error: string | null;
}

export interface CreatePaymentMutation {
  createPayment: CreatePaymentMutation_createPayment;
}

export interface CreatePaymentMutationVariables {
  input: CreatePaymentInput;
}
