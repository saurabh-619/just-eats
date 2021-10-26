import { useMutation, useQuery } from "@apollo/client";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import DishCard from "../../components/DishCard";
import Loading from "../../components/Loading";
import { appErrorVar } from "../../store/store";
import { CREATE_ORDER_MUTATION, RESTAURANT_QUERY } from "../../utils/queries";
import { RestaurantQuery } from "../../__generated__/RestaurantQuery";
import { RestaurantQueryVariables } from "./../../__generated__/RestaurantQuery";
import { DishOption } from "../../components/DishOption";
import { useState } from "react";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import toast from "react-hot-toast";
import {
  CreateOrderMutation,
  CreateOrderMutationVariables,
} from "../../__generated__/CreateOrderMutation";

interface IParamsProps {
  id: string;
}

const Restaurant = () => {
  const history = useHistory();
  const { id: restaurantId } = useParams<IParamsProps>();

  const { data, loading } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +restaurantId,
        },
      },
    }
  );

  if (data?.restaurant.error) {
    appErrorVar(data?.restaurant.error);
  }

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);

    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((option) => option.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((curr) => [
          {
            dishId,
            options: [{ name: optionName }, ...oldItem.options!],
          },
          ...curr,
        ]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...current,
      ]);
      return;
    }
  };

  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const onPlacingTheOrder = (data: CreateOrderMutation) => {
    const {
      createOrder: { ok, error, orderId },
    } = data;

    if (error) {
      return appErrorVar(error);
    }
    history.push(`/orders/${orderId}`);

    toast.remove();
    toast.success("Order created successfully");

    setOrderStarted(false);
    setOrderItems([]);
  };

  const [createOrderMutation, { loading: isPlacingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, { onCompleted: onPlacingTheOrder });

  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      toast.remove();
      return toast.error("Can't place an empty order");
    }
    const ok = window.confirm("Shall we proceed to place the order?");
    if (!ok) {
      return toast.error("Order cancelled by the user");
    }
    if (ok && !isPlacingOrder) {
      createOrderMutation({
        variables: {
          input: { restaurantId: +restaurantId, items: orderItems },
        },
      });
   }
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pb-10">
      <div
        className="py-20 bg-gray-800 bg-center bg-cover md:py-40 "
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="w-5/12 py-4 pl-6 bg-white md:w-2/6 sm:pl-8 lg:pl-40 ">
          <h4 className="mb-3 text-2xl font-semibold md:text-4xl">
            {data?.restaurant.restaurant?.name}
          </h4>
          <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
            <h5 className="mb-2 text-base font-light hover:underline">
              {data?.restaurant.restaurant?.category?.name}
            </h5>
          </Link>
          <h6 className="text-base font-light">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="mr-2 text-lime-500"
            />
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="flex flex-col items-end pb-32 mx-auto mt-20 app-container">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="px-10 app-submit-btn">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button
              onClick={triggerConfirmOrder}
              className="px-10 mr-3 app-submit-btn"
            >
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="px-10 bg-black app-submit-btn hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}

        <div className="grid mt-16 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
          {/* @ts-ignore */}
          {data?.restaurant.restaurant.menu.map((dish, index) => (
            <DishCard
              key={index}
              id={dish.id}
              name={dish.name}
              desc={dish.desc}
              price={dish.price}
              photo={dish.photo || ""}
              isCustomer={true}
              options={dish.options}
              orderStarted={orderStarted}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
              isSelected={isSelected(dish.id)}
            >
              <div className="grid items-center grid-cols-2 gap-2">
                {dish.options?.map((option, index) => (
                  <DishOption
                    key={index}
                    dishId={dish.id}
                    isSelected={isOptionSelected(dish.id, option.name)}
                    name={option.name}
                    extra={option.extra}
                    addOptionToItem={addOptionToItem}
                    removeOptionFromItem={removeOptionFromItem}
                  />
                ))}
              </div>
            </DishCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
