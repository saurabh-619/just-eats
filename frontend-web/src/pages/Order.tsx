import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { appErrorVar } from "../store/store";
import {
  EDIT_ORDER_MUTATION,
  GET_ORDER_QUERY,
  ORDER_SUBSCRIPTION,
} from "../utils/queries";
import { useMe } from "./../hooks/useMe";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
} from "../__generated__/GetOrderQuery";
import { OrderStatus, UserRole } from "../__generated__/globalTypes";
import {
  OrderUpdatesSub,
  OrderUpdatesSubVariables,
} from "./../__generated__/OrderUpdatesSub";
import { useEffect } from "react";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
} from "../__generated__/EditOrderMutation";

interface IParams {
  id: string;
}

const Order = () => {
  const { id: orderId } = useParams<IParams>();
  const { data: userData } = useMe();

  const { data, loading, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER_QUERY, {
    variables: {
      input: {
        id: +orderId,
      },
    },
  });

  const [editOrderMutation] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER_MUTATION);

  if (data?.getOrder.error) {
    appErrorVar(data?.getOrder.error);
  }

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +orderId,
          status: newStatus,
        },
      },
    });
  };

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +orderId,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSub } }
        ) => {
          if (!data) return prev;
          console.log({ data });
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdate,
              },
            },
          };
        },
      });
    }
  }, [data]);

  return (
    <div className="flex justify-center mx-auto mt-24 app-container">
      <Helmet>
        <title>Order #{orderId} | just eats</title>
      </Helmet>
      <div className="flex flex-col justify-center w-full max-w-lg border border-gray-800">
        <h4 className="w-full py-5 text-xl text-center text-white bg-gray-800">
          Order #{orderId}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="grid gap-6 p-5 text-xl">
          <div className="pt-5 border-t border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="pt-5 border-t border-gray-700 ">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer.email}
            </span>
          </div>
          <div className="py-5 border-t border-b border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          {userData?.me.role === "Client" && (
            <span className="mt-5 mb-3 text-2xl text-center text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="app-submit-btn"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="app-submit-btn"
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className="mt-5 mb-3 text-2xl text-center text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="app-submit-btn"
                >
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="app-submit-btn"
                >
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className="mt-5 mb-3 text-2xl text-center text-lime-600">
              Thank you for using just eats
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
