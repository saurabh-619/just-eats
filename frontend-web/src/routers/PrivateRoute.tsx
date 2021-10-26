import { useReactiveVar } from "@apollo/client";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { isLoggedInVar } from "../apollo";

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        isLoggedIn ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: routeProps.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
