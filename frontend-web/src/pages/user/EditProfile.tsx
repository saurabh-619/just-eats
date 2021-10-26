import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import FormError from "../../components/FormError";
import { appErrorVar } from "../../store/store";
import { EDIT_PROFILE_MUTATION } from "../../utils/queries";
import { editProfileFormSchema } from "../../utils/yup-schemas";
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from "../../__generated__/EditProfileMutation";
import AppButton from "./../../components/AppButton";
import { useMe } from "./../../hooks/useMe";

interface IFormProps {
  email?: string;
  password?: string;
}

const EditProfile = () => {
  const history = useHistory();
  const { data: userData, refetch: refetchUser } = useMe();

  const onCompleted = async (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;

    if (ok && userData) {
      await refetchUser();
      history.push("/restaurants");
    }
  };

  const [editProfileMutation, { loading, error }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });

  if (error) {
    appErrorVar(error.message);
  }

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = useForm<IFormProps>({
    resolver: yupResolver(editProfileFormSchema),
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email || "saurabhbomble107@gmail.com",
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfileMutation({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-36">
      <Helmet>
        <title>Edit profile | just eats</title>
      </Helmet>
      <h4>Edit Profile</h4>
      <form
        className="grid w-full max-w-sm gap-3 mt-5 md:max-w-md lg:max-w-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="email"
          className="mb-3 app-input"
          {...register("email")}
        />
        <FormError errorMessage={errors.email?.message} />
        <input
          type="password"
          placeholder="password"
          className="mb-3 app-input"
          {...register("password")}
        />
        <FormError errorMessage={errors.password?.message} />

        <AppButton
          actionText="Update profile"
          loading={loading}
          canClick={isValid}
        />
      </form>
    </div>
  );
};

export default EditProfile;
