import { Toaster } from "react-hot-toast";
import { useAppError } from "../hooks/useAppError";
import AppRoutes from "../routers/AppRoutes";

function App() {
  // const isLoggedIn = useReactiveVar(isLoggedInVar);
  // console.log({ isLoggedIn });
  useAppError();

  return (
    <>
      {/* <AppPresenter isLoggedIn={isLoggedIn} /> */}
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
