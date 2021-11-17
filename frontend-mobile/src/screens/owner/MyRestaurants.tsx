import { useLazyQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MY_RESTAURANTS_QUERY } from "../../apollo/queries";
import { MyRestaurantsQuery } from "../../apollo/__generated__/MyRestaurantsQuery";
import AppHeader from "../../components/AppHeader";
import AppLoader from "../../components/AppLoader";
import RestaurantCard from "../../components/RestaurantCard";
import { commonStyles, fontConstants } from "../../utils/styles";
import {
  MyRestaurantsNavigationProps,
  RestaurantType,
} from "../../utils/types";
import { colorConstants } from "./../../utils/styles";

const MyRestaurants: React.FC<MyRestaurantsNavigationProps> = ({
  navigation,
}) => {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onCompleted = (data: MyRestaurantsQuery) => {
    const newRestaurants = data.myRestaurants.restaurants as RestaurantType[];

    if (isRefreshing) {
      setIsRefreshing(false);
      return setRestaurants(() => [...newRestaurants]);
    }
    setRestaurants((prev) => [...prev, ...newRestaurants]);
  };

  const [fetchMyRestaurants, { loading }] = useLazyQuery<MyRestaurantsQuery>(
    MY_RESTAURANTS_QUERY,
    {
      fetchPolicy: "network-only",
      onCompleted: onCompleted,
    }
  );

  const FooterComponent = () => {
    return loading ? (
      <AppLoader color={colorConstants.primary} />
    ) : (
      <Text style={styles.noMoreText}>You've reached the end</Text>
    );
  };

  const RenderItem = useCallback(
    ({ item }: { item: RestaurantType }) => {
      // console.log({ item });
      return <RestaurantCard item={item} />;
    },
    [restaurants]
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMyRestaurants();
  };

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  return (
    <View style={commonStyles.appContainer}>
      <Pressable
        onPress={() =>
          navigation.navigate("OrderNotificationOwner", { orderId: 55 })
        }
      >
        <AppHeader heading="my restaurants" />
      </Pressable>
      <View style={styles.listWrapper}>
        <FlatList
          initialNumToRender={10}
          contentContainerStyle={styles.list}
          removeClippedSubviews={true}
          data={restaurants}
          renderItem={RenderItem}
          showsVerticalScrollIndicator={false}
          disableScrollViewPanResponder={true}
          ListFooterComponent={FooterComponent}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </View>
    </View>
  );
};
export default MyRestaurants;

const styles = StyleSheet.create({
  listWrapper: {
    marginTop: 40,
  },
  list: {
    paddingBottom: 80,
  },
  loaderWrapper: {
    paddingVertical: 300,
  },
  noMoreWrapper: {
    paddingBottom: 200,
    alignItems: "center",
  },
  noMoreText: {
    color: colorConstants.gray,
    fontSize: 18,
    fontFamily: fontConstants.light,
    textAlign: "center",
  },
});
