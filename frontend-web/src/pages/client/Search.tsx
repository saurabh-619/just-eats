import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router";
import { appErrorVar } from "../../store/store";
import { SEARCH_RESTAURANT_QUERY } from "../../utils/queries";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/SearchRestaurantQuery";

const Search = () => {
  const location = useLocation();
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [fetchRestaurantResults, { data, loading }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT_QUERY);

  useEffect(() => {
    const searchTerm = location.search.split("?term=")[1];
    if (!searchTerm) {
      history.replace("/restaurants");
    } else {
      fetchRestaurantResults({
        variables: {
          input: { page, query: searchTerm },
        },
      });
    }
  }, []);

  if (data?.searchRestaurant.error) {
    appErrorVar(data.searchRestaurant.error);
  }

  console.log({ data });
  return (
    <div>
      <Helmet>
        <title>Restaurants | just eats</title>
      </Helmet>
    </div>
  );
};

export default Search;
