import { useQuery } from "@apollo/client";
import { useState } from "react";
import RestaurantCard from "../../components/RestaurantCard";
import { appErrorVar } from "../../store/store";
import { RESTAURANTS_QUERY } from "../../utils/queries";
import {
  RestaurantsQuery,
  RestaurantsQueryVariables,
} from "../../__generated__/RestaurantsQuery";
import { yupResolver } from "@hookform/resolvers/yup";
import { searchResturantFormSchema } from "../../utils/yup-schemas";
import { useForm } from "react-hook-form";
import FormError from "../../components/FormError";
import { useHistory } from "react-router";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

interface IFormProps {
  searchTerm?: string;
}

const Restaurants = () => {
  const history = useHistory();

  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<
    RestaurantsQuery,
    RestaurantsQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  if (data?.allCategories.error) {
    appErrorVar(data?.allCategories.error);
  }

  if (data?.allRestaurants.error) {
    appErrorVar(data?.allRestaurants.error);
  }

  const onNextPageClicked = () => setPage((currPage) => currPage + 1);
  const onPrevPageClicked = () => setPage((currPage) => currPage - 1);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormProps>({
    resolver: yupResolver(searchResturantFormSchema),
    mode: "onChange",
  });

  const onSearch = (e: any) => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Restaurants | just eats</title>
      </Helmet>
      <form
        className="flex flex-col items-center justify-center w-full py-32 bg-gray-800"
        onSubmit={handleSubmit(onSearch)}
      >
        {/* Search */}
        <input
          type="Search"
          className="w-3/4 mb-2 border-0 rounded-md md:w-2/4 lg:w-1/3 app-input"
          placeholder="Search restaurants..."
          {...register("searchTerm")}
        />
        <FormError errorMessage={errors.searchTerm?.message} />
      </form>
      {!loading && (
        <div className="pb-20 mx-auto mt-3 app-container">
          {/* Categories */}
          <div className="flex justify-around max-w-xs mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full group-hover:bg-gray-100">
                    <div
                      className="bg-cover rounded-full w-14 h-14 "
                      style={{ backgroundImage: `url(${category.coverImg})` }}
                    ></div>
                  </div>
                  <span className="mt-1 text-sm font-semibold">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {/* Restaurants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-14 gap-x-5 gap-y-10">
            {data?.allRestaurants.restaurants?.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name}
                name={restaurant.name}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="grid items-center max-w-sm grid-cols-3 mx-auto mt-10 select-none">
            {page !== 1 ? (
              <button
                className="text-2xl font-bold focus:outline-none"
                onClick={onPrevPageClicked}
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="mx-2 md:mx-5">
              Page {page} of {data?.allRestaurants.totalPages}
            </span>
            {page !== data?.allRestaurants.totalPages && (
              <button
                className="text-2xl font-bold focus:outline-none"
                onClick={onNextPageClicked}
              >
                &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
