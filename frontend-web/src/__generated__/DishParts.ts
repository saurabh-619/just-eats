/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DishParts
// ====================================================

export interface DishParts_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface DishParts_options {
  __typename: "DishOptions";
  name: string;
  extra: number | null;
  choices: DishParts_options_choices[] | null;
}

export interface DishParts {
  __typename: "Dish";
  id: number;
  name: string;
  desc: string;
  price: number;
  photo: string | null;
  options: DishParts_options[] | null;
}
