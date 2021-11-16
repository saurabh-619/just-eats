import * as yup from "yup";

export const loginFormSchema = yup.object({
  email: yup.string().required().email("email is invalid"),
  password: yup
    .string()
    .required("password is required")
    .min(4, "password length should be at least 4"),
});

export const createAccountFormSchema = yup.object({
  email: yup.string().required().email("email is invalid"),
  password: yup
    .string()
    .required("password is required")
    .min(4, "password length should be at least 4"),
});

export const editProfileFormSchema = yup.object({
  email: yup.string().email("email is invalid"),
});

export const searchResturantFormSchema = yup.object({
  searchTerm: yup
    .string()
    .min(3, "Need 3 characters atleast to search")
    .required(),
});

export const addRestaurantFormSchema = yup.object({
  name: yup.string().required("name is required"),
  address: yup.string().required("address is required"),
});

export const addDishFormSchema = yup.object({
  name: yup.string().required("name is required"),
  price: yup
    .string()
    .min(1, "Price should more than 0")
    .required("price is required"),
  desc: yup.string().required("desc is required"),
});
