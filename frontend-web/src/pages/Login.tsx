import { Helmet } from "react-helmet-async";
import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FormError from "../components/FormError";
import { appErrorVar } from "../store/store";
import { LOGIN_MUTATION } from "../utils/queries";
import { loginFormSchema } from "../utils/yup-schemas";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";
import logo from "../images/logo.svg";
import AppButton from "../components/AppButton";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../utils/constants";
import { useHistory } from "react-router-dom";
import { History } from "history";

export interface ILoginForm {
  email: string;
  password: string;
}

const nextScreen = (history: History<unknown>) => {
  history.push("/restaurants");
};

const Login = () => {
  const history = useHistory();

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);

      // Redirect
      nextScreen(history);
    }
  };

  const [loginMutation, { loading, data }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, { onCompleted });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    resolver: yupResolver(loginFormSchema),
    mode: "onChange",
  });

  const login = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  if (data?.login.error) {
    appErrorVar(data?.login.error);
  }

  return (
    <div className="flex flex-col items-center mt-10 md:mt-16 lg:mt-32">
      <Helmet>
        <title>Login | just eats</title>
      </Helmet>
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <img src={logo} alt="logo" className="w-56 mx-auto mb-5" />
        <h2 className="mt-10 mb-5 text-2xl font-normal">Welcome back</h2>
        <form className="flex flex-col mt-5" onSubmit={handleSubmit(login)}>
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
          <AppButton
            actionText="take me in"
            loading={loading}
            canClick={isValid}
          />
          <h3 className="mt-5 text-center ">
            new to just eats?
            <Link to="/register" className="ml-1 text-lime-600 hover:underline">
              create an account
            </Link>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Login;
