import { useQuery } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Restaurants from "../pages/client/Restaurants";
import { appErrorVar } from "../store/store";
import { ME_QUERY } from "../utils/queries";
import { MeQuery } from "../__generated__/MeQuery";
import Header from "./../components/Header";

const ClientRoutes = () => (
  <Router>
    <Route exact path="/" component={Restaurants} />
  </Router>
);

const LoggedInRouter = () => {
  const { data, error, loading } = useQuery<MeQuery>(ME_QUERY);

  if (error) {
    appErrorVar(error?.message);
  }

  if (!data || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl font-medium tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>{data.me.role === "Client" && ClientRoutes}</Switch>
    </Router>
  );
};

export default LoggedInRouter;
