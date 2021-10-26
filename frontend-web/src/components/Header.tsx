import { useReactiveVar } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
import { isVerifiedVar } from "../store/store";

const Header = () => {
  const isVerified = useReactiveVar(isVerifiedVar);

  console.log({ isVerified });

  return (
    <>
      {isVerified === "false" && (
        <div className="p-3 text-center text-white bg-red-400">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="flex items-center justify-between mx-auto app-container ">
          <img src={logo} alt="logo" className="w-36" />
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
