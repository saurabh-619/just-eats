import { ApolloError, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { MY_RESTAURANT_QUERY } from "../apollo/queries";
import { UserRole } from "../apollo/__generated__/globalTypes";
import {
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../apollo/__generated__/RestaurantQuery";
import PageLoader from "../components/PageLoader";
import { AllDishes } from "../components/Restaurant/AllDishes";
import { Sales } from "../components/Restaurant/owner/Sales";
import { ResturantHeader } from "../components/Restaurant/ResturantHeader";
import { useAppUser } from "../hooks/useAppUser";
import { setError } from "../redux/slices/msgSlice";
import { IOrderItem, resetOrder } from "../redux/slices/orderSlice";
import { RootState } from "../redux/store";
import { onBackPress } from "../utils/helpers";
import { colorConstants } from "../utils/styles";
import {
  MyRestaurantDetailsType,
  RestaurantDetailsType,
  RestaurantNavigationPros,
} from "../utils/types";
import { RESTAURANT_QUERY } from "./../apollo/queries";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "./../apollo/__generated__/MyRestaurantQuery";

const Restaurant: React.FC<RestaurantNavigationPros> = ({
  navigation,
  route: {
    params: { restaurant },
  },
}) => {
  const dispatch = useDispatch();
  const { user } = useAppUser();
  const order = useSelector((state: RootState) => state.order.value);
  const [restDetails, setRestDetails] = useState<
    MyRestaurantDetailsType | RestaurantDetailsType
  >();

  const onMyRestQueryCompleted = (data: MyRestaurantQuery) => {
    if (data.myRestaurant.error) {
      return dispatch(setError({ msg: data.myRestaurant.error }));
    }
    console.log("Owner Query ran");
    setRestDetails(data.myRestaurant.restaurant!);
  };

  const [myRestaurantQuery, { loading: myRestLoading }] = useLazyQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    onCompleted: onMyRestQueryCompleted,
    onError: (err: ApolloError) => console.log({ err }),
    variables: {
      input: { id: restaurant.id },
    },
  });

  const onRestQueryCompleted = (data: RestaurantQuery) => {
    if (data.restaurant.error) {
      return dispatch(setError({ msg: data.restaurant.error }));
    }
    console.log("Client Query ran");
    setRestDetails(data.restaurant.restaurant!);
  };

  const [restaurantQuery, { loading: restLoading }] = useLazyQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    onCompleted: onRestQueryCompleted,
    onError: (err: ApolloError) => console.log({ err }),
  });

  const handleBackPress = (order: IOrderItem[]) => {
    console.log({ order });

    if (order.length !== 0) {
      if (Platform.OS === "android") {
        Alert.alert(
          "Are you sure?",
          "Your order will be reset if you leave this resturant.",
          [
            { text: "cancel", onPress: () => {} },
            {
              text: "reset",
              style: "destructive",
              onPress: () => {
                dispatch(resetOrder());
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.prompt(
          "Are you sure?",
          "Your order will be reset if you leave this resturant.",
          [
            { text: "cancel", onPress: () => {} },
            {
              text: "reset",
              style: "destructive",
              onPress: () => {
                navigation.goBack();
                dispatch(resetOrder());
              },
            },
          ]
        );
      }
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    onBackPress(() => handleBackPress(order));
    if (user?.role === UserRole.Owner) {
      myRestaurantQuery();
    } else {
      restaurantQuery({
        variables: {
          input: { restaurantId: restaurant.id },
        },
      });
    }
  }, [user?.role]);

  if (restLoading || myRestLoading) {
    return <PageLoader color={colorConstants.primary} size={36} />;
  }

  return (
    <ScrollView
      style={styles.restWrapper}
      nestedScrollEnabled={true}
      contentContainerStyle={{
        justifyContent: "space-between",
      }}
    >
      <ResturantHeader
        address={restaurant.address}
        categoryCoverImg={restaurant.category?.coverImg!}
        restCoverImg={restaurant.coverImg}
        restName={restaurant.name}
        categoryName={restaurant.category?.name}
      />
      <AllDishes
        menu={restDetails?.menu!}
        role={user?.role!}
        restaurantId={restaurant.id}
      />
      {user?.role === UserRole.Owner &&
        restDetails &&
        restDetails.hasOwnProperty("orders") && (
          // @ts-ignore
          <Sales orders={restDetails?.orders!} />
        )}
    </ScrollView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  restWrapper: {
    flex: 1,
    backgroundColor: colorConstants.bg,
  },
});
