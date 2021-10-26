import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import RestaurantCard from "../../components/RestaurantCard";
import { appErrorVar } from "../../store/store";
import { MY_RESTAURANTS_QUERY } from "../../utils/queries";
import { MyRestaurantsQuery } from "../../__generated__/MyRestaurantsQuery";

const MyRestaurants = () => {
  const { data, loading } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);

  if (data?.myRestaurants.error) {
    appErrorVar(data?.myRestaurants.error);
  }
  console.log({ data });
  return (
    <div>
      <Helmet>
        <title>My Restaurants | just eats</title>
      </Helmet>
      <div className="mx-auto mt-24 app-container">
        <h2 className="mb-10 text-4xl font-medium">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data?.myRestaurants?.restaurants?.length === 0 ? (
          <>
            <h4 className="mb-5 text-xl">You have no restaurants.</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="grid mt-16 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants?.restaurants?.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRestaurants;
