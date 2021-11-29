import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { DocumentResult } from "expo-document-picker";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { t } from "react-native-tailwindcss";
import { useDispatch } from "react-redux";
import { CREATE_RESTAURANT_MUTATION } from "../../apollo/queries";
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from "../../apollo/__generated__/CreateRestaurantMutation";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import ActionButton from "../../components/Buttons/ActionButton";
import CategoryModal from "../../components/CategoryModal";
import FileInput from "../../components/FileInput";
import FormError from "../../components/FormError";
import { setError } from "../../redux/slices/msgSlice";
import { DeviceHeight } from "../../utils/constants";
import {
  appColors,
  colorConstants,
  commonStyles,
  getMarginTop,
} from "../../utils/styles";
import { AddRestaurantNavigationProps } from "../../utils/types";
import { BASE_API_URL } from "./../../utils/constants";
import { addRestaurantFormSchema } from "./../../utils/yup-schemas";

interface IRegisterForm {
  name: string;
  address: string;
  categoryName: string;
}

const AddRestaurant: React.FC<AddRestaurantNavigationProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const [isUploading, setUploading] = useState(false);

  const [fileMetadata, setFileMetadata] = useState<DocumentResult>();
  const [imgName, setImgName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("Indian");

  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegisterForm>({
    resolver: yupResolver(addRestaurantFormSchema),
    mode: "onChange",
  });

  const onCompleted = (data: CreateRestaurantMutation) => {
    if (data.createRestaurant.error) {
      setUploading(false);

      return dispatch(setError({ msg: data.createRestaurant.error }));
    }
    setUploading(false);

    navigation.navigate("MyRestaurants");
  };

  const [createRestaurant, { loading }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, { onCompleted: onCompleted });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { address, name } = getValues();

      if (fileMetadata?.type !== "cancel" && fileMetadata?.uri) {
        const formBody = new FormData();
        formBody.append("file", {
          uri: fileMetadata.uri,
          name: fileMetadata.name,
          // @ts-ignore
          type: fileMetadata.mimeType,
        });

        const resImg = await fetch(`${BASE_API_URL}/uploads`, {
          method: "POST",
          body: formBody,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });

        const { url: coverImg } = await resImg.json();

        console.log({ uri: coverImg });

        setImgUrl(coverImg);
        createRestaurant({
          variables: {
            input: {
              address,
              categoryName,
              name,
              coverImg,
            },
          },
        });
      }
    } catch (e: any) {
      console.log({ e: e });
      setUploading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.keyBoardContainer}>
      <View style={[commonStyles.appContainer, t.mB5]}>
        <Text style={commonStyles.appTitle}>new restaurant</Text>
        <Text style={[commonStyles.appHeading, getMarginTop(45).margin]}>
          New venture huhh 🥕
        </Text>
        <Text
          style={[
            commonStyles.appSubHeading,
            commonStyles.mV10,
            appColors.dark,
          ]}
        >
          Please enter the following details to create new restaurant
        </Text>

        {/* Form */}
        <View style={getMarginTop(35).margin}>
          <AppInput
            control={control}
            placeholder="Killer Pizza from Mars"
            name="name"
            isEmail={true}
          />
          {errors.name?.message && <FormError message={errors.name?.message} />}
          <AppInput
            control={control}
            placeholder="JM road, Pune, India"
            name="address"
          />
          {errors.address?.message && (
            <FormError message={errors.address?.message} />
          )}
          <CategoryModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setCategoryName={setCategoryName}
          />
          <AppSelect
            text={categoryName}
            onPress={() => setModalVisible(true)}
          />
          <FileInput
            setFileMetadata={setFileMetadata}
            imgName={imgName}
            setImgName={setImgName}
          />
          <ActionButton
            text="add restaurant"
            myStyles={getMarginTop(35).margin}
            isLoading={isUploading || loading}
            onClick={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddRestaurant;

const styles = StyleSheet.create({
  keyBoardContainer: {
    flex: 1,
    backgroundColor: colorConstants.bg,
    height: DeviceHeight,
  },
});
