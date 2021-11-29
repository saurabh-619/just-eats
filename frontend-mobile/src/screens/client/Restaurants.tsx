import { useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { RESTAURANTS_QUERY } from "../../apollo/queries";
import {
  RestaurantsQuery,
  RestaurantsQueryVariables,
} from "../../apollo/__generated__/RestaurantsQuery";
import AppHeader from "../../components/AppHeader";
import AppLoader from "../../components/AppLoader";
import RestaurantCard from "../../components/RestaurantCard";
import { commonStyles, fontConstants } from "../../utils/styles";
import {
  CategoryType,
  RestaurantsNavigationProps,
  RestaurantType,
} from "../../utils/types";
import CategoryList from "./../../components/CategoryList";
import { colorConstants } from "./../../utils/styles";

const Restaurants: React.FC<RestaurantsNavigationProps> = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [noMore, setNoMore] = useState(false);

  const onCompleted = (data: RestaurantsQuery) => {
    const newRestaurants = data.allRestaurants.restaurants as RestaurantType[];
    setCategories(data.allCategories.categories as CategoryType[]);

    if (newRestaurants.length === 0) {
      setNoMore(true);
    } else {
      setNoMore(false);
    }
    setRestaurants((prev) => [...prev, ...newRestaurants]);
  };

  const { loading } = useQuery<RestaurantsQuery, RestaurantsQueryVariables>(
    RESTAURANTS_QUERY,
    {
      variables: {
        input: {
          page,
        },
      },
      onCompleted: onCompleted,
    }
  );

  const fetchMoreItems = () => {
    if (!noMore) {
      console.log("Fetching next ...");
      setPage((prev) => prev + 1);
    }
  };

  const FooterComponent = () => {
    return loading ? <AppLoader color={colorConstants.primary} /> : null;
  };

  const RenderItem = useCallback(
    ({ item }: { item: RestaurantType }) => {
      return <RestaurantCard item={item} />;
    },
    [restaurants]
  );

  return (
    <View style={commonStyles.appContainer}>
      <AppHeader heading="restaurants" />
      <CategoryList categories={categories} />
      <View style={styles.listWrapper}>
        <FlatList
          initialNumToRender={10}
          contentContainerStyle={styles.list}
          removeClippedSubviews={true}
          data={restaurants}
          renderItem={RenderItem}
          showsVerticalScrollIndicator={false}
          disableScrollViewPanResponder={true}
          onEndReachedThreshold={0}
          onEndReached={fetchMoreItems}
          ListFooterComponent={FooterComponent}
        />
      </View>
      {noMore && (
        <View style={styles.noMoreWrapper}>
          <Text style={styles.noMoreText}>
            {restaurants.length === 0
              ? "No restaurants listed."
              : "No more restaurants"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Restaurants;

const styles = StyleSheet.create({
  listWrapper: {
    marginTop: 40,
  },
  list: {
    paddingBottom: 180,
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
