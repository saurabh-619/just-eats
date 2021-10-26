import { useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { appErrorVar } from "../store/store";

export const useAppError = () => {
  const error = useReactiveVar(appErrorVar);

  useEffect(() => {
    if (error.length) {
      toast.error(error);
    }
  }, [error]);
};
