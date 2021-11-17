import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { colorConstants, fontConstants } from "../utils/styles";

interface IAppInput extends FieldValues {
  placeholder: string;
  isPassword?: boolean;
  isEmail?: boolean;
}

const AppInput: React.FC<IAppInput> = ({
  control,
  name,
  placeholder,
  isPassword = false,
  isEmail = false,
}) => {
  return (
    <Controller
      control={control}
      render={({ field: { onBlur, onChange, value } }) => (
        <TextInput
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          style={styles.appInput}
          secureTextEntry={isPassword}
          keyboardType={isEmail ? "email-address" : "default"}
        />
      )}
      name={name}
    />
  );
};

export default AppInput;

const styles = StyleSheet.create({
  appInput: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: fontConstants.regular,
    backgroundColor: colorConstants.white,
    borderRadius: 6,
    marginTop: 20,
  },
});
