import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { t } from "react-native-tailwindcss";
import { useDispatch } from "react-redux";
import { LOGIN_MUTATION, ME_QUERY } from "../apollo/queries";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../apollo/__generated__/LoginMutation";
import { MeQuery } from "../apollo/__generated__/MeQuery";
import AppInput from "../components/AppInput";
import ActionButton from "../components/Buttons/ActionButton";
import FormError from "../components/FormError";
import { setError } from "../redux/slices/msgSlice";
import { setToken } from "../redux/slices/tokenSlice";
import { setUser } from "../redux/slices/userSlice";
import { TOKEN_KEY } from "../utils/constants";
import { initialNavigation, setLocalStorage } from "../utils/helpers";
import { appColors, commonStyles, getMarginTop } from "../utils/styles";
import { LoginNavigationProps } from "../utils/types";
import { loginFormSchema } from "../utils/yup-schemas";

interface ILoginForm {
  email: string;
  password: string;
}

const Login: React.FC<LoginNavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const [totalLoading, setTotalLoading] = useState(false);

  const onUserFetched = (data: MeQuery) => {
    dispatch(setUser(data.me));
    setTotalLoading(false);

    console.log({ user: data.me });
    // Navigate
    initialNavigation(data.me.role, navigation);
  };

  const [fetchUser] = useLazyQuery<MeQuery>(ME_QUERY, {
    onCompleted: onUserFetched,
    fetchPolicy: "network-only",
    onError: (err: ApolloError) => {
      console.log({ err });
    },
  });

  const onLoginMutation = async ({ login }: LoginMutation) => {
    if (login.error) {
      setTotalLoading(false);
      dispatch(setError({ msg: login.error }));
      return;
    }

    dispatch(setToken(login.token));

    // Set token in localstorage
    await setLocalStorage(TOKEN_KEY, login.token);

    fetchUser({ variables: {} }); // crazy bug had to addd this empty variables
  };

  const onSubmit = () => {
    setTotalLoading(true);

    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };

  const [loginMutation] = useMutation<LoginMutation, LoginMutationVariables>(
    LOGIN_MUTATION,
    {
      onCompleted: onLoginMutation,
      onError: (err: ApolloError) => {
        console.log({ e: err });
      },
    }
  );

  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>({
    resolver: yupResolver(loginFormSchema),
    mode: "onChange",
  });

  return (
    <KeyboardAwareScrollView style={commonStyles.appContainer}>
      <View>
        <Text style={commonStyles.appTitle}>Login</Text>
        <Text style={[commonStyles.appHeading, getMarginTop(45).margin]}>
          Welcome back🙂
        </Text>
        <Text
          style={[
            commonStyles.appSubHeading,
            commonStyles.mV10,
            appColors.dark,
          ]}
        >
          Please sign in with your registered email
        </Text>

        {/* Form */}
        <View style={getMarginTop(40).margin}>
          <AppInput
            control={control}
            placeholder="johndoe@gmail.com"
            name="email"
            isEmail={true}
          />
          {errors.email?.message && (
            <FormError message={errors.email?.message} />
          )}
          <AppInput
            control={control}
            placeholder="password"
            name="password"
            isPassword
          />
          {errors.password?.message && (
            <FormError message={errors.password?.message} />
          )}
          <ActionButton
            text="login"
            myStyles={getMarginTop(35).margin}
            isLoading={totalLoading}
            onClick={handleSubmit(onSubmit)}
          />
        </View>
        <View style={[t.justifyCenter, t.flexRow, t.mT6]}>
          <Text style={[appColors.light]}>new to just eats?</Text>
          <Text
            onPress={() => navigation.replace("Register")}
            style={[t.mL1, appColors.primary, t.underline]}
          >
            create an account
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({});
