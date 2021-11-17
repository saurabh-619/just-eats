import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";
import DishCard from "../../components/DishCard";
import { useMe } from "../../hooks/useMe";
import {
  CREATE_PAYMENT_MUTATION,
  MY_RESTAURANT_QUERY,
  PENDING_ORDERS_SUB,
} from "../../utils/queries";
import {
  CreatePaymentMutation,
  CreatePaymentMutationVariables,
} from "../../__generated__/CreatePaymentMutation";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../__generated__/MyRestaurantQuery";
import { appErrorVar } from "./../../store/store";
import { PendingOrdersSub } from "./../../__generated__/PendingOrdersSub";

interface IParams {
  id: string;
}

const MyRestaurant = () => {
  const { id: restaurantId } = useParams<IParams>();

  const onPaymentComplete = (data: CreatePaymentMutation) => {
    if (data?.createPayment?.error) {
      appErrorVar(data?.createPayment?.error);
    }
    if (data.createPayment.ok) {
      alert("Your restaurant is being promoted");
    }
  };

  const { data, loading } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      input: { id: +restaurantId },
    },
  });

  const [createPaymentMutation, { data: createPaymentResult }] = useMutation<
    CreatePaymentMutation,
    CreatePaymentMutationVariables
  >(CREATE_PAYMENT_MUTATION, { onCompleted: onPaymentComplete });

  if (data?.myRestaurant?.error) {
    appErrorVar(data?.myRestaurant.error);
  }

  const { data: userData } = useMe();
  // @ts-ignore
  const Paddle = window.Paddle;

  const triggerPaddle = () => {
    // set up the paddle
    Paddle.Setup({ vendor: 31465 });

    //checkout
    // @ts-ignore
    Paddle.Checkout.open({
      product: 638793,
      email: userData?.me.email,
      successCallback: (resData: any) => {
        createPaymentMutation({
          variables: {
            input: {
              transactionId: resData.checkout.id,
              restaurantId: +restaurantId,
            },
          },
        });
      },
    });
  };

  const history = useHistory();
  const { data: subscriptionData } =
    useSubscription<PendingOrdersSub>(PENDING_ORDERS_SUB);

  console.log({ subscriptionData });
  useEffect(() => {
    if (subscriptionData?.pendingOrder.id) {
      history.push(`/orders/${subscriptionData.pendingOrder.id}`);
    }
  }, [subscriptionData]);

  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || "Loading..."} | just eats
        </title>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Helmet>
      <div className="checkout-container"></div>
      <div
        className="bg-gray-700 bg-center bg-cover py-28"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="mx-auto app-container">
        <div className="mt-10">
          <h2 className="mb-10 text-3xl font-medium">
            {data?.myRestaurant.restaurant?.name || "Loading..."}
          </h2>
          <Link
            to={`/restaurants/${restaurantId}/add-dish`}
            className="block px-10 py-3 mb-3 mr-8 text-white bg-gray-800 md:inline"
          >
            Add Dish &rarr;
          </Link>
          <span
            onClick={triggerPaddle}
            className="px-10 py-3 text-white cursor-pointer bg-lime-700"
          >
            Buy Promotion &rarr;
          </span>
          <div className="mt-10">
            {/* @ts-ignore */}
            {data?.myRestaurant.restaurant?.menu.length === 0 ? (
              <h4 className="mb-5 text-base">
                No dishes available. Please upload a dish!
              </h4>
            ) : (
              <div className="grid mt-16 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                {/* @ts-ignore */}
                {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                  <DishCard
                    key={index}
                    name={dish.name}
                    desc={dish.desc}
                    price={dish.price}
                    photo={dish.photo || ""}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-20 mb-10">
            <h4 className="text-2xl font-medium text-center">Sales</h4>
            <div className="mx-auto mt-8">
              <VictoryChart
                height={650}
                theme={VictoryTheme.material}
                width={window.innerWidth + 150}
                domainPadding={120}
                containerComponent={<VictoryVoronoiContainer />}
              >
                <VictoryLine
                  interpolation="natural"
                  labels={({ datum }) => `$${datum.y}`}
                  labelComponent={
                    <VictoryLabel
                      renderInPortal
                      dy={-30}
                      style={{ fontSize: 20 }}
                    />
                  }
                  style={{ data: { strokeWidth: 5, stroke: "#4d7c0f" } }}
                  data={data?.myRestaurant.restaurant?.orders?.map((order) => ({
                    x: order.createdAt,
                    y: order.total,
                  }))}
                />
                <VictoryAxis
                  tickLabelComponent={<VictoryLabel renderInPortal />}
                  style={{
                    tickLabels: {
                      fontSize: 18,
                      fill: "#4d7c0f",
                      angle: 45,
                    } as any,
                  }}
                  tickFormat={(tick) => new Date(tick).toLocaleDateString()}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
