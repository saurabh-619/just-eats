import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { t } from "react-native-tailwindcss";
import { useDispatch } from "react-redux";
import { setError } from "../redux/slices/msgSlice";
import { DeviceWidth } from "../utils/constants";
import { appColors, colorConstants } from "../utils/styles";

interface IFileInputProps {
  imgName: string;
  setImgName: React.Dispatch<React.SetStateAction<string>>;
  setFileMetadata: React.Dispatch<
    React.SetStateAction<DocumentPicker.DocumentResult | undefined>
  >;
}
const FileInput: React.FC<IFileInputProps> = ({
  imgName,
  setImgName,
  setFileMetadata,
}) => {
  const dispatch = useDispatch();

  const handleFileClicked = async () => {
    const selected = await DocumentPicker.getDocumentAsync({ type: "image/*" });

    if (selected.type === "cancel") {
      return dispatch(
        setError({
          msg: "Something went wrong. Please select the image again.",
        })
      );
    }

    if (selected.size! > 1 * 1000 * 1000) {
      return dispatch(
        setError({
          msg: `Size of the file (${(selected.size! / 1000000).toPrecision(
            2
          )} MB) is more than 1 MB.`,
        })
      );
    }

    if (Platform.OS === "ios") {
      // fileRef.current = selected.uri;
      selected.uri = selected.uri.replace("file:", "");
    } else {
      selected.uri = selected.uri;
    }
    setImgName(selected.name);
    setFileMetadata(selected);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={handleFileClicked}
      style={[styles.fileInputContainer]}
    >
      <Text style={styles.textColor}>
        {imgName === "" ? "Click to add an Image" : imgName}
      </Text>
      <Feather
        name="upload-cloud"
        style={[t.mL2, t.textBase, appColors.primary]}
      />
    </TouchableOpacity>
  );
};

export default FileInput;

const styles = StyleSheet.create({
  fileInputContainer: {
    marginTop: 25,
    width: DeviceWidth / 2,
    height: 100,
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 2,
    borderColor: colorConstants.secondary,
  },
  textColor: {
    color: colorConstants.primary,
  },
});
