import { useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import Header from "../components/Header";
import { useMe } from "../hooks/useMe";
import NotFound from "../pages/404";
import Category from "../pages/client/Category";
import Restaurant from "../pages/client/Restaurant";
import Restaurants from "../pages/client/Restaurants";
import Search from "../pages/client/Search";
import Dashboard from "../pages/driver/Dashboard";
import Login from "../pages/Login";
import Order from "../pages/Order";
import AddDish from "../pages/owner/AddDish";
import AddRestaurant from "../pages/owner/AddRestaurant";
import MyRestaurant from "../pages/owner/MyRestaurant";
import MyRestaurants from "../pages/owner/MyRestaurants";
import Register from "../pages/Register";
import ConfirmEmail from "../pages/user/ConfirmEmail";
import EditProfile from "../pages/user/EditProfile";
import { isVerifiedVar } from "../store/store";
import { UserRole } from "../__generated__/globalTypes";

const AppRoutes = () => {
  const { data, loading } = useMe();

  const isLoggedIn = useReactiveVar(isLoggedInVar);
  isVerifiedVar(data?.me.verified + "");

  console.log({
    isLoggedIn,
    role: data?.me.role,
  });
  return (
    <Router>
      {isLoggedIn && <Header />}
      <Switch>
        {/* Not logged in routes */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />

        {/* Common routes */}
        {isLoggedIn && (
          <>
            <Route exact path="/orders/:id" component={Order} />
            <Route exact path="/confirm" component={ConfirmEmail} />
            <Route exact path="/edit-profile" component={EditProfile} />
            {/* Client routes */}
            {isLoggedIn && data?.me.role === UserRole.Client && (
              <>
                <Route exact path="/restaurants" component={Restaurants} />
                <Route exact path="/restaurants/:id" component={Restaurant} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/category/:slug" component={Category} />
              </>
            )}
            {/* Owner Routes */}
            {isLoggedIn && data?.me.role === UserRole.Owner && (
              <>
                <Route exact path="/my-restaurants" component={MyRestaurants} />
                <Route exact path="/add-restaurant" component={AddRestaurant} />
                <Route exact path="/restaurants/:id" component={MyRestaurant} />
                <Route
                  exact
                  path="/restaurants/:id/add-dish"
                  component={AddDish}
                />
              </>
            )}
            {/* Delivery Routes */}
            {isLoggedIn && data?.me.role === UserRole.Delivery && (
              <Route exact path="/" component={Dashboard} />
            )}
          </>
        )}

        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRoutes;
