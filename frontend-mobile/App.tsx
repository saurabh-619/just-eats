import { ApolloProvider } from "@apollo/client";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { AppRegistry } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { getClient } from "./src/apollo/client";
import RootNavigation from "./src/navigation/RootNavigation";
import { setToken } from "./src/redux/slices/tokenSlice";
import { store } from "./src/redux/store";
import { TOKEN_KEY } from "./src/utils/constants";
import { getLocalStorage } from "./src/utils/helpers";

export default function App() {
  const [fontLoaded] = useFonts({
    nunitoLight: require("./assets/fonts/Nunito-Light.ttf"),
    nunitoRegular: require("./assets/fonts/Nunito-Regular.ttf"),
    nunitoBold: require("./assets/fonts/Nunito-Bold.ttf"),
  });

  const [loading, setLoading] = useState(true);

  const getTokenFromLocalStorage = async () => {
    const token = await getLocalStorage(TOKEN_KEY);
    store.dispatch(setToken(token));
    setLoading(false);
  };

  useEffect(() => {
    getTokenFromLocalStorage();
  }, []);

  if (!fontLoaded || loading) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <ApolloProvider client={getClient(store.getState().token.value!)}>
        <RootNavigation />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ApolloProvider>
    </Provider>
  );
}

AppRegistry.registerComponent("AppComponent", () => App);
