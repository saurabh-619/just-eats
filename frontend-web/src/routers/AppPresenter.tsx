import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "../components/Header";
import NotFound from "../pages/404";
import Restaurant from "../pages/client/Restaurant";
import Restaurants from "../pages/client/Restaurants";
import Search from "../pages/client/Search";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ConfirmEmail from "../pages/user/ConfirmEmail";
import EditProfile from "../pages/user/EditProfile";
import Category from "./../pages/client/Category";

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.FC<IProps> = ({ isLoggedIn }) => {
  console.log({ isLoggedIn });
  return isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />;
};

const LoggedOutRoutes = () => (
  <Router>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

const LoggedInRoutes = () => (
  <Router>
    <Header />
    <Switch>
      <Route exact path="/restaurants" component={Restaurants} />
      <Route exact path="/restaurant/:id" component={Restaurant} />
      <Route exact path="/category/:slug" component={Category} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/confirm" component={ConfirmEmail} />
      <Route exact path="/edit-profile" component={EditProfile} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default AppPresenter;
