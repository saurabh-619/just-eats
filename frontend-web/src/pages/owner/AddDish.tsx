import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import AppButton from "./../../components/AppButton";
import { useMutation } from "@apollo/client";
import { CREATE_DISH_MUTATION, MY_RESTAURANT_QUERY } from "../../utils/queries";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDishFormSchema } from "../../utils/yup-schemas";
import FormError from "../../components/FormError";
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from "../../__generated__/CreateDishMutation";
import { useState } from "react";

interface IParams {
  id: string;
}

interface IAddDishForm {
  name: string;
  price: string;
  desc: string;
  [key: string]: string;
}

const AddDish = () => {
  const { id: restaurantId } = useParams<IParams>();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<IAddDishForm>({
    resolver: yupResolver(addDishFormSchema),
    mode: "onChange",
  });

  const onCompleted = (data: CreateDishMutation) => {};

  const [createDishMutation, { loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    onCompleted,
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { input: { id: +restaurantId } },
      },
    ],
  });

  const onSubmit = () => {
    const { name, desc, price, ...rest } = getValues();

    const optionsObjects = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));

    console.log({ name, desc, price, rest, optionsObjects });
    createDishMutation({
      variables: {
        input: {
          name,
          desc,
          price: +price,
          restaurantId: +restaurantId,
          options: optionsObjects,
        },
      },
    });
    history.goBack();
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((opt) => opt !== idToDelete));
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-24 app-container">
      <Helmet>
        <title>Add Dish | just eats</title>
      </Helmet>
      <h4 className="mb-3 text-2xl font-semibold">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full max-w-screen-sm gap-3 mt-5 mb-5"
      >
        <input
          className="app-input"
          type="text"
          placeholder="Name"
          {...register("name")}
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
        <input
          className="app-input"
          type="number"
          placeholder="Price"
          {...register("price")}
        />
        {errors.price?.message && (
          <FormError errorMessage={errors.price?.message} />
        )}
        <input
          className="app-input"
          type="text"
          placeholder="Description"
          {...register("desc")}
        />
        {errors.desc?.message && (
          <FormError errorMessage={errors.desc?.message} />
        )}
        <div className="my-10">
          <h4 className="mb-3 text-lg font-medium">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="px-2 py-1 mt-5 text-white bg-gray-900 cursor-pointer bg-"
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName`)}
                  className="px-4 py-2 mr-3 border-2 focus:outline-none focus:border-gray-600"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  {...register(`${id}-optionExtra`)}
                  className="px-4 py-2 border-2 focus:outline-none focus:border-gray-600"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />
                <span
                  className="px-4 py-3 mt-5 ml-3 text-white bg-red-500 cursor-pointer bg-"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <AppButton
          loading={loading}
          canClick={isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  );
};

export default AddDish;
