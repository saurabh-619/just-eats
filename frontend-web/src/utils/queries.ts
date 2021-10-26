import { gql } from "@apollo/client";
import {
  CATEGORY_FRAGMENT,
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "./fragments";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInputDto!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($createAccountInput: CreateAccountInputDto!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

// User queries
export const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

// Mutation
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmailMutation($input: VerifyEmailInputDto!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const EDIT_PROFILE_MUTATION = gql`
  mutation EditProfileMutation($input: EditProfileInputDto!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

// Category
// Queries
export const CATEGORY_QUERY = gql`
  query CategoryQuery($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalItems
      category {
        ...CategoryParts
        restaurants {
          ...RestaurantParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

// Restaurants
// query

export const RESTAURANTS_QUERY = gql`
  query RestaurantsQuery($input: RestaurantsInputDto!) {
    allRestaurants(input: $input) {
      ok
      error
      totalPages
      totalItems
      restaurants {
        ...RestaurantParts
      }
    }

    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const RESTAURANT_QUERY = gql`
  query RestaurantQuery($input: RestaurantInputDto!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const MY_RESTAURANT_QUERY = gql`
  query MyRestaurantQuery($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

export const MY_RESTAURANTS_QUERY = gql`
  query MyRestaurantsQuery {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const SEARCH_RESTAURANT_QUERY = gql`
  query SearchRestaurantQuery($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalItems
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

// Mutation
export const CREATE_RESTAURANT_MUTATION = gql`
  mutation CreateRestaurantMutation($input: CreateRestaurantDto!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

// Dishes

// Mutation
export const CREATE_DISH_MUTATION = gql`
  mutation CreateDishMutation($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

// Orders
// Mutation
export const GET_ORDER_QUERY = gql`
  query GetOrderQuery($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

export const EDIT_ORDER_MUTATION = gql`
  mutation EditOrderMutation($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

// Delivery man takes the cooked order
export const TAKE_ORDER_MUTATION = gql`
  mutation TakeOrderMutation($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

// Order subscriptions
// For client to see progress
export const ORDER_SUBSCRIPTION = gql`
  subscription OrderUpdatesSub($input: OrderUpdateInput!) {
    orderUpdate(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

// For Restaurant to get new(pending) orders
export const PENDING_ORDERS_SUB = gql`
  subscription PendingOrdersSub {
    pendingOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

// For drivers to get cooked orders
export const COOKED_ORDERS_SUB = gql`
  subscription CookedOrdersSub {
    cookedOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

// Payment
export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePaymentMutation($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;
