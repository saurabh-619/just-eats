import { Helmet } from "react-helmet-async";
import AppButton from "../../components/AppButton";
import FormError from "../../components/FormError";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
  CREATE_RESTAURANT_MUTATION,
  MY_RESTAURANTS_QUERY,
} from "./../../utils/queries";
import { CreateRestaurantMutation } from "../../__generated__/CreateRestaurantMutation";
import { CreateRestaurantMutationVariables } from "./../../__generated__/CreateRestaurantMutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { addRestaurantFormSchema } from "../../utils/yup-schemas";
import { useState } from "react";
import { appErrorVar } from "./../../store/store";
import { useHistory } from "react-router";
import { useApolloClient } from "@apollo/client";

export interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  inputCoverImg: string;
}

const IMG_UPLOAD_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/uploads"
    : "https://just-eats-api.herokuapp.com/uploads";

const AddRestaurant = () => {
  const history = useHistory();
  const client = useApolloClient();
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const onCompleted = (data: CreateRestaurantMutation) => {
    const { inputCoverImg, name, address, categoryName } = getValues();

    const {
      createRestaurant: { ok, error, restaurantId },
    } = data;

    if (error) {
      appErrorVar(error);
    }

    if (ok) {
      setUploading(false);
    }

    // Add newly added restaurant into cache
    const oldQuery = client.readQuery({ query: MY_RESTAURANTS_QUERY });
    console.log({ oldQuery });
    client.writeQuery({
      query: MY_RESTAURANTS_QUERY,
      data: {
        myRestaurants: {
          ...oldQuery.myRestaurants,
          restaurants: [
            {
              __typename: "Restaurant",
              id: restaurantId,
              name,
              address,
              coverImg: imgUrl,
              category: {
                name: categoryName,
                __typename: "Category",
              },
            },
            ...oldQuery.myRestaurants.restaurants,
          ],
        },
      },
    });
    history.push("/my-restaurants");
  };
  const [createRestaurantMutation] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    resolver: yupResolver(addRestaurantFormSchema),
    mode: "onChange",
  });

  const onSubmit = async () => {
    const { inputCoverImg, name, address, categoryName } = getValues();
    try {
      setUploading(true);
      const actualFile = inputCoverImg[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch(IMG_UPLOAD_URL, {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImgUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            address,
            categoryName,
            name,
            coverImg,
          },
        },
      });
    } catch (e) {
      console.log({ e });
    }
  };
  return (
    <div className="container flex flex-col items-center mt-36">
      <Helmet>
        <title>Add Restaurant | just eats</title>
      </Helmet>
      <h4 className="mb-3 text-2xl font-semibold">Add Restaurant</h4>
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
        {errors?.name?.message && (
          <FormError errorMessage={errors?.name.message} />
        )}
        <input
          className="app-input"
          type="text"
          placeholder="Address"
          {...register("address")}
        />
        {errors?.address?.message && (
          <FormError errorMessage={errors?.address.message} />
        )}
        <input
          className="app-input"
          type="text"
          placeholder="Category Name"
          {...register("categoryName")}
        />
        {errors?.categoryName?.message && (
          <FormError errorMessage={errors?.categoryName.message} />
        )}
        <div>
          <input
            type="file"
            multiple={false}
            accept="image/*"
            {...register("inputCoverImg", { required: true })}
          />
        </div>
        <AppButton
          loading={uploading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
      </form>
    </div>
  );
};

export default AddRestaurant;
