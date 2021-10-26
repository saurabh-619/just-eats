import { useQuery } from "@apollo/client";
import { appErrorVar } from "../store/store";
import { ME_QUERY } from "../utils/queries";
import { MeQuery } from "../__generated__/MeQuery";

export const useMe = () => {
  const { data, error, loading, refetch } = useQuery<MeQuery>(ME_QUERY);

  // if (error) {
  //   appErrorVar(error?.message);
  // }

  return { data, loading, refetch };
};
