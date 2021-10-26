import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Helmet>
        <title>Not found | just eats</title>
      </Helmet>
      <h2 className="mb-3 text-3xl font-medium">404 | Page not found</h2>
      <h4 className="mb-5 text-base font-light">
        The page you're looking for does not exist or has moved.
      </h4>
      <Link to="/" className="hover:underline text-lime-600">
        Go back home &rarr;
      </Link>
    </div>
  );
};

export default NotFound;
