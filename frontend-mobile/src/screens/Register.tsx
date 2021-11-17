import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { t } from "react-native-tailwindcss";
import { useDispatch } from "react-redux";
import { CREATE_ACCOUNT_MUTATION } from "../apollo/queries";
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
} from "../apollo/__generated__/CreateAccountMutation";
import { UserRole } from "../apollo/__generated__/globalTypes";
import AppInput from "../components/AppInput";
import AppSelect from "../components/AppSelect";
import ActionButton from "../components/Buttons/ActionButton";
import FormError from "../components/FormError";
import RoleBottomSheet from "../components/RoleBottomSheet";
import { setError, setSuccess } from "../redux/slices/msgSlice";
import { DeviceHeight } from "../utils/constants";
import {
  appColors,
  colorConstants,
  commonStyles,
  getMarginTop,
} from "../utils/styles";
import { RegisterNavigationProps } from "../utils/types";
import { createAccountFormSchema } from "../utils/yup-schemas";

interface IRegisterForm {
  email: string;
  password: string;
  role: UserRole;
}

const Register: React.FC<RegisterNavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const [totalLoading, setTotalLoading] = useState(false);

  const bottomSheetOffset = useSharedValue(1000);
  const [roleValue, setRoleValue] = useState<UserRole>(UserRole.Client);

  const onCreatedAccount = async ({ createAccount }: CreateAccountMutation) => {
    if (createAccount.error) {
      setTotalLoading(false);
      return dispatch(setError({ msg: createAccount.error }));
    }
    dispatch(setSuccess({ msg: "Registered successfully. Please log in." }));
    setTotalLoading(false);
    navigation.navigate("Login");
  };

  const [createAccountMutation] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, { onCompleted: onCreatedAccount });

  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegisterForm>({
    resolver: yupResolver(createAccountFormSchema),
    mode: "onChange",
  });

  const onSubmit = () => {
    setTotalLoading(true);
    const { email, password } = getValues();
    createAccountMutation({
      variables: {
        createAccountInput: {
          email,
          password,
          role: roleValue,
        },
      },
    });
  };

  return (
    <View style={styles.keyBoardContainer}>
      <View style={commonStyles.appContainer}>
        <Text style={commonStyles.appTitle}>Register</Text>
        <Text style={[commonStyles.appHeading, getMarginTop(45).margin]}>
          Hello There 👋
        </Text>
        <Text
          style={[
            commonStyles.appSubHeading,
            commonStyles.mV10,
            appColors.dark,
          ]}
        >
          Please enter the following details to get started
        </Text>

        {/* Form */}
        <View style={getMarginTop(35).margin}>
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
          <AppSelect
            text={roleValue}
            onPress={() => (bottomSheetOffset.value = 0)}
          />
          {errors.role?.message && <FormError message={errors.role?.message} />}
          <ActionButton
            text="register"
            myStyles={getMarginTop(35).margin}
            isLoading={totalLoading}
            onClick={handleSubmit(onSubmit)}
          />
        </View>
        <View style={[t.justifyCenter, t.flexRow, t.mT6]}>
          <Text style={[appColors.light]}>Already have an account?</Text>
          <Text
            onPress={() => navigation.replace("Login")}
            style={[t.mL1, appColors.primary, t.underline]}
          >
            login
          </Text>
        </View>
      </View>
      <RoleBottomSheet
        setRoleValue={setRoleValue}
        bottomSheetOffset={bottomSheetOffset}
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  keyBoardContainer: {
    flex: 1,
    backgroundColor: colorConstants.bg,
    height: DeviceHeight,
  },
});
