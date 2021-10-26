import { Helmet } from "react-helmet-async";
import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FormError from "../components/FormError";
import { appErrorVar } from "../store/store";
import logo from "../images/logo.svg";
import AppButton from "../components/AppButton";
import { CREATE_ACCOUNT_MUTATION } from "../utils/queries";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from "../__generated__/CreateAccountMutation";
import { useHistory } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";

import { createAccountFormSchema } from "../utils/yup-schemas";

export interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const Register = () => {
  const history = useHistory();

  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      // Redirect
      history.push("/login");
    }
  };

  const [createAccountMutation, { loading, data }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted: onCompleted,
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ICreateAccountForm>({
    resolver: yupResolver(createAccountFormSchema),
    mode: "onChange",
    defaultValues: { role: UserRole.Client },
  });
  const registerUser = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  if (data?.createAccount.error) {
    appErrorVar(data?.createAccount.error);
  }

  return (
    <div className="flex flex-col items-center mt-10 md:mt-16 lg:mt-32">
      <Helmet>
        <title>Register | just eats</title>
      </Helmet>
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <img src={logo} alt="logo" className="w-56 mx-auto mb-5" />
        <h2 className="mt-10 mb-5 text-2xl font-normal">Let's get started</h2>
        <form
          className="flex flex-col mt-5"
          onSubmit={handleSubmit(registerUser)}
        >
          <input
            className="mt-3 mb-2 app-input"
            type="text"
            placeholder="email"
            {...register("email")}
          />
          <FormError errorMessage={errors.email?.message} />
          <input
            className="mt-3 mb-2 app-input"
            type="password"
            placeholder="password"
            {...register("password")}
          />
          <FormError errorMessage={errors.password?.message} />
          <select className="mt-3 mb-2 app-input" {...register("role")}>
            {Object.keys(UserRole).map((role, index) => (
              <option key={index} className="p-5 hover:bg-lime-100">
                {role}
              </option>
            ))}
          </select>
          <FormError errorMessage={errors.role?.message} />
          <AppButton
            actionText="create my account"
            loading={loading}
            canClick={isValid}
          />
          <h3 className="mt-5 text-center ">
            Already have an account?
            <Link to="/login" className="ml-1 text-lime-600 hover:underline">
              log in
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Register;
